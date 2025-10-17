// src/contexts/CartContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { cartAPI as cartApi } from "@/api/modules/cart";
import { useAuth } from "@/contexts/AuthContext";

/** Minimal product shape coming from anywhere in your app */
export type ProductProps = {
  id?: string | number;
  product_id?: string | number;
  _id?: string | number;
  name?: string;
  title?: string;
  price?: number | string;
  finalPrice?: number | string;
  sale_price?: number | string;
  image?: string;
  thumbnail?: string;
  images?: string[];
  [k: string]: any;
};

export type CartItem = {
  id: string | number;           // product id
  cartItemId?: number | string;  // server cart row id (if known)
  name: string;
  price: number;
  image?: string;
  quantity: number;
  product?: any;                 // original product (optional)
};

type CartContextType = {
  cart: CartItem[]; // alias
  items: CartItem[];
  total: number;
  loading: boolean;
  addItem: (product: ProductProps, quantity?: number) => Promise<void>;
  removeItem: (productId: string | number) => Promise<void>;
  updateQuantity: (productId: string | number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getItemCount: () => number;
  syncCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// --- storage keys
const GUEST_KEY = "cart_guest_v1";
const AUTH_MIRROR_PREFIX = "cart_user_";   // cart_user_<id>
const ROW_IDS_PREFIX = "cart_rowids_";     // cart_rowids_<id>

/** Key helpers for per-user storage */
const mirrorKey = (uid: string | number) => `${AUTH_MIRROR_PREFIX}${uid}`;
const rowIdsKey = (uid: string | number) => `${ROW_IDS_PREFIX}${uid}`;

// --- safe JSON helpers
const readJSON = <T,>(k: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const writeJSON = (k: string, v: any) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

// ---------------- utilities ----------------
const normalizeProduct = (p: ProductProps, quantity = 1): CartItem => {
  const id = (p.id ?? p.product_id ?? p._id) as string | number;
  const name = (p.name ?? p.title ?? `Product ${id}`) as string;
  const price = Number(p.price ?? p.finalPrice ?? p.sale_price ?? 0);
  const image = (p.image ?? p.thumbnail ?? p.images?.[0]) as string | undefined;
  return { id, name, price, image, quantity, product: p };
};

const pluckCartPayload = (res: any) => {
  const d = res?.data ?? res;
  const c = d?.cart ?? d?.data ?? d;
  const rawItems =
    c?.items ?? c?.cart_items ?? c?.cartItems ??
    (Array.isArray(c) ? c : []);
  const total =
    d?.total ?? c?.total ??
    (Array.isArray(rawItems)
      ? rawItems.reduce((s: number, i: any) => {
          const price = Number(i?.product?.price ?? i?.price ?? 0);
          const q = Number(i?.quantity ?? 1);
          return s + price * q;
        }, 0)
      : 0);
  return {
    rawItems: Array.isArray(rawItems) ? rawItems : [],
    total: Number(total) || 0,
  };
};

const normalizeServerItems = (data: any): CartItem[] => {
  const { rawItems } = pluckCartPayload(data);
  return rawItems.map((si: any) => ({
    id: si.product_id ?? si.product?.id ?? si.productId ?? si.id,
    cartItemId: si.id ?? si.cart_item_id ?? si.cartId,
    name: si.product?.name ?? si.name ?? `Product ${si.product_id ?? si.id}`,
    price: Number(si.product?.price ?? si.price ?? 0),
    image: si.product?.image ?? si.image,
    quantity: Number(si.quantity ?? 1),
    product: si.product ?? undefined,
  }));
};

// ---------------- provider ----------------
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const auth = useAuth();
  const isAuthenticated = !!auth?.user || !!localStorage.getItem("auth_token");

  const getUserId = (): number | string | undefined => {
    const id = (auth as any)?.user?.id;
    if (id != null) return id;
    try {
      const raw = localStorage.getItem("auth_user");
      if (!raw) return undefined;
      const parsed = JSON.parse(raw);
      return parsed?.id ?? parsed?.user_id;
    } catch {
      return undefined;
    }
  };

  // ----- read / write local depending on auth -----
  const loadLocal = (): CartItem[] => {
    const uid = getUserId();
    if (isAuthenticated && uid != null) {
      return readJSON<CartItem[]>(mirrorKey(uid), []);
    }
    return readJSON<CartItem[]>(GUEST_KEY, []);
  };

  const saveLocal = (list: CartItem[]) => {
    const uid = getUserId();
    if (isAuthenticated && uid != null) {
      writeJSON(mirrorKey(uid), list);
    } else {
      writeJSON(GUEST_KEY, list);
    }
  };

  const getRowIdsFor = (uid: number | string): number[] =>
    readJSON<number[]>(rowIdsKey(uid), []);
  const setRowIdsFor = (uid: number | string, ids: number[]) =>
    writeJSON(rowIdsKey(uid), ids);

  // ----- server sync helpers -----
  const fetchCartFromServer = async () => {
    setLoading(true);
    try {
      const uid = getUserId();
      if (isAuthenticated && uid != null) {
        // 1) Preferred: user_id route
        try {
          const r = await cartApi.getCartByUserId(uid);
          const mapped = normalizeServerItems(r);
          const { total } = pluckCartPayload(r);
          if (mapped.length) {
            setItems(mapped);
            setTotal(total || mapped.reduce((s, x) => s + x.price * x.quantity, 0));
            // also mirror locally per user
            writeJSON(mirrorKey(uid), mapped);
            return;
          }
        } catch {
          /* fallthrough to ids route */
        }

        // 2) Fallback: by row ids (if we have some)
        const ids = getRowIdsFor(uid);
        if (ids.length) {
          try {
            const r = await cartApi.getCartByRowIds(ids.join(","));
            const mapped = normalizeServerItems(r);
            const { total } = pluckCartPayload(r);
            if (mapped.length) {
              setItems(mapped);
              setTotal(total || mapped.reduce((s, x) => s + x.price * x.quantity, 0));
              writeJSON(mirrorKey(uid), mapped);
              return;
            }
          } catch {/* ignore */}
        }

        // 3) Final fallback: show whatever we mirrored for this user
        const localMirror = readJSON<CartItem[]>(mirrorKey(uid), []);
        setItems(localMirror);
        setTotal(localMirror.reduce((s, i) => s + i.price * i.quantity, 0));
        return;
      }

      // Guest: just show guest cart
      const guest = readJSON<CartItem[]>(GUEST_KEY, []);
      setItems(guest);
      setTotal(guest.reduce((s, i) => s + i.price * i.quantity, 0));
    } finally {
      setLoading(false);
    }
  };

  // Initial load & whenever auth state flips
  useEffect(() => {
    fetchCartFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Merge guest cart into server after login
  useEffect(() => {
    (async () => {
      if (!isAuthenticated) return;
      const uid = getUserId();
      if (uid == null) return;

      const guest = readJSON<CartItem[]>(GUEST_KEY, []);
      if (!guest.length) return;

      try {
        setLoading(true);
        const createdIds: number[] = [];
        for (const it of guest) {
          const res = await cartApi.addToCart({
            product_id: it.id,
            quantity: it.quantity,
            user_id: uid,
          });
          const createdId = res?.data?.id ?? res?.id;
          if (createdId != null) createdIds.push(Number(createdId));
        }
        if (createdIds.length) {
          const all = Array.from(new Set([...getRowIdsFor(uid), ...createdIds]));
          setRowIdsFor(uid, all);
        }
        // clear guest basket after merge
        localStorage.removeItem(GUEST_KEY);
        await fetchCartFromServer();
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const syncCart = async () => {
    if (isAuthenticated) await fetchCartFromServer();
  };

  // ---------------- actions ----------------
  const addItem = async (product: ProductProps, quantity = 1) => {
    const item = normalizeProduct(product, quantity);

    if (isAuthenticated) {
      const uid =
        getUserId() ||
        JSON.parse(localStorage.getItem("auth_user") || "{}")?.id;

      try {
        setLoading(true);
        const res = await cartApi.addToCart({
          product_id: item.id,
          quantity: item.quantity,
          user_id: uid, // IMPORTANT: your backend expects this
        });

        // remember newly created server row id if backend returns it
        const createdId = res?.data?.id ?? res?.id;
        if (createdId != null) {
          const existing = getRowIdsFor(uid);
          setRowIdsFor(uid, Array.from(new Set([...existing, Number(createdId)])));
        }

        // optimistic UI & mirror
        setItems((curr) => {
          const found = curr.find((i) => i.id === item.id);
          const next = found
            ? curr.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              )
            : [...curr, item];
          setTotal(next.reduce((s, x) => s + x.price * x.quantity, 0));
          writeJSON(mirrorKey(uid), next);
          return next;
        });
      } catch (e) {
        console.error("addToCart (auth) failed:", e);
        // even if API failed, keep mirror to avoid a bad UX
        setItems((curr) => {
          const found = curr.find((i) => i.id === item.id);
          const next = found
            ? curr.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              )
            : [...curr, item];
          setTotal(next.reduce((s, x) => s + x.price * x.quantity, 0));
          if (uid != null) writeJSON(mirrorKey(uid), next);
          return next;
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Guest cart
      setItems((curr) => {
        const found = curr.find((i) => i.id === item.id);
        const next = found
          ? curr.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          : [...curr, item];
        setTotal(next.reduce((s, x) => s + x.price * x.quantity, 0));
        writeJSON(GUEST_KEY, next);
        return next;
      });
    }
  };

  const removeItem = async (productId: string | number) => {
    if (isAuthenticated) {
      const uid = getUserId();
      try {
        setLoading(true);
        // if we know server row id, delete it there too
        const row = items.find((i) => i.id === productId);
        if (row?.cartItemId != null) {
          try {
            await cartApi.removeFromCart(row.cartItemId);
            // prune stored row ids
            const keep = getRowIdsFor(uid as any).filter((x) => `${x}` !== `${row.cartItemId}`);
            setRowIdsFor(uid as any, keep);
          } catch {/* ignore single row failure */}
        }
        // update local UI & mirror
        setItems((curr) => {
          const next = curr.filter((i) => i.id !== productId);
          setTotal(next.reduce((s, x) => s + x.price * x.quantity, 0));
          if (uid != null) writeJSON(mirrorKey(uid), next);
          return next;
        });
      } finally {
        setLoading(false);
      }
    } else {
      setItems((curr) => {
        const next = curr.filter((i) => i.id !== productId);
        setTotal(next.reduce((s, x) => s + x.price * x.quantity, 0));
        writeJSON(GUEST_KEY, next);
        return next;
      });
    }
  };

  const updateQuantity = async (productId: string | number, quantity: number) => {
    if (quantity < 1) return removeItem(productId);

    setItems((curr) => {
      const next = curr.map((i) => (i.id === productId ? { ...i, quantity } : i));
      setTotal(next.reduce((s, x) => s + x.price * x.quantity, 0));
      const uid = getUserId();
      if (isAuthenticated && uid != null) writeJSON(mirrorKey(uid), next);
      if (!isAuthenticated) writeJSON(GUEST_KEY, next);
      return next;
    });

    // (Optional) If your backend supports an "update quantity" endpoint, call it here.
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      const uid = getUserId();
      try {
        setLoading(true);
        // naive: try removing all known row IDs server-side
        const ids = getRowIdsFor(uid as any);
        for (const id of ids) {
          try { await cartApi.removeFromCart(id); } catch {}
        }
        setRowIdsFor(uid as any, []);
      } finally {
        setLoading(false);
      }
      setItems([]);
      setTotal(0);
      if (uid != null) writeJSON(mirrorKey(uid), []);
    } else {
      setItems([]);
      setTotal(0);
      writeJSON(GUEST_KEY, []);
    }
  };

  const getCartTotal = () =>
    items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const getItemCount = () =>
    items.reduce((count, it) => count + it.quantity, 0);

  useEffect(() => {
    setTotal(getCartTotal());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        cart: items,
        items,
        total,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};

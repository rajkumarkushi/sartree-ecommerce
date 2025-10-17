// src/components/cart.tsx
import React, { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, removeItem, updateQuantity, getItemCount, syncCart, loading } = useCart();
  const { user } = useAuth() as any;

  useEffect(() => {
    if (user) syncCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const empty = getItemCount() === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Your Cart</h1>

      {loading && (
        <div className="mb-4 rounded bg-yellow-50 p-3 text-yellow-800">
          Syncing your cart…
        </div>
      )}

      {empty ? (
        <div className="rounded border p-6 text-center">
          <p className="mb-4 text-gray-600">Your cart is empty.</p>
          <Link to="/products" className="inline-block rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {items.map((it) => (
              <div key={`${it.cartItemId ?? it.id}`} className="flex items-center gap-4 rounded border p-3">
                <img src={it.image || "/images/placeholder.png"} className="h-16 w-16 rounded object-cover" />
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-500">₹{(it.price || 0).toFixed(2)}</div>
                  <div className="mt-2 inline-flex items-center gap-2 rounded border">
                    <button className="p-2 hover:bg-gray-100" onClick={() => updateQuantity(it.id, Math.max(1, it.quantity - 1))}>
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[32px] text-center">{it.quantity}</span>
                    <button className="p-2 hover:bg-gray-100" onClick={() => updateQuantity(it.id, it.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹{(it.price * it.quantity).toFixed(2)}</div>
                  <button className="mt-2 inline-flex items-center gap-1 rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                          onClick={() => removeItem(it.id)}>
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded border p-4">
            <div className="mb-2 flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold">₹{total.toFixed(2)}</span>
            </div>
            <p className="mb-3 text-sm text-gray-500">Taxes & shipping at checkout.</p>
            <button
  onClick={() => {
    if (user) navigate("/checkout");
    else navigate("/signin?redirect=/checkout");
  }}
  className="w-full rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800"
>
  {user ? "Checkout" : "Checkout as Guest"}
</button>

          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;

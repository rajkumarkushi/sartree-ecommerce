// cart.ts API module (NOT the Cart component)
import { api } from "@/services/http";

export const cartAPI = {
  addToCart: (data: { product_id: number | string; quantity: number; user_id?: number | string }) => {
    // Always include user_id when we have it (logged-in flow)
    // Guests won't have it, and we won't call the API for them anyway (we use local storage).
    const payload: any = {
      product_id: Number(data.product_id),
      quantity: Number(data.quantity),
    };
    if (data.user_id != null && `${data.user_id}` !== "") {
      payload.user_id = Number(data.user_id);
    }
    return api.post("/cart/add", payload);
  },

  // keep the rest as you have it…
  getCartByUserId: (user_id: number | string) => api.post("/cart-items", { user_id }),
  getCartByRowIds: (idsCsv: string) => api.post("/cart-items", { cart_item_ids: idsCsv }),
  removeFromCart: (cart_item_id: number | string) => api.post("/cart-delete", { cart_item_id }),
};

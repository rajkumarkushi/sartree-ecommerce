// src/api/modules/products.ts
import client from "@/api/client";

/**
 * Helper to build path respecting whether baseURL already contains /v1
 * - If client.defaults.baseURL ends with /v1 -> returns "/product" or "/product/{id}"
 * - Otherwise returns "/v1/product" or "/v1/product/{id}"
 */
function apiPath(pathNoV1: string) {
  const base = (client?.defaults && client.defaults.baseURL) || "";
  const normalized = base.replace(/\/+$/, "").toLowerCase();
  if (normalized.endsWith("/v1")) {
    return `/${pathNoV1.replace(/^\/+/, "")}`; // e.g. /product or /product/5
  }
  return `/v1/${pathNoV1.replace(/^\/+/, "")}`; // e.g. /v1/product or /v1/product/5
}

export const productAPI = {
  list: async (params?: any) => {
    return client.get(apiPath("product"), { params }).then((r) => r.data);
  },

  getProduct: async (id: string | number) => {
    if (id == null) throw new Error("Product id is required");
    return client.get(apiPath(`product/${id}`)).then((r) => r.data);
  },
};


  // optional helpers (if you need)
  // create: (payload: any) => client.post(apiPath('product'), payload),
  // update: (id: string|number, payload: any) => client.put(apiPath(`product/${id}`), payload),
  // remove: (id: string|number) => client.delete(apiPath(`product/${id}`)),


export default productAPI;

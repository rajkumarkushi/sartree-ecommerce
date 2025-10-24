// src/api/modules/auth.ts  (or src/api/auth.ts)
import client from "@/api/client";

function pathWithV1Suffix(pathNoV1: string) {
  // client.defaults.baseURL may be undefined during tests; handle safely
  const base = (client.defaults && client.defaults.baseURL) || "";
  // Normalize trailing slash and lowercase for simple check
  const normalized = base.replace(/\/+$/, "").toLowerCase();
  // If base already contains /v1 at the end, return path without /v1
  if (normalized.endsWith("/v1")) {
    return `/${pathNoV1.replace(/^\/+/, "")}`; // e.g. /user/register
  }
  // otherwise include /v1 prefix
  return `/v1/${pathNoV1.replace(/^\/+/, "")}`; // e.g. /v1/user/register
}

export const authAPI = {
  login: (payload: any) => client.post(pathWithV1Suffix("user/login"), payload),

  register: (payload: any) => {
    // use the helper so path is correct no matter baseURL value
    return client.post(pathWithV1Suffix("user/register"), payload);
  },

  logout: () => client.post(pathWithV1Suffix("user/logout")),
  // ...other auth endpoints
};

export default authAPI;

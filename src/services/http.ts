// src/services/http.ts
import axios from "axios";

const BASE =
  import.meta.env.VITE_API_BASE_URL || "https://api.sartree.com/api/v1";

export const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    // NOTE: don't force Content-Type globally (lets FormData work)
  },
});

// Attach token on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If you're sending plain JSON and Content-Type wasn't set by caller, set it.
    if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Basic response handling (optional: react to 401)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // if (error?.response?.status === 401) {
    //   localStorage.removeItem("auth_token");
    //   // optionally redirect to /signin
    // }
    return Promise.reject(error);
  }
);

if (typeof window !== "undefined") {
  console.log("[API Base URL]", api.defaults.baseURL);
}


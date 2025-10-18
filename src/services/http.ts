// src/services/http.ts
import axios from "axios";

const BASE = import.meta.env.DEV ? "/api" : (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "https://api.sartree.com/api");

const http = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

// Attach token if present in localStorage (initial load)
const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
if (token) {
  http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Response interceptor to attach helpful message
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const enhanced = error as any;
    enhanced.userMessage =
      error?.response?.data?.message ??
      error?.response?.data?.error_description ??
      error?.response?.data ??
      error?.message ??
      "Network error";
    return Promise.reject(enhanced);
  }
);

export function setAuthToken(tokenValue: string | null) {
  if (tokenValue) {
    http.defaults.headers.common["Authorization"] = `Bearer ${tokenValue}`;
    try { localStorage.setItem("auth_token", tokenValue); } catch {}
  } else {
    delete http.defaults.headers.common["Authorization"];
    try { localStorage.removeItem("auth_token"); } catch {}
  }
}

export default http;

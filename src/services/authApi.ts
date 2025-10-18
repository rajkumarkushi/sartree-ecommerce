// src/services/authApi.ts
import http from "./http";

const CLIENT_ID = import.meta.env.VITE_AUTH_CLIENT_ID || "2";
const CLIENT_SECRET = import.meta.env.VITE_AUTH_CLIENT_SECRET || "33xyn7BixPNgYai3dna9tBQKnHLz2piER7gBF5Dd";

/**
 * authApi: login/register/logout helpers.
 * Login uses x-www-form-urlencoded with client_id/client_secret/grant_type=password
 * to match the Postman request you showed.
 */

export type LoginResponse = {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  tokenDetails?: Record<string, any>;
  data?: any;
  user?: any;
  [k: string]: any;
};

export async function login(email: string, password: string): Promise<LoginResponse> {
  const url = "/v1/user/login";
  console.log("[authApi] POST ->", (http.defaults.baseURL || "") + url);
  console.log("[authApi] CLIENT_ID:", CLIENT_ID);
  console.log("[authApi] CLIENT_SECRET:", CLIENT_SECRET ? "***" : "not set");

  const form = new URLSearchParams();
  // Add both username and email to be compatible
  form.append("username", email);
  form.append("email", email);
  form.append("password", password);

  if (CLIENT_ID) form.append("client_id", String(CLIENT_ID));
  if (CLIENT_SECRET) form.append("client_secret", String(CLIENT_SECRET));
  form.append("grant_type", "password");

  try {
    console.log("[authApi] Form data:", form.toString());
    const res = await http.post(url, form.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Typical successful shapes:
    // { access_token, token_type, expires_in, ... } OR { tokenDetails: { access_token: ... }, userDetails: {...} }
    console.log("[authApi] success", res.data);
    return res.data as LoginResponse;
  } catch (err: any) {
    console.error("[authApi.login] error", err?.userMessage ?? err?.response ?? err?.message);
    console.error("[authApi.login] error details:", {
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      data: err?.response?.data,
      message: err?.message
    });
    // Re-throw with useful message for UI
    const payload = err?.response?.data ?? err?.userMessage ?? err?.message ?? "Login failed";
    throw new Error(typeof payload === "string" ? payload : JSON.stringify(payload));
  }
}

export async function register(payload: Record<string, any>) {
  const url = "/v1/user/register";
  try {
    const res = await http.post(url, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err: any) {
    const payload = err?.response?.data ?? err?.userMessage ?? err?.message ?? "Registration failed";
    throw new Error(typeof payload === "string" ? payload : JSON.stringify(payload));
  }
}

export async function logout() {
  // No logout endpoint in the API, just clear local storage
  try {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  } catch (e) {
    // ignore errors
  }
  return true;
}

export default { login, register, logout };

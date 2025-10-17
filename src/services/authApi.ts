// src/services/authApi.ts
import { api } from "@/services/http";

/** Helpers */
const onlyDigits = (v: string) => (v || "").replace(/\D/g, "");
const normalizeMobile = (v: string) => {
  const d = onlyDigits(v);
  return d.length > 10 ? d.slice(-10) : d; // keep last 10 (IN numbers)
};

// Read OAuth creds from .env (do NOT hardcode in code)
const OAUTH_CLIENT_ID =
  import.meta.env.VITE_OAUTH_CLIENT_ID ?? "";        // e.g. "2"
const OAUTH_CLIENT_SECRET =
  import.meta.env.VITE_OAUTH_CLIENT_SECRET ?? "";    // e.g. "33xy...F5Dd"

type RegisterPayload = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string; // raw user input
  password: string;
  password_confirmation: string;
};

export const authApi = {
  /** REGISTER */
  async register(payload: RegisterPayload) {
    const body = {
      first_name: payload.first_name?.trim(),
      last_name: payload.last_name?.trim(),
      username: payload.username?.trim(),
      email: payload.email?.trim(),
      // backend expects "phone" (your Postman shows that)
      phone: normalizeMobile(payload.phone),
      password: payload.password,
      password_confirmation: payload.password_confirmation,
      sys_admin: 0,
    };

    const { data } = await api.post("/user/register", body, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  /** LOGIN (OAuth password grant expected by backend) */
  async login(email: string, password: string) {
    const body = {
      email,
      username: email,
      password,
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
      grant_type: "password",
    };

    const { data } = await api.post("/user/login", body, {
      headers: { "Content-Type": "application/json" },
    });

    // Persist token + basic user if backend returns them
    const token =
      data?.access_token || data?.token || data?.data?.access_token || null;
    if (token) localStorage.setItem("auth_token", token);

    const user =
      data?.userDetails || data?.user || data?.data?.user || null;
    if (user) localStorage.setItem("auth_user", JSON.stringify(user));

    return data;
  },

  /** LOGOUT */
  async logout() {
    try {
      await api.post("/user/logout");
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  },
};

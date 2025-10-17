// src/pages/Auth/SignUp.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "@/services/authApi";

type FormState = {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
};

const initialState: FormState = {
  first_name: "",
  last_name: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  confirm: "",
};

export default function SignUp() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((s) => ({ ...s, [key]: e.target.value }));
    };

  const validate = (): string | null => {
    if (!form.first_name.trim()) return "First name is required";
    if (!form.last_name.trim()) return "Last name is required";
    if (!form.username.trim()) return "Username is required";
    if (!form.email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email";
    const digits = (form.phone || "").replace(/\D/g, "");
    if (digits.length < 10) return "Enter a valid 10-digit mobile number";
    if (!form.password) return "Password is required";
    if (form.password !== form.confirm) return "Passwords do not match";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      setLoading(true);
      await authApi.register({
        first_name: form.first_name,
        last_name: form.last_name,
        username: form.username,
        email: form.email,
        phone: form.phone, // authApi normalizes to 10 digits
        password: form.password,
        password_confirmation: form.confirm,
      });

      toast.success("Registration successful! Please sign in.");
      navigate("/signin");
    } catch (err: any) {
      // Try to show API message if present
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error_description ||
        err?.message ||
        "Registration failed";
      toast.error(apiMsg);
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Sign Up</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="First name"
            value={form.first_name}
            onChange={onChange("first_name")}
          />
          <input
            className="border rounded px-3 py-2"
            placeholder="Last name"
            value={form.last_name}
            onChange={onChange("last_name")}
          />
        </div>

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Username"
          value={form.username}
          onChange={onChange("username")}
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={onChange("email")}
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Mobile number"
          value={form.phone}
          onChange={onChange("phone")}
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={onChange("password")}
        />

        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Confirm password"
          type="password"
          value={form.confirm}
          onChange={onChange("confirm")}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-green-600 text-white py-2 disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

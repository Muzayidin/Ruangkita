"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Cek content-type sebelum parse JSON
      const contentType = res.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        setError("Server mengembalikan respons yang tidak valid");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }

      // Login berhasil
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow p-6 w-full max-w-sm rounded space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">Login Admin</h1>

        {error && (
          <p className="text-sm text-red-600 bg-red-100 p-2 rounded">{error}</p>
        )}

        <div>
          <label className="text-sm block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={loading}
            placeholder="admin@ruangkita.com"
          />
        </div>

        <div>
          <label className="text-sm block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
            disabled={loading}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-slate-900 text-white py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </main>
  );
}

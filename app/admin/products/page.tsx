"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string | null;
  featured: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Yakin hapus produk ini?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin – Produk</h1>
        <Link
          href="/admin/products/new"
          className="bg-slate-900 text-white px-4 py-2 rounded text-sm"
        >
          + Produk Baru
        </Link>
      </header>

      {loading ? (
        <p>Memuat data...</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b bg-slate-100 text-left">
              <th className="p-2">Nama</th>
              <th className="p-2">Harga</th>
              <th className="p-2">Kategori</th>
              <th className="p-2">Featured</th>
              <th className="p-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.name}</td>
                <td className="p-2">Rp {p.price.toLocaleString("id-ID")}</td>
                <td className="p-2">{p.category}</td>
                <td className="p-2">{p.featured ? "Ya" : "-"}</td>
                <td className="p-2 text-right space-x-2">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-xs text-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-xs text-red-600"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td className="p-2 text-center text-gray-500" colSpan={5}>
                  Belum ada produk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </main>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    category: "",
    description: "",
    image: "",
    featured: false,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type, checked } = e.target as any;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
      }),
    });

    if (!res.ok) {
      alert("Gagal menyimpan produk");
      return;
    }

    router.push("/admin/products");
  }

  // tombol auto buat slug dari nama
  function generateSlug() {
    setForm((prev) => ({
      ...prev,
      slug: prev.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
    }));
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Produk Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1">Nama Produk</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 flex justify-between">
            <span>Slug (URL)</span>
            <button
              type="button"
              onClick={generateSlug}
              className="text-xs text-blue-600"
            >
              Generate dari nama
            </button>
          </label>
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <p className="text-xs text-gray-500">
            Contoh: <code>kursi-santai-relax</code>
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Harga</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Kategori</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              placeholder="Kursi / Meja / Sofa"
              required
            />
          </div>
        </div>
        <div>
          <label className="block mb-1">Deskripsi</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows={3}
          />
        </div>
        <div>
          <label className="block mb-1">Gambar (path)</label>
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="/kursi-relax.jpg"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="featured"
            type="checkbox"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />
          <label htmlFor="featured">Tampilkan di Produk Unggulan</label>
        </div>
        <button
          type="submit"
          className="bg-slate-900 text-white px-4 py-2 rounded"
        >
          Simpan
        </button>
      </form>
    </main>
  );
}

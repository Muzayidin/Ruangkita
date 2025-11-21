"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ProductForm = {
  name: string;
  slug: string;
  price: string;
  category: string;
  description: string;
  image: string;
  featured: boolean;
};

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<ProductForm | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Ambil data produk berdasarkan ID
  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/products/${params.id}`);
      const data = await res.json();

      setForm({
        name: data.name ?? "",
        slug: data.slug ?? "",
        price: String(data.price ?? ""),
        category: data.category ?? "",
        description: data.description ?? "",
        image: data.image ?? "",
        featured: !!data.featured,
      });

      setLoading(false);
    }
    load();
  }, [params.id]);

  // 🔹 Update data ke state
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type, checked } = e.target as any;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            [name]: type === "checkbox" ? checked : value,
          }
        : prev
    );
  }

  // 🔹 Generate slug otomatis dari nama
  function generateSlug() {
    if (!form) return;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            slug: prev.name
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)+/g, ""),
          }
        : prev
    );
  }

  // 🔹 Submit update produk
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    const res = await fetch(`/api/products/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
      }),
    });

    if (!res.ok) {
      alert("Gagal mengupdate produk");
      return;
    }

    router.push("/admin/products");
  }

  if (loading || !form)
    return <main className="p-6">Memuat data produk...</main>;

  return (
    <main className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Edit Produk</h1>

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {/* Nama Produk */}
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

        {/* Slug */}
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
            Contoh: <code>kursi-santai-premium</code>
          </p>
        </div>

        {/* Harga & Kategori */}
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

        {/* Deskripsi */}
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

        {/* Gambar */}
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

        {/* Featured */}
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

        {/* Submit */}
        <button
          type="submit"
          className="bg-slate-900 text-white px-4 py-2 rounded"
        >
          Simpan Perubahan
        </button>
      </form>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  price: number;
  stock?: number | null;
  category?: string | null;
  imageUrl?: string | null;
  featured?: number | null;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    id: null as string | null,
    name: "",
    slug: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    featured: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/products", {
      method: "GET",
      credentials: "include", // kirim cookie admin_auth_token
    });
    if (res.ok) {
      const data: Product[] = await res.json();
      setProducts(data);
    } else {
      const text = await res.text();
      alert("Gagal memuat produk: " + text);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      slug: product.slug ?? "",
      category: product.category ?? "",
      description: product.description ?? "",
      price: String(product.price),
      stock:
        product.stock === null || product.stock === undefined
          ? ""
          : String(product.stock),
      imageUrl: product.imageUrl ?? "",
      featured:
        product.featured === null || product.featured === undefined
          ? ""
          : String(product.featured),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      fetchProducts();
    } else {
      const text = await res.text();
      alert("Gagal menghapus produk: " + text);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      // id dan slug biasanya digenerate di server saat create.
      // untuk update, server bisa abaikan kalau mau.
      id: form.id ?? undefined,
      slug: form.slug || undefined, // kalau kosong, biar server generate dari name

      name: form.name,
      price: Number(form.price),

      category: form.category || null,
      description: form.description || null,
      imageUrl: form.imageUrl || null,

      stock: form.stock ? Number(form.stock) : null,
      featured: form.featured ? Number(form.featured) : null,
    };

    let res: Response;

    if (form.id === null) {
      // Tambah
      res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
    } else {
      // Edit
      res = await fetch(`/api/admin/products/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
    }

    if (res.ok) {
      setForm({
        id: null,
        name: "",
        slug: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
        featured: "",
      });
      fetchProducts();
    } else {
      const text = await res.text();
      alert("Gagal menyimpan: " + text);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
      <h1>Manajemen Produk</h1>

      {/* Form tambah / edit */}
      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: 30,
          padding: 20,
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      >
        <h2>{form.id === null ? "Tambah Produk" : "Edit Produk"}</h2>

        <div style={{ marginBottom: 10 }}>
          <label>Nama Produk</label>
          <br />
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Slug (opsional, kalau kosong bisa digenerate di server)</label>
          <br />
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Kategori (opsional)</label>
          <br />
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Deskripsi</label>
          <br />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10, display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Harga (Rp)</label>
            <br />
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Stok (opsional)</label>
            <br />
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>URL Gambar (opsional)</label>
          <br />
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Featured (opsional, misal 0/1)</label>
          <br />
          <input
            type="number"
            value={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.value })}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "8px 16px",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {form.id === null ? "Tambah" : "Simpan Perubahan"}
        </button>
        {form.id !== null && (
          <button
            type="button"
            onClick={() =>
              setForm({
                id: null,
                name: "",
                slug: "",
                category: "",
                description: "",
                price: "",
                stock: "",
                imageUrl: "",
                featured: "",
              })
            }
            style={{
              marginLeft: 10,
              padding: "8px 16px",
              background: "#ccc",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Batal Edit
          </button>
        )}
      </form>

      {/* Tabel produk */}
      <h2>Daftar Produk</h2>
      {loading ? (
        <p>Memuat...</p>
      ) : products.length === 0 ? (
        <p>Belum ada produk.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ddd",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>ID</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Nama</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Harga</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Stok</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Kategori</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Featured</th>
              <th style={{ border: "1px solid #ddd", padding: 8 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{p.id}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  {p.name}
                </td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  Rp {p.price.toLocaleString("id-ID")}
                </td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  {p.stock ?? 0}
                </td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  {p.category ?? "-"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  {p.featured ?? 0}
                </td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>
                  <button onClick={() => handleEdit(p)}>Edit</button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ marginLeft: 8 }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

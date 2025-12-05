// app/admin/products/productinputform.tsx
"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import { adminTheme as t } from "@/app/admin/adminTheme";

export default function ProductInputForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
    featured: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "imageUrl" && !imageFile) {
      setPreviewUrl(value || null);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // opsional: kosongkan imageUrl manual
      // setForm(prev => ({ ...prev, imageUrl: "" }));
    }
  };

  const handleBack = () => {
    router.push("/admin/products");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("slug", form.slug);
      fd.append("category", form.category);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("stock", form.stock);
      fd.append("imageUrl", form.imageUrl);
      fd.append("featured", form.featured);

      if (imageFile) {
        fd.append("image", imageFile);
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      if (res.ok) {
        const created = await res.json();
        router.push(`/admin/products/${created.id}`);
      } else {
        const text = await res.text();
        alert("Gagal membuat produk: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan produk");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: t.surface,
        borderRadius: t.radiusLg,
        border: `1px solid ${t.borderSoft}`,
        padding: 20,
        boxShadow: t.shadowCard,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Tombol kembali */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          type="button"
          onClick={handleBack}
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            border: `1px solid ${t.borderSoft}`,
            background: "#f9fafb",
            cursor: "pointer",
            fontSize: 13,
            color: t.textSoft,
          }}
        >
          ← Kembali ke Manajemen Produk
        </button>
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 700,
          color: t.text,
        }}
      >
        Tambah Produk Baru
      </h2>

      {/* Nama */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: t.textSoft,
          }}
        >
          Nama Produk
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="isi nama produk kamu"
          required
          style={{
            borderRadius: t.radiusMd,
            border: `1px solid ${t.border}`,
            padding: "9px 13px",
            fontSize: 15,
            color: t.textMuted,
          }}
        />
      </div>

      {/* Slug */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: t.textSoft }}>
          Slug (opsional)
        </label>
        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="otomatis dari nama jika dikosongkan"
          style={{
            borderRadius: t.radiusMd,
            border: `1px solid ${t.border}`,
            padding: "9px 13px",
            fontSize: 15,
            color: t.textMuted,
          }}
        />
      </div>

      {/* Kategori */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: t.textSoft }}>
          Kategori
        </label>
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="misal: Kursi, Meja, Kabinet"
          style={{
            borderRadius: t.radiusMd,
            border: `1px solid ${t.border}`,
            padding: "9px 13px",
            fontSize: 15,
            color: t.textMuted,
          }}
        />
      </div>

      {/* Deskripsi */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: t.textSoft }}>
          Deskripsi
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Tuliskan detail produk, bahan, warna, ukuran, dll."
          style={{
            borderRadius: t.radiusMd,
            border: `1px solid ${t.border}`,
            padding: "9px 13px",
            fontSize: 15,
            color: t.textMuted,
            minHeight: 120,
          }}
        />
      </div>

      {/* Harga & Stok */}
      <div style={{ display: "flex", gap: 12 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <label style={{ fontSize: 13, fontWeight: 500, color: t.textSoft }}>
            Harga (Rp)
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            style={{
              borderRadius: t.radiusMd,
              border: `1px solid ${t.border}`,
              padding: "9px 13px",
              fontSize: 15,
              color: t.textMuted,
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <label style={{ fontSize: 13, fontWeight: 500, color: t.textSoft }}>
            Stok
          </label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            style={{
              borderRadius: t.radiusMd,
              border: `1px solid ${t.border}`,
              padding: "9px 13px",
              fontSize: 15,
              color: t.textMuted,
            }}
          />
        </div>
      </div>

      {/* Upload gambar */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: t.textSoft }}>
          Upload Gambar
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageFileChange}
          style={{
            fontSize: 13,
            color: t.textMuted,
            borderRadius: t.radiusMd,
            border: `1px solid ${t.border}`,
            padding: "9px 13px",
          }}
        />
      </div>

      {/* URL gambar manual
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: t.textSoft }}>
          URL Gambar (opsional)
        </label>
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          placeholder="Jika menggunakan URL eksternal"
          style={{
            borderRadius: t.radiusMd,
            border: `1px solid ${t.border}`,
            padding: "9px 13px",
            fontSize: 15,
            color: t.textMuted,
          }}
        />
      </div> */}

      {/* Preview */}
      {previewUrl && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: t.textSoft }}>
            Preview Gambar
          </label>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                borderRadius: t.radiusMd,
                border: `1px solid ${t.borderSoft}`,
                overflow: "hidden",
                background: t.bgSoft,
                position: "relative",
                width: "100%",
                maxWidth: 320,
                aspectRatio: "1 / 1",
              }}
            >
              <img
                src={previewUrl}
                alt="Preview produk"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Featured
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 500, color: t.textSoft }}>
          Featured (opsional, misal 0 atau 1)
        </label>
        <input
          type="number"
          name="featured"
          value={form.featured}
          onChange={handleChange}
          style={{
            borderRadius: t.radiusMd,
            border: `1px solid ${t.border}`,
            padding: "9px 13px",
            fontSize: 15,
            color: t.textMuted,
            maxWidth: 120,
          }}
        />
      </div> */}

      {/* Tombol aksi */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginTop: 8,
          justifyContent: "flex-end",
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          disabled={saving}
          style={{
            padding: "8px 16px",
            background: "#f9fafb",
            color: t.textSoft,
            border: `1px solid ${t.borderSoft}`,
            borderRadius: 999,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "8px 18px",
            background: t.primary,
            color: "white",
            border: "none",
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {saving ? "Menyimpan..." : "Tambah Produk"}
        </button>
      </div>
    </form>
  );
}

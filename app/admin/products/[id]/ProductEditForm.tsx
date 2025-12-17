// app/admin/products/[id]/ProductEditForm.tsx
"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import { adminTheme as t } from "@/app/admin/adminTheme";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string | null;
  description: string | null;
  imageUrl: string | null;
  stock: number | null;
  featured: number | null;
  soldCount: number | null;
  originalPrice: number | null;
};

export default function ProductEditForm({ product }: { product: Product }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    name: product.name,
    slug: product.slug ?? "",
    category: product.category ?? "",
    description: product.description ?? "",
    price: String(product.price),
    originalPrice:
      product.originalPrice === null || product.originalPrice === undefined
        ? ""
        : String(product.originalPrice),
    stock:
      product.stock === null || product.stock === undefined
        ? ""
        : String(product.stock),
    imageUrl: product.imageUrl ?? "",
    featured:
      product.featured === null || product.featured === undefined
        ? ""
        : String(product.featured),
    soldCount:
      product.soldCount === null || product.soldCount === undefined
        ? ""
        : String(product.soldCount),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(product.imageUrl);

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
      fd.append("originalPrice", form.originalPrice);
      fd.append("stock", form.stock);
      fd.append("imageUrl", form.imageUrl);
      fd.append("featured", form.featured);
      fd.append("soldCount", form.soldCount);

      if (imageFile) {
        fd.append("image", imageFile);
      }

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        body: fd,
        credentials: "include",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const text = await res.text();
        alert("Gagal menyimpan: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan produk");
    } finally {
      setSaving(false);
    }
  };

  const handleSetFeatured = async () => {
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("featured", "1");
      fd.append("name", form.name);
      fd.append("slug", form.slug);
      fd.append("category", form.category);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("stock", form.stock);
      fd.append("imageUrl", form.imageUrl);

      if (imageFile) {
        fd.append("image", imageFile);
      }

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        body: fd,
        credentials: "include",
      });

      if (res.ok) {
        router.refresh();
      } else {
        const text = await res.text();
        alert("Gagal menjadikan produk unggulan: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat update unggulan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Yakin ingin menghapus produk "${product.name}"? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok || res.status === 204) {
        router.push("/admin/products");
        router.refresh();
        return;
      }

      const text = await res.text();
      alert("Gagal menghapus produk: " + text);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus produk");
    } finally {
      setDeleting(false);
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
        Edit Produk
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
          placeholder="nama produk kamu"
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

      {/* Harga, Stok, & Terjual */}
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
            Harga Coret (Opsional)
          </label>
          <input
            type="number"
            name="originalPrice"
            value={form.originalPrice}
            onChange={handleChange}
            placeholder="Misal: 100000"
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
            Harga Jual (Rp)
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
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <label style={{ fontSize: 13, fontWeight: 500, color: t.textSoft }}>
            Terjual
          </label>
          <input
            type="number"
            name="soldCount"
            value={form.soldCount}
            onChange={handleChange}
            placeholder="0"
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
          Upload Gambar Baru
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
          URL Gambar
        </label>
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
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
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={handleBack}
          disabled={saving || deleting}
          style={{
            padding: "8px 14px",
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
          disabled={saving || deleting}
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
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>

        <button
          type="button"
          disabled={saving || deleting || product.featured === 1}
          onClick={handleSetFeatured}
          style={{
            padding: "8px 14px",
            background: product.featured === 1 ? "#e5e7eb" : t.warning,
            color: product.featured === 1 ? t.textSoft : "#fff7ed",
            border: "none",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 500,
            cursor: product.featured === 1 ? "default" : "pointer",
          }}
        >
          {product.featured === 1 ? "Sudah Unggulan" : "Jadikan Unggulan"}
        </button>

        <button
          type="button"
          disabled={saving || deleting}
          onClick={handleDelete}
          style={{
            padding: "8px 16px",
            background: t.danger,
            color: "white",
            border: "none",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            marginLeft: "auto",
          }}
        >
          {deleting ? "Menghapus..." : "Hapus Produk"}
        </button>
      </div>
    </form>
  );
}

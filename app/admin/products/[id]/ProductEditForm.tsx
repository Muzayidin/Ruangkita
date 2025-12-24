"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Loader2, Save, Trash2, Star, Upload, Image as ImageIcon } from "lucide-react";

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

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        body: fd,
        credentials: "include",
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Save error:", text);
        toast.error("Gagal menyimpan: " + text);
        return;
      }

      toast.success("Produk berhasil disimpan!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menyimpan produk");
    } finally {
      setSaving(false);
    }
  };

  const handleSetFeatured = async () => {
    setSaving(true);

    try {
      const fd = new FormData();
      const isCurrentlyFeatured = product.featured === 1;
      fd.append("featured", isCurrentlyFeatured ? "0" : "1"); // Toggle featured status
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

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        body: fd,
        credentials: "include",
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Featured error:", text);
        toast.error("Gagal menjadikan produk unggulan: " + text);
        return;
      }

      toast.success(isCurrentlyFeatured ? "Produk dihapus dari unggulan" : "Produk dijadikan unggulan");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat update unggulan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Yakin ingin menghapus produk "${product.name}" ? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      return;
    }

    setDeleting(true);

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const text = await response.text();
        toast.error("Gagal menghapus produk: " + text);
        return;
      }

      toast.success("Produk berhasil dihapus!");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menghapus produk");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Edit Produk
          </h2>
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Media & Price */}
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Media Produk
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-orange-500 transition-colors bg-slate-50 dark:bg-slate-900/50">
                {previewUrl ? (
                  <div className="relative w-full aspect-square max-w-[300px] mb-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                    <img
                      src={previewUrl}
                      alt="Preview produk"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square max-w-[200px] mb-4 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                  </div>
                )}

                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {previewUrl ? "Ganti Foto" : "Upload Foto"}
                </label>
                <p className="text-xs text-slate-500 mt-2">Format: JPG, PNG, WEBP (Max 5MB)</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 pt-4 border-t border-slate-200 dark:border-slate-800">
                Harga & Stok
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Harga Jual (Rp) *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Harga Coret</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={form.originalPrice}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 dark:text-slate-100"
                    placeholder="Opsional"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Stok</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Terjual</label>
                  <input
                    type="number"
                    name="soldCount"
                    value={form.soldCount}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                Detail Produk
              </label>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Produk *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Slug</label>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kategori</label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-y text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="px-4 py-2 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Hapus
            </button>

            <button
              type="button"
              onClick={handleSetFeatured}
              disabled={product.featured === 1 || saving}
              className={`px - 4 py - 2 rounded - lg font - medium text - sm border flex items - center gap - 2 transition - colors ${product.featured === 1
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-default'
                : 'border-yellow-200 dark:border-yellow-900/50 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                } `}
            >
              <Star className={`w - 4 h - 4 ${product.featured === 1 ? 'fill-slate-400' : ''} `} />
              {product.featured === 1 ? 'Produk Unggulan' : 'Jadikan Unggulan'}
            </button>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={handleBack}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-sm shadow-lg shadow-orange-900/20 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

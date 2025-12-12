"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types/products"; // Impor tipe Product

export default function ProductsPage() {
  // Gunakan tipe Product untuk state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  async function loadProducts() {
    setLoading(true);
    // Mengambil data dari API Route (yang kini membaca dari database)
    const res = await fetch("/api/products", { cache: "no-store" });

    if (!res.ok) {
      console.error("Gagal mengambil produk dari API:", res.statusText);
      setLoading(false);
      return;
    }

    const data: Product[] = await res.json();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // Ambil unique categories
  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter produk
  const filteredProducts =
    selectedCategory && selectedCategory !== "Semua"
      ? products.filter((p) => p.category === selectedCategory)
      : products;

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 min-h-screen">
      <div className="flex flex-row items-center justify-between border-b dark:border-slate-700 pb-2 mb-6">
        <h1 className="text-xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Katalog Produk
        </h1>

        {/* Mobile Dropdown Custom */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-white border-slate-200 text-slate-800 dark:bg-white/10 dark:text-white dark:border-white/20 backdrop-blur-md text-xs tracking-wide font-normal py-2 pl-4 pr-3 rounded-full border focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm dark:shadow-none"
          >
            {selectedCategory || "Semua"}
            <svg
              className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat === "Semua" ? null : cat);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${(selectedCategory === cat) || (cat === "Semua" && selectedCategory === null)
                    ? "bg-orange-600 text-white"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Category Filter (Chips) */}
      {!loading && products.length > 0 && (
        <div className="hidden md:flex w-full flex-wrap gap-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === "Semua" ? null : cat)}
              className={`px-1 py-1 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 relative ${(selectedCategory === cat) || (cat === "Semua" && selectedCategory === null)
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-slate-700 hover:text-orange-600 dark:text-slate-400"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">
          <p className="text-lg text-indigo-600">Memuat produk...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {filteredProducts.length === 0 && !loading && products.length > 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-slate-500">Tidak ada produk di kategori ini.</p>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">
            Belum ada produk yang ditemukan di database.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Coba tambahkan produk melalui halaman{" "}
            <a
              href="/admin/add-product"
              className="text-indigo-500 hover:underline"
            >
              Admin
            </a>
            .
          </p>
        </div>
      )}
    </main>
  );
}

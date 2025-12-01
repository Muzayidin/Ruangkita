"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types/products"; // Impor tipe Product

export default function ProductsPage() {
  // Gunakan tipe Product untuk state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Katalog Produk
      </h1>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-lg text-indigo-600">Memuat produk...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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

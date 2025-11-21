"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    async function loadFeatured() {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();

      // ambil produk featured
      const selected = data.filter((p: any) => p.featured === true);
      setFeatured(selected);
    }

    loadFeatured();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-10">
      {/* Hero Section */}
      <section className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-xs bg-slate-100 rounded-full px-3 py-1 mb-3">
            <span className="w-4 h-4 rounded-full bg-green-500 inline-block" />
            <span>Garansi kualitas & pengiriman aman</span>
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
            Furniture Minimalis untuk{" "}
            <span className="text-orange-500">Rumah Impian</span> Anda
          </h1>
          <p className="text-gray-600 text-sm mb-4 max-w-lg">
            Pilihan kursi, meja, sofa, dan lemari dengan desain modern, cocok
            untuk rumah, kantor, maupun coffee shop Anda.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href="/products"
              className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm shadow"
            >
              Lihat Katalog
            </Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              className="border border-slate-300 px-4 py-2 rounded-full text-sm"
            >
              Chat via WhatsApp
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow h-60 flex items-center justify-center">
          <span className="text-gray-400 text-sm">
            (Gambar ruang tamu minimalis)
          </span>
        </div>
      </section>

      {/* Produk Unggulan */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Produk Unggulan</h2>
            <p className="text-xs text-gray-500">
              Produk yang paling banyak diminati pelanggan.
            </p>
          </div>
          <Link href="/products" className="text-xs text-slate-700">
            Lihat semua produk →
          </Link>
        </div>

        {featured.length === 0 ? (
          <p className="text-gray-500 text-sm">Belum ada produk featured.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

import Link from "next/link";
import Image from "next/image";

// 💡 FIX: Import fungsi fetching dari database helper, termasuk getHeroImagePath
import { getFeaturedProducts, getHeroImagePath } from "@/database/db-helper";
// Import tipe data Product dari file tipe yang sudah dibuat
import { Product } from "@/types/products";

import { ProductCard } from "@/components/ProductCard";

// UBAH KOMPONEN MENJADI ASYNC (Server Component)
export default async function Home() {
  // 1. Fetch Hero Image Path dari database
  const heroImagePath: string = getHeroImagePath();

  // 2. Fetch Featured Products dari database
  const featuredProducts: Product[] = getFeaturedProducts();

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
            Furniture Minimalis untuk {""}
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

        {/* BAGIAN HERO IMAGE */}
        <div className="bg-white rounded-2xl shadow h-60 relative overflow-hidden">
          <Image
            src={heroImagePath}
            alt="Gambar ruang tamu minimalis"
            fill={true}
            style={{ objectFit: "cover" }}
            className="rounded-2xl"
          />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getHeroImagePath } from "@/database/db-helper";
import { Product } from "@/types/products";
import { ProductCard } from "@/components/ProductCard";

export default async function Home() {
  const heroImagePath: string = getHeroImagePath();
  const featuredProducts: Product[] = getFeaturedProducts();

  return (
    <main className="min-h-screen bg-[#f2f0e9] dark:bg-[#0f1115]">
      {/* Hero Section */}
      <section className="relative h-[65vh] md:h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900 rounded-b-[2rem] md:rounded-b-[3rem] shadow-2xl mx-0 sm:mx-4 mt-0 sm:mt-2">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImagePath}
            alt="Modern Interior"
            fill={true}
            style={{ objectFit: "cover" }}
            priority={true}
            className="opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-4 md:space-y-8 animate-slide-up">
          <div className="inline-block px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-xs md:text-sm font-medium animate-fade-in tracking-wider uppercase">
            ✨ Koleksi Premium 2025
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight max-w-5xl mx-auto font-serif">
            Wujudkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-amber-100">Estetika</span> <br />
            Tanpa Batas
          </h1>

          <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light px-4">
            Kurasi furniture modern dengan sentuhan arsitektural untuk hunian yang memikat hati.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 md:pt-8">
            <Link
              href="/products"
              className="px-6 py-3 md:px-8 md:py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold text-sm md:text-base transition-all transform hover:scale-105 shadow-xl hover:shadow-orange-600/30"
            >
              Jelajahi Katalog
            </Link>
          </div>
        </div>
      </section>

      {/* Features / Why Choose Us */}
      <section className="py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            {[
              { title: "Desain Premium", desc: "Dikurasi oleh desainer interior profesional.", icon: "🎨" },
              { title: "Kualitas Terbaik", desc: "Material pilihan yang tahan lama dan kokoh.", icon: "💎" },
              { title: "Gratis Pengiriman", desc: "Untuk wilayah Jabodetabek dengan minimal belanja.", icon: "🚚" },
            ].map((feature, i) => (
              <div key={i} className="group p-6 md:p-10 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/50 dark:border-white/10 hover:bg-white/60 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="text-4xl md:text-5xl mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 md:mb-3 font-serif">{feature.title}</h3>
                <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-24 bg-stone-200/30 dark:bg-black/20 rounded-t-[2rem] md:rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row justify-between items-end mb-8 md:mb-16 gap-4">
            <div>
              <span className="text-orange-600 font-bold tracking-widest uppercase text-xs md:text-sm mb-2 block">Katalog Pilihan</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-slate-100 font-serif">Koleksi Terpopuler</h2>
            </div>
            <Link
              href="/products"
              className="group flex items-center gap-2 text-slate-600 dark:text-slate-300 font-semibold hover:text-orange-600 transition-colors bg-white/50 px-4 py-2 md:px-6 md:py-3 rounded-full hover:bg-white shadow-sm text-sm md:text-base whitespace-nowrap"
            >
              <span className="hidden md:inline">Lihat Semua</span>
              <span className="md:hidden">Semua</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.map((product, idx) => (
              <div key={product.id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-fade-in opacity-0 fill-mode-forwards h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-32 bg-slate-900 overflow-hidden relative mx-0 sm:mx-4 mb-0 sm:mb-4 rounded-none sm:rounded-3xl">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[20rem] md:w-[30rem] h-[20rem] md:h-[30rem] bg-orange-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[20rem] md:w-[30rem] h-[20rem] md:h-[30rem] bg-indigo-600/20 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-6xl font-black text-white mb-4 md:mb-8 font-serif leading-tight">
            Siap Mengubah Suasana Rumah Anda?
          </h2>
          <p className="text-base md:text-xl text-slate-300 mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto font-light">
            Konsultasikan kebutuhan interior Anda bersama kami secara gratis via WhatsApp.
          </p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            className="inline-flex items-center gap-2 md:gap-3 bg-green-600 hover:bg-green-500 text-white px-6 py-3 md:px-10 md:py-5 rounded-full font-bold text-base md:text-xl transition-all shadow-xl hover:shadow-green-500/30 hover:-translate-y-1"
          >
            <span>Chat Kami Sekarang</span>
          </a>
        </div>
      </section>
    </main>
  );
}

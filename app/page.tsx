import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts } from "@/database/db-helper";
import { Product } from "@/types/products";
import { ProductCard } from "@/components/ProductCard";

export default async function Home() {
  const heroImagePath: string = "/ruang tamu minimalis.jpg";
  const featuredProducts: Product[] = getFeaturedProducts();

  return (
    <main className="min-h-screen bg-background">
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
          <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-8 text-center">
            {[
              { title: "Desain Premium", desc: "Dikurasi oleh desainer interior profesional.", icon: "🎨" },
              { title: "Kualitas Terbaik", desc: "Material pilihan yang tahan lama dan kokoh.", icon: "💎" },
              { title: "Gratis Ongkir", desc: "Untuk wilayah Jawa Timur dengan minimal belanja.", icon: "🚚" },
            ].map((feature, i) => (
              <div key={i} className="group p-3 md:p-10 rounded-2xl md:rounded-3xl bg-card/60 backdrop-blur-xl border border-white/50 dark:border-white/10 hover:bg-card/70 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 shadow-md shadow-muted/50 dark:shadow-none flex flex-col items-center text-center">
                <div className="text-2xl md:text-5xl mb-3 md:mb-6 group-hover:scale-105 transition-transform duration-300 drop-shadow-sm p-2 md:p-4 bg-white/50 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xs md:text-xl font-bold text-foreground mb-1 md:mb-3 font-serif tracking-tight">{feature.title}</h3>
                <p className="text-[10px] md:text-base text-muted leading-tight md:leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-24 bg-muted/10 rounded-t-[2rem] md:rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-row justify-between items-end mb-8 md:mb-16 gap-4">
            <div>
              <span className="text-orange-600 font-bold tracking-widest uppercase text-xs md:text-sm mb-2 block">Katalog Pilihan</span>
              <h2 className="text-3xl md:text-5xl font-black text-foreground font-serif">Koleksi Terpopuler</h2>
            </div>
            <Link
              href="/products"
              className="group flex items-center gap-2 text-muted font-semibold hover:text-accent transition-colors bg-card/50 px-4 py-2 md:px-6 md:py-3 rounded-full hover:bg-card shadow-sm text-sm md:text-base whitespace-nowrap"
            >
              <span className="hidden md:inline">Lihat Semua</span>
              <span className="md:hidden">Semua</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-8">
            {featuredProducts.map((product, idx) => (
              <div key={product.id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-fade-in opacity-0 fill-mode-forwards h-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-16 mx-4 mb-8">
        <div className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[20rem] md:w-[40rem] h-[20rem] md:h-[40rem] bg-orange-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[20rem] md:w-[40rem] h-[20rem] md:h-[40rem] bg-indigo-600/20 rounded-full blur-[100px]" />

          <div className="relative z-10 px-6 py-12 md:p-20">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 font-serif leading-tight">
                Siap Wujudkan Visi Anda?
              </h2>
              <p className="text-base md:text-xl text-slate-300 leading-relaxed font-light">
                Apapun kebutuhan ruang Anda, kami punya solusinya.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-12 max-w-5xl mx-auto">
              {/* Personal / Home */}
              {/* Personal / Home */}
              <div className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-10 transition-all duration-300 text-left flex flex-col h-full">
                <div className="mb-3 md:mb-6 p-2 md:p-4 bg-orange-500/20 w-fit rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl md:text-3xl">🏠</span>
                </div>
                <h3 className="text-sm md:text-2xl font-bold text-white mb-2 md:mb-3">Personal Home</h3>
                <p className="text-[10px] md:text-base text-slate-400 mb-4 md:mb-8 min-h-[2.5rem] md:min-h-[3rem] leading-tight md:leading-relaxed">
                  Konsultasi desain interior gratis untuk hunian impian Anda.
                </p>
                <div className="mt-auto">
                  <a href="https://wa.me/6281234567890" target="_blank" className="inline-flex items-center gap-1 md:gap-2 text-xs md:text-base text-orange-400 font-bold group-hover:translate-x-2 transition-transform">
                    Chat WA <span>→</span>
                  </a>
                </div>
              </div>

              {/* Business / B2B */}
              <div className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-10 transition-all duration-300 text-left flex flex-col h-full">
                <div className="mb-3 md:mb-6 p-2 md:p-4 bg-indigo-500/20 w-fit rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-xl md:text-3xl">🏢</span>
                </div>
                <h3 className="text-sm md:text-2xl font-bold text-white mb-2 md:mb-3">Business Partner</h3>
                <p className="text-[10px] md:text-base text-slate-400 mb-4 md:mb-8 min-h-[2.5rem] md:min-h-[3rem] leading-tight md:leading-relaxed">
                  Solusi furnishing untuk kantor, cafe, atau hotel.
                </p>
                <div className="mt-auto">
                  <a href="mailto:partnership@ruangkita.com" className="inline-flex items-center gap-1 md:gap-2 text-xs md:text-base text-indigo-400 font-bold group-hover:translate-x-2 transition-transform">
                    Email Kami <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

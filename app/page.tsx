import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getAllProducts } from "@/database/db-helper"; // Added getAllProducts
import { Product } from "@/types/products";
import { ProductCard } from "@/components/products/ProductCard";
import { Spotlight } from "@/components/ui/spotlight";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Palette, ShieldCheck, Truck } from "lucide-react";

export const dynamic = "force-dynamic"; // Ensure fresh data

export default async function Home() {
  const heroImagePath: string = "/ruang tamu minimalis.jpg";
  let featuredProducts: Product[] = await getFeaturedProducts();

  // Fallback: If no featured products, get 8 recent products
  if (featuredProducts.length === 0) {
    featuredProducts = await getAllProducts(8);
  } else if (featuredProducts.length < 4) {
    // Append some recent ones if we have too few featured
    const recent = await getAllProducts(4);
    featuredProducts = [...featuredProducts, ...recent].slice(0, 8);
    // Remove duplicates by ID
    featuredProducts = Array.from(new Map(featuredProducts.map(item => [item.id, item])).values());
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[65vh] md:h-[85vh] flex items-center justify-center overflow-hidden bg-slate-950 rounded-b-[2rem] md:rounded-b-[3rem] shadow-2xl mx-0 sm:mx-4 mt-0 sm:mt-2">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />

        {/* Background Image with Overlay - Kept subtle for texture */}
        <div className="absolute inset-0 z-0 opacity-20 disabled:opacity-0 mixed-blend-overlay">
          <Image
            src={heroImagePath}
            alt="Modern Interior"
            fill={true}
            style={{ objectFit: "cover" }}
            priority={true}
          />
        </div>

        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-4 md:space-y-8 animate-slide-up">
          <div className="inline-block px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-xs md:text-sm font-medium animate-fade-in tracking-wider uppercase text-slate-300">
            ✨ Koleksi Premium 2025
          </div>

          <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight max-w-5xl mx-auto bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
            Wujudkan <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-200 to-amber-100">Estetika</span> <br />
            Tanpa Batas
          </h1>

          <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light px-4">
            Kurasi furniture modern dengan sentuhan arsitektural untuk hunian yang memikat hati.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 md:pt-8">
            <Link
              href="/products"
              className="px-6 py-3 md:px-8 md:py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold text-sm md:text-base transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(234,88,12,0.5)] border border-orange-500/20"
            >
              Jelajahi Katalog
            </Link>
          </div>
        </div>
      </section>

      {/* Features / Why Choose Us */}
      <section className="py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BentoGrid>
            {/* Custom Skeleton Component */}
            {(() => {
              const Skeleton = ({ className, children }: { className?: string, children?: React.ReactNode }) => (
                <div className={`flex flex-1 w-full h-full min-h-[8rem] rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-800 border border-transparent dark:border-white/[0.1] relative overflow-hidden group/skeleton ${className}`}>
                  <div className="absolute inset-0 bg-grid-black/[0.1] dark:bg-grid-white/[0.1] bg-[length:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]" />
                  {children}
                </div>
              );

              return [
                {
                  title: "Desain Premium",
                  desc: "Dikurasi oleh desainer interior profesional untuk estetika maksimal.",
                  header: (
                    <Skeleton className="from-orange-100 to-amber-50 dark:from-slate-800 dark:to-slate-900">
                      <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-tl from-orange-400/20 to-transparent rounded-tl-full" />
                      <div className="absolute top-4 left-4 p-2 bg-white/50 dark:bg-black/20 rounded-lg backdrop-blur-sm">
                        <Palette className="w-8 h-8 text-orange-500" />
                      </div>
                    </Skeleton>
                  ),
                  icon: <Palette className="h-4 w-4 text-neutral-500" />,
                },
                {
                  title: "Kualitas Terbaik",
                  desc: "Material pilihan yang tahan lama dan kokoh standar ekspor.",
                  header: (
                    <Skeleton className="from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center animate-pulse">
                          <ShieldCheck className="w-10 h-10 text-indigo-500" />
                        </div>
                      </div>
                    </Skeleton>
                  ),
                  icon: <ShieldCheck className="h-4 w-4 text-neutral-500" />,
                  className: "md:col-span-1",
                },
                {
                  title: "Gratis Ongkir",
                  desc: "Untuk wilayah Jawa Timur dengan minimal belanja tertentu.",
                  header: (
                    <Skeleton className="from-emerald-50 to-green-50 dark:from-slate-800 dark:to-slate-900">
                      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-full h-12 bg-emerald-500/10 rotate-12 transform scale-125" />
                      <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-full h-12 bg-emerald-500/10 -rotate-6 transform" />
                      <div className="absolute bottom-4 right-4">
                        <Truck className="w-12 h-12 text-emerald-500/50" />
                      </div>
                    </Skeleton>
                  ),
                  icon: <Truck className="h-4 w-4 text-neutral-500" />,
                },
              ].map((item, i) => (
                <BentoGridItem
                  key={i}
                  title={item.title}
                  description={item.desc}
                  header={item.header}
                  icon={item.icon}
                  className={item.className}
                />
              ));
            })()}
          </BentoGrid>
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
                  <a href="https://wa.me/6281932708104" target="_blank" className="inline-flex items-center gap-1 md:gap-2 text-xs md:text-base text-orange-400 font-bold group-hover:translate-x-2 transition-transform">
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

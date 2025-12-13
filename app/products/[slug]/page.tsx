import { notFound } from "next/navigation";
import { Product } from "@/types/products";
import AddToCartButton from "@/components/AddToCartButton";
import Image from "next/image";
import Link from "next/link";

interface ProductDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

// **KOMPONEN SERVER ASINKRON**
// Mengambil data produk melalui API Route dinamis (/api/products/[slug])
export default async function ProductDetailPage(props: ProductDetailProps) {
  const params = await props.params;
  const productSlug = params.slug;

  const res = await fetch(`http://localhost:3000/api/products/${productSlug}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error(`Gagal memuat data produk: ${res.statusText}`);
  }

  const product: Product = await res.json();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Immersive Hero Layout */}
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-80px)]">

        {/* Left: Image Showcase (Sticky on Desktop) */}
        <div className="relative h-[50vh] lg:h-auto lg:sticky lg:top-[80px] bg-muted/20 overflow-hidden">
          {product.imageUrl ? (
            <>
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill={true}
                className="object-cover"
                priority
              />
              {/* Gradient Overlay for Text Readability if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted">
              <span className="text-xl font-light">Image Not Available</span>
            </div>
          )}

          {/* Back Button (Floating on Mobile) */}
          <Link
            href="/products"
            className="absolute top-6 left-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-background/20 backdrop-blur-md border border-background/30 text-white hover:bg-background hover:text-foreground transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
        </div>

        {/* Right: Product Details (Scrollable) */}
        <div className="flex flex-col justify-center px-6 py-12 lg:px-20 lg:py-24 max-w-2xl mx-auto w-full">

          {/* Category Tag */}
          <div className="mb-6 animate-fade-in opacity-0 fill-mode-forwards" style={{ animationDelay: '100ms' }}>
            <span className="inline-block px-3 py-1 rounded-full border border-muted/30 text-xs font-semibold tracking-widest uppercase text-muted">
              {product.category || "Collection"}
            </span>
          </div>

          {/* Title and Price */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-none font-serif animate-fade-in opacity-0 fill-mode-forwards" style={{ animationDelay: '200ms' }}>
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-8 animate-fade-in opacity-0 fill-mode-forwards" style={{ animationDelay: '300ms' }}>
            <span className="text-3xl font-light text-accent">
              Rp {product.price.toLocaleString("id-ID")}
            </span>
            {product.featured === 1 && (
              <span className="px-2 py-1 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wide rounded">
                Best Seller
              </span>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-lg prose-stone dark:prose-invert mb-12 animate-fade-in opacity-0 fill-mode-forwards" style={{ animationDelay: '400ms' }}>
            <p className="text-lg leading-relaxed text-muted">
              {product.description}
            </p>
            <p className="text-sm text-muted/80 italic mt-4">
              *Pengiriman tersedia untuk seluruh wilayah Indonesia. Garansi 1 tahun untuk kerusakan struktural.
            </p>
          </div>

          {/* Action Area */}
          <div className="border-t border-muted/20 pt-8 animate-slide-up opacity-0 fill-mode-forwards" style={{ animationDelay: '500ms' }}>
            <div className="flex flex-col gap-4">
              <AddToCartButton product={product} />

              <button className="w-full py-4 rounded-full border border-muted/30 font-semibold hover:bg-muted/10 transition-colors">
                Tanya Produk (WhatsApp)
              </button>
            </div>

            <div className="mt-8 flex gap-8 justify-center lg:justify-start text-muted text-sm">
              <div className="flex items-center gap-2">
                <span>🚚</span> Gratis Ongkir
              </div>
              <div className="flex items-center gap-2">
                <span>🛡️</span> Garansi Resmi
              </div>
              <div className="flex items-center gap-2">
                <span>🔄</span> 30 Hari Retur
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Products Section (Enhancement) */}
      <section className="bg-muted/10 py-20 px-4 border-t border-muted/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Lengkapi Ruangan Anda</h2>
          {/* Placeholder for related products grid */}
          <div className="text-center text-muted text-sm">
            [Related products component would go here]
          </div>
        </div>
      </section>
    </div>
  );
}

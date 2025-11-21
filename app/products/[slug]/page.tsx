import { notFound } from "next/navigation";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

interface ProductDetailProps {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: ProductDetailProps) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const related = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <section className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow h-64 flex items-center justify-center overflow-hidden">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm">(Foto produk)</span>
          )}
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {product.category}
          </p>
          <h1 className="text-2xl font-semibold text-slate-800">
            {product.name}
          </h1>
          <p className="text-orange-600 font-bold text-xl">
            Rp {product.price.toLocaleString("id-ID")}
          </p>
          <p className="text-sm text-gray-600">{product.description}</p>
          <p className="text-xs text-gray-400">
            *Harga belum termasuk ongkos kirim dan aksesoris tambahan.
          </p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Produk Terkait</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export default function ProductsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <header className="flex items-end justify-between mb-2">
        <div>
          <h1 className="text-2xl font-semibold">Katalog Produk</h1>
          <p className="text-xs text-gray-500">
            Pilih furniture sesuai kebutuhan ruang Anda.
          </p>
        </div>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}

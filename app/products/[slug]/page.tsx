import { notFound } from "next/navigation";
import { Product } from "@/types/products"; // Hanya import tipe data
import AddToCartButton from "@/components/AddToCartButton";

interface ProductDetailProps {
  params: {
    slug: string;
  };
}

// **KOMPONEN SERVER ASINKRON**
// Mengambil data produk melalui API Route dinamis (/api/products/[slug])
export default async function ProductDetailPage({
  params,
}: ProductDetailProps) {
  const productSlug = params.slug;

  // Lakukan fetch data ke API Route dinamis yang baru: /api/products/[slug]
  // API ini kini akan memanggil database untuk mengambil produk tunggal
  const res = await fetch(`http://localhost:3000/api/products/${productSlug}`, {
    cache: "no-store", // Pastikan selalu mengambil data terbaru
  });

  // Jika API mengembalikan 404 (Produk tidak ditemukan di database)
  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    // Menangani kegagalan API lainnya
    throw new Error(`Gagal memuat data produk: ${res.statusText}`);
  }

  // Produk tunggal (bukan array)
  const product: Product = await res.json();

  // Menggunakan data produk yang lengkap
  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8">
        <div className="mb-8">
          <a
            href="/products"
            className="inline-flex items-center text-sm font-medium text-indigo-500 hover:text-indigo-700 transition duration-150"
          >
            &larr; Kembali ke Katalog
          </a>
        </div>

        <h1 className="text-4xl font-extrabold mb-6 text-gray-900 leading-tight">
          {product.name}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Bagian Gambar */}
          <div className="relative">
            <img
              src={product.image}
              alt={`Gambar ${product.name}`}
              className="w-full h-auto object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://placehold.co/600x400/CCCCCC/333333?text=Gambar+Tidak+Tersedia";
              }}
            />
            <span
              className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full ${
                product.featured === 1
                  ? "bg-yellow-400 text-yellow-900"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {product.featured === 1 ? "Unggulan" : "Standar"}
            </span>
          </div>

          {/* Bagian Detail */}
          <div>
            <p className="text-2xl font-bold text-indigo-600 mb-4">
              Rp {product.price.toLocaleString("id-ID")}
            </p>

            <div className="mb-4">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                Kategori: {product.category}
              </span>
              <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                ID: {product.id}
              </span>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
              Deskripsi
            </h3>
            <p className="text-gray-700 leading-relaxed border-l-4 border-indigo-300 pl-4 py-1 bg-indigo-50/50 rounded-md">
              {product.description}
            </p>

            {/* MENGGUNAKAN KOMPONEN KLIEN UNTUK INTERAKSI ONCLICK */}
            <AddToCartButton productName={product.name} />
          </div>
        </div>

        {/* Produk Terkait: Placeholder untuk ProductCard */}
        <section className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Produk Terkait
          </h2>
          <p className="text-gray-500">
            Fungsionalitas produk terkait akan ditambahkan di sini.
          </p>
        </section>
      </div>
    </div>
  );
}

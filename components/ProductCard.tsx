"use client";

import Link from "next/link";
import type { Product } from "@/types/products";
import { useCart } from "./CartProvider";
import Image from "next/image"; // 💡 Import komponen Image dari Next.js

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col">
      {/* Tambahkan kelas 'relative' pada container agar Image fill={true} bekerja */}
      <div className="bg-gray-200 h-32 mb-3 flex items-center justify-center text-gray-500 text-sm rounded-lg overflow-hidden relative">
        {product.image ? (
          // 💡 Ganti <img> dengan <Image />
          <Image
            src={product.image}
            alt={product.name}
            // Atribut fill={true} memastikan gambar mengisi seluruh tinggi div induk (h-32)
            fill={true}
            // objectFit: 'cover' adalah padanan dari Tailwind object-cover
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        ) : (
          "(Foto produk)"
        )}
      </div>
      <Link
        href={`/products/${product.slug}`}
        className="font-semibold text-sm mb-1 hover:text-orange-600"
      >
        {product.name}
      </Link>
      <p className="text-orange-600 font-bold text-sm mb-2">
        Rp {product.price.toLocaleString("id-ID")}
      </p>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">
        {product.description}
      </p>
      <div className="mt-auto flex gap-2">
        <button
          onClick={() => addToCart(product)}
          className="flex-1 bg-slate-900 text-white px-3 py-2 rounded text-xs"
        >
          Tambah ke Keranjang
        </button>
        <Link
          href={`/products/${product.slug}`}
          className="text-xs border px-3 py-2 rounded bg-white"
        >
          Detail
        </Link>
      </div>
    </div>
  );
}

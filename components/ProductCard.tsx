"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { useCart } from "./CartProvider";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col">
      <div className="bg-gray-200 h-32 mb-3 flex items-center justify-center text-gray-500 text-sm rounded-lg overflow-hidden">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
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

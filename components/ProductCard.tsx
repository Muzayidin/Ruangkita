"use client";

import Link from "next/link";
import type { Product } from "@/types/products";
import { useCart } from "./CartProvider";
import Image from "next/image"; // 💡 Import komponen Image dari Next.js

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="group relative bg-muted/10 backdrop-blur-sm rounded-2xl md:rounded-3xl overflow-hidden border border-muted/20 hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2 flex flex-col h-full">
      {/* Badge Overlay */}
      <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20">
        <span className="px-2 py-0.5 md:px-3 md:py-1 text-[8px] md:text-[10px] font-bold tracking-widest uppercase bg-black/80 text-white rounded-full backdrop-blur-md">
          {product.category || "New"}
        </span>
      </div>

      {/* Image Container */}
      <div className="relative aspect-square bg-muted/20 overflow-hidden">
        {product.imageUrl ? (
          <>
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill={true}
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-stone-400">
            <span className="text-[10px] md:text-xs">No Image</span>
          </div>
        )}

        {/* Floating Action Button (Quick Add) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          className="absolute bottom-3 right-3 md:bottom-4 md:right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20 bg-background text-foreground p-2 md:p-3 rounded-full shadow-lg hover:bg-accent hover:text-white"
          title="Add to Cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-3 md:p-5 flex flex-col flex-1">
        <div className="mb-2">
          <h3 className="text-sm md:text-lg font-bold text-foreground leading-tight group-hover:text-accent transition-colors">
            <Link href={`/products/${product.slug}`}>
              <span className="absolute inset-0 z-10" />
              {product.name}
            </Link>
          </h3>
          <p className="text-[10px] md:text-xs text-muted mt-1 line-clamp-2">{product.description}</p>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-muted/20 pt-3 md:pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs text-muted font-medium uppercase tracking-wider">Harga</span>
            <span className="text-sm md:text-xl font-bold text-foreground">
              Rp {product.price.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="text-accent group-hover:translate-x-1 transition-transform duration-300 hidden md:block">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

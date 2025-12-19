"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/products";
import { useCart } from "@/components/cart/CartProvider";
import Image from "next/image"; // 💡 Import komponen Image dari Next.js

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="group relative bg-muted/10 backdrop-blur-sm rounded-2xl md:rounded-3xl overflow-hidden border border-muted/20 hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 hover:-translate-y-2 flex flex-col h-full">
      {/* Badge Overlay */}
      <div className="absolute top-1 left-3 md:top-4 md:left-4 z-20">
        <span className="px-1.5 py-0.5 md:px-3 md:py-1 text-[6px] md:text-[10px] font-bold tracking-wider uppercase bg-black/80 text-white rounded-full backdrop-blur-md">
          {product.category || "New"}
        </span>
      </div>

      {/* Preorder Badge */}
      {(!product.stock || Number(product.stock) === 0) && (
        <div className="absolute top-1 right-3 md:top-4 md:right-4 z-20">
          <span className="px-1.5 py-0.5 md:px-3 md:py-1 text-[6px] md:text-[10px] font-bold tracking-wider uppercase bg-blue-600/90 text-white rounded-full backdrop-blur-md shadow-lg border border-white/10">
            PREORDER
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square bg-muted/20 overflow-hidden">
        {product.imageUrl ? (
          <>
            {/* Skeleton Loading */}
            <div className={`absolute inset-0 bg-muted/40 animate-pulse z-10 transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

            <Image
              src={product.imageUrl}
              alt={product.name}
              fill={true}
              className={`object-cover group-hover:scale-110 transition-all duration-700 ease-in-out ${isLoading ? 'scale-105 blur-lg grayscale' : 'scale-100 blur-0 grayscale-0'}`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
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
      <div className="p-2 md:p-5 flex flex-col flex-1">
        <div className="mb-2">
          <h3 className="text-sm md:text-lg font-bold text-foreground leading-tight group-hover:text-accent transition-colors">
            <Link href={`/products/${product.slug}`}>
              <span className="absolute inset-0 z-10" />
              {product.name}
            </Link>
          </h3>
          <p className="text-[9px] md:text-xs text-muted mt-1 line-clamp-2">{product.description}</p>
          {product.soldCount !== undefined && product.soldCount > 0 && (
            <p className="text-[9px] md:text-xs text-slate-500 mt-2 font-medium">
              Terjual {product.soldCount}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-muted/20 pt-2 md:pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] md:text-xs text-muted font-medium uppercase tracking-wider">Harga</span>
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-xl font-bold text-foreground">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="flex flex-col items-start leading-none">
                  <span className="text-[10px] text-muted line-through">
                    Rp {product.originalPrice.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[10px] font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-1 rounded-[2px]">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </div>
              )}
            </div>
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

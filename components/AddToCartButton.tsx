"use client";

import { Product } from "@/types/products";
import { useCart } from "./CartProvider";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <button
      className="w-full py-4 text-lg bg-orange-600 text-white font-bold rounded-full shadow-xl hover:bg-orange-500 hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-[1.02]"
      onClick={handleAddToCart}
    >
      Tambah ke Keranjang
    </button>
  );
}

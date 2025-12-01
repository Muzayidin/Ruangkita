"use client";

import React from "react";

interface AddToCartButtonProps {
  productName: string;
}

export default function AddToCartButton({ productName }: AddToCartButtonProps) {
  const handleAddToCart = () => {
    // Di sini Anda akan menambahkan logika sebenarnya untuk menambahkan produk ke keranjang.
    // Saat ini hanya logging ke konsol dan menampilkan alert.
    console.log(`Produk '${productName}' ditambahkan ke keranjang.`);
    alert(
      `Produk ${productName} berhasil ditambahkan! (Logika nyata akan ditambahkan nanti)`
    );
  };

  return (
    <button
      className="mt-6 w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.01]"
      onClick={handleAddToCart}
    >
      Tambah ke Keranjang
    </button>
  );
}

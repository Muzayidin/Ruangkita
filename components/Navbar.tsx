"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function Navbar() {
  const { items, setOpen } = useCart();
  const count = items.reduce((acc, it) => acc + it.qty, 0);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-slate-700">
          Ruang<span className="text-orange-500">Kita</span>
        </Link>
        <nav className="hidden md:flex gap-4 text-sm text-gray-600">
          <Link href="/">Beranda</Link>
          <Link href="/products">Katalog</Link>
        </nav>
        <button
          onClick={() => setOpen(true)}
          className="relative bg-white border p-2 rounded-full shadow hover:bg-gray-50"
        >
          <span role="img" aria-label="cart">
            🛒
          </span>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

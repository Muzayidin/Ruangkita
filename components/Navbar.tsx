"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { useState } from "react"; // <--- Import useState untuk mengontrol menu

export function Navbar() {
  const { items, setOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // <--- State untuk Hamburger Menu
  const count = items.reduce((acc, it) => acc + it.qty, 0);

  // Fungsi untuk menutup menu setelah tautan diklik
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo/Nama Toko */}
        <Link href="/" className="text-xl font-bold text-slate-700">
          Ruang<span className="text-orange-500">Kita</span>
        </Link>

        {/* Navigasi Utama (Hanya terlihat di layar MD ke atas) */}
        <nav className="hidden md:flex gap-8 text-sm text-gray-600">
          <Link href="/">Beranda</Link>
          <Link href="/products">Katalog</Link>
        </nav>

        {/* Div untuk mengelompokkan Hamburger dan Keranjang (agar tetap di kanan) */}
        <div className="flex items-center gap-4">
          {/* Tombol Hamburger Menu (Hanya terlihat di layar kecil) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </button>

          {/* Tombol Keranjang (Tetap Terlihat di semua ukuran) */}
          <button
            onClick={() => setOpen(true)}
            className="relative bg-white border p-2 rounded-full shadow hover:bg-gray-50"
            aria-label={`Cart with ${count} items`}
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
      </div>

      {/* Navigasi Menu Dropdown (Muncul di layar kecil saat di-klik) */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden bg-gray-50 border-t`}
      >
        <nav className="flex flex-col p-4 space-y-2 text-sm text-gray-700">
          <Link
            href="/"
            className="hover:text-orange-500"
            onClick={handleLinkClick}
          >
            Beranda
          </Link>
          <Link
            href="/products"
            className="hover:text-orange-500"
            onClick={handleLinkClick}
          >
            Katalog
          </Link>
        </nav>
      </div>
    </header>
  );
}

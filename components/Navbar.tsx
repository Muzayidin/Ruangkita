"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { useState, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const { items, setOpen } = useCart();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const count = items.reduce((acc, it) => acc + it.qty, 0);

  // Effect untuk mendeteksi scroll agar navbar berubah style
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "glass-effect shadow-sm" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className={`text-2xl font-bold tracking-tighter transition-colors ${scrolled ? "text-slate-800" : "text-slate-800 dark:text-white"}`}>
              Ruang<span className="text-orange-600">Kita</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 items-center">
            {["Beranda", "Katalog", "Tentang Kami", "Blog"].map((item, idx) => {
              let href = "/";
              if (item === "Katalog") href = "/products";
              if (item === "Tentang Kami") href = "/about";
              if (item === "Blog") href = "/blog";

              return (
                <Link
                  key={idx}
                  href={href}
                  className={`text-sm font-medium transition-colors ${scrolled
                    ? "text-slate-800 hover:text-orange-600"
                    : "text-slate-800 hover:text-orange-600 dark:text-slate-300 dark:hover:text-orange-400"
                    }`}
                >
                  {item}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${scrolled ? "text-slate-800 hover:bg-slate-200" : "text-slate-700 dark:text-slate-200"}`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                // Sun Icon (for Dark Mode - click to switch to light)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${scrolled ? "text-yellow-500" : "text-yellow-400"}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                // Moon Icon (for Light Mode - click to switch to dark)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${scrolled ? "text-slate-800" : "text-slate-700"}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setOpen(true)}
              className={`relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group ${scrolled ? "text-slate-800 hover:bg-slate-200" : "text-slate-700 dark:text-slate-200"}`}
              aria-label={`Cart with ${count} items`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-6 h-6 group-hover:scale-110 transition-transform ${scrolled ? "text-slate-800" : "text-slate-700 dark:text-slate-200"}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-bounce">
                  {count}
                </span>
              )}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${scrolled ? "text-slate-800 hover:bg-slate-200" : "text-slate-600 dark:text-slate-300"}`}
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-16 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out origin-top ${isMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
          }`}
      >
        <nav className="px-4 pt-2 pb-6 space-y-2">
          {["Beranda", "Katalog", "Tentang Kami", "Blog"].map((item) => {
            let href = "/";
            if (item === "Katalog") href = "/products";
            if (item === "Tentang Kami") href = "/about";
            if (item === "Blog") href = "/blog";

            return (
              <Link
                key={item}
                href={href}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-orange-600 hover:bg-orange-50 dark:text-slate-200 dark:hover:bg-slate-800"
                onClick={handleLinkClick}
              >
                {item}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <h3 className="text-3xl font-black text-white tracking-tighter font-serif">
              Ruang<span className="text-orange-500">Kita</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Menghadirkan kenyamanan dan estetika ke dalam hunian Anda dengan
              kurasi furniture modern dan fungsional.
            </p>
          </div>

          {/* Links Column */}
          <div className="border-b border-white/10 md:border-none pb-4 md:pb-0">
            <button
              onClick={() => toggleSection("akses")}
              className="w-full flex justify-between items-center md:hidden text-white font-semibold mb-2"
            >
              <span>Akses Cepat</span>
              <span className={`transform transition-transform ${openSection === "akses" ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            <h4 className="hidden md:block text-white font-semibold mb-6 tracking-wide uppercase text-xs">Akses Cepat</h4>
            <ul className={`space-y-3 text-sm ${openSection === "akses" ? "block" : "hidden"} md:block`}>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Tentang Kami</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Katalog Terbaru</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Promo Spesial</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Blog Interior</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="border-b border-white/10 md:border-none pb-4 md:pb-0">
            <button
              onClick={() => toggleSection("bantuan")}
              className="w-full flex justify-between items-center md:hidden text-white font-semibold mb-2"
            >
              <span>Bantuan</span>
              <span className={`transform transition-transform ${openSection === "bantuan" ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>
            <h4 className="hidden md:block text-white font-semibold mb-6 tracking-wide uppercase text-xs">Bantuan</h4>
            <ul className={`space-y-3 text-sm ${openSection === "bantuan" ? "block" : "hidden"} md:block`}>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Pusat Bantuan</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Konfirmasi Pembayaran</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="#" className="hover:text-orange-500 transition-colors">Kebijakan Privasi</Link></li>
            </ul>
          </div>

          {/* Contact/Newsletter Column */}
          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wide uppercase text-xs">Tetap Terhubung</h4>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Dapatkan inspirasi desain terbaru langsung di inbox Anda.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email Anda"
                className="bg-slate-800 border-none rounded-lg px-4 py-3 text-sm text-white focus:ring-2 focus:ring-orange-500 w-full transition-all placeholder:text-slate-600"
              />
              <button className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-lg text-sm font-bold transition-all hover:shadow-lg hover:shadow-orange-600/20">
                Kirim
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} RuangKita. Made with passion.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-orange-500 transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-orange-500 transition-colors">Facebook</Link>
            <Link href="#" className="hover:text-orange-500 transition-colors">Twitter</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

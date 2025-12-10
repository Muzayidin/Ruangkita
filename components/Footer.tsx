export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Ruang<span className="text-orange-500">Kita</span>
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Menghadirkan kenyamanan dan estetika ke dalam hunian Anda dengan
              kurasi furniture modern dan fungsional.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Akses Cepat</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Katalog Terbaru</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Promo Spesial</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog Interior</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Bantuan</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Pusat Bantuan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Konfirmasi Pembayaran</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
            </ul>
          </div>

          {/* Contact/Newsletter Column */}
          <div>
            <h4 className="text-white font-semibold mb-4">Tetap Terhubung</h4>
            <p className="text-sm text-slate-400 mb-4">
              Dapatkan inspirasi desain terbaru langsung di inbox Anda.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email Anda"
                className="bg-slate-800 border-none rounded px-3 py-2 text-sm text-white focus:ring-2 focus:ring-orange-500 w-full"
              />
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                Kirim
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} RuangKita. Made with passion.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

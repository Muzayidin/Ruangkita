export function Footer() {
  return (
    <footer className="mt-10 bg-slate-900 text-gray-300 py-6 text-sm">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <p className="font-semibold text-white">FurniCasa</p>
          <p className="text-gray-400 max-w-md">
            Toko furniture online yang menyediakan berbagai kebutuhan interior
            rumah dan bisnis Anda. Kami mengutamakan kualitas, kenyamanan, dan
            desain yang timeless.
          </p>
        </div>
        <div className="text-gray-400">
          <p>© {new Date().getFullYear()} FurniCasa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

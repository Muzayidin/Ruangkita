// components/admin/ProductCard.tsx
import { adminTheme as t } from "@/app/admin/adminTheme";
import Image from "next/image";

type ProductCardProps = {
  name: string;
  price: number;
  imageUrl?: string | null;
  category?: string | null;
  featured?: number | null;
  stock?: number | null;
};

export default function ProductCard({
  name,
  price,
  imageUrl,
  category,
  featured,
  stock,
}: ProductCardProps) {
  // Menggunakan styling yang sama persis dengan Public ProductCard
  // bg-stone-100/50 -> rgba(245, 245, 244, 0.5)
  return (
    <div className="group relative bg-[#f5f5f4]/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-[#e7e5e4]/60 hover:border-orange-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-2 flex flex-col h-full">
      {/* Badge Overlay */}
      {featured === 1 && (
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-black/80 text-white rounded-full backdrop-blur-md shadow-lg">
            Featured
          </span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square bg-[#e7e5e4] overflow-hidden">
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-[#a8a29e]">
            <span className="text-xs font-medium">No Image</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-2">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#78716c] mb-1">
            {category || "Uncategorized"}
          </div>
          <h3 className="text-lg font-bold text-[#1f2937] leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
            {name}
          </h3>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-[#e7e5e4] pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-[#a8a29e] font-medium uppercase tracking-wider">Harga</span>
            <span className="text-xl font-bold text-[#1c1917]">
              Rp {price.toLocaleString("id-ID")}
            </span>
          </div>

          {/* Admin Specific Info: Stock */}
          <div className="flex flex-col items-end">
            <span className="text-xs text-[#a8a29e] font-medium uppercase tracking-wider">Stok</span>
            <span className={`text-sm font-bold ${stock && stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
              {stock ?? 0} unit
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

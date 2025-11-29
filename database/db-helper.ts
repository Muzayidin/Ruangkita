import Database from "better-sqlite3";
import { Product } from "@/types/products";

// Lokasi file database. Proses ini hanya berjalan di sisi server.
const db = new Database("database/products.db", { readonly: true });

// Fungsi untuk mendapatkan semua produk unggulan (Featured Products)
export function getFeaturedProducts(): Product[] {
  // Fungsi ini berjalan dengan aman di Server Component Next.js
  const stmt = db.prepare("SELECT * FROM products WHERE featured = 1");
  return stmt.all() as Product[];
}

// Fungsi untuk mendapatkan produk berdasarkan slug
export function getProductBySlug(slug: string): Product | undefined {
  const stmt = db.prepare("SELECT * FROM products WHERE slug = ?");
  const product = stmt.get(slug) as Product | undefined;
  return product;
}

/**
 * Mengambil jalur gambar hero dari database.
 * Kita ambil gambar dari produk yang paling unggulan atau produk spesifik.
 */
export function getHeroImagePath(): string {
  try {
    // 💡 Mengambil kolom 'image' dari produk spesifik (misalnya, kursi-santai-relax)
    const stmt = db.prepare("SELECT image FROM products WHERE id = ?");
    const result = stmt.get("kursi-santai-relax") as
      | { image: string }
      | undefined;

    // Mengembalikan jalur gambar, atau jalur fallback jika tidak ditemukan
    return result?.image || "/images/placeholder-hero.jpg";
  } catch (error) {
    console.error("Gagal mengambil gambar hero dari DB:", error);
    return "/images/placeholder-hero.jpg"; // Pastikan ada jalur gambar default/fallback
  }
}

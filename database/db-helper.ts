import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3"; // Import tipe secara terpisah
import { Product } from "@/types/products"; // Pastikan jalur ini benar

// Inisialisasi koneksi database.
// Kita akan menambahkan penanganan try/catch di sini untuk memastikan database terhubung.
let db: DatabaseType; // Menggunakan alias tipe yang diimpor
try {
  // Lokasi file database. Hapus { readonly: true } agar bisa menjalankan INSERT.
  db = new Database("database/datas.db");
  db.pragma("journal_mode = WAL"); // Meningkatkan kinerja dan konkurensi
} catch (error) {
  console.error("CRITICAL ERROR: Gagal terhubung ke database datas.db", error);
  // Di lingkungan produksi, Anda mungkin ingin melempar error,
  // tetapi untuk debugging, console.error sudah cukup.
  // Untuk mencegah error saat db digunakan, kita harus melempar error di sini.
  throw new Error("Koneksi database gagal.");
}

// --- HELPER UNTUK OPERASI TULIS (INSERT, UPDATE) ---
// Fungsi ini penting untuk POST API Route
function runQuery(sql: string, params: any[] = []) {
  try {
    const stmt = db.prepare(sql);
    const result = stmt.run(params);
    return result;
  } catch (error) {
    console.error("Database Write Error:", error);
    throw new Error("Gagal menjalankan query tulis database.");
  }
}

// Fungsi untuk menambahkan produk baru (Memperbaiki Error TypeScript)
export function addProduct(productData: Omit<Product, "id">) {
  const { slug, name, price, category, description, image, featured } =
    productData;

  const sql = `
        INSERT INTO products (slug, name, price, category, description, image, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

  // Asumsi: id adalah AUTOINCREMENT di database, jadi kita tidak memasukkannya.
  const result = runQuery(sql, [
    slug,
    name,
    price,
    category,
    description,
    image,
    featured,
  ]);

  if (result.changes === 0) {
    throw new Error("Gagal menambahkan produk ke database.");
  }

  return {
    ...productData,
    id: result.lastInsertRowid.toString(), // Mengembalikan ID produk yang baru ditambahkan
  };
}

// --- FUNGSI READ (SUDAH ADA) ---

// Fungsi untuk mendapatkan semua produk unggulan (Featured Products)
export function getFeaturedProducts(): Product[] {
  try {
    const stmt = db.prepare("SELECT * FROM products WHERE featured = 1");
    return stmt.all() as Product[];
  } catch (error) {
    console.error("Database Read Error (getFeaturedProducts):", error);
    return []; // Mengembalikan array kosong jika ada error
  }
}

// Fungsi untuk mendapatkan semua produk (Digunakan oleh GET API Route: /api/products)
export function getAllProducts(): Product[] {
  try {
    // Ini adalah fungsi yang dibutuhkan oleh API Route Anda
    const stmt = db.prepare("SELECT * FROM products");
    return stmt.all() as Product[];
  } catch (error) {
    console.error("Database Read Error (getAllProducts):", error);
    return []; // Mengembalikan array kosong jika ada error
  }
}

// Fungsi untuk mendapatkan produk berdasarkan slug (Digunakan oleh GET API Route: /api/products/[slug])
export function getProductBySlug(slug: string): Product | undefined {
  try {
    const stmt = db.prepare("SELECT * FROM products WHERE slug = ?");
    const product = stmt.get(slug) as Product | undefined;
    return product;
  } catch (error) {
    console.error(`Database Read Error (getProductBySlug: ${slug}):`, error);
    return undefined;
  }
}

/**
 * Mengambil jalur gambar hero dari database.
 * Diambil dari produk dengan ID spesifik.
 */
export function getHeroImagePath(): string {
  try {
    const stmt = db.prepare("SELECT imageURL FROM products WHERE id = ?");
    // Mengambil gambar dari produk yang sudah kita tentukan sebagai Hero
    const result = stmt.get("kursi-santai-relax") as
      | { imageURL: string }
      | undefined;

    // Mengembalikan jalur gambar, atau jalur fallback
    return result?.imageURL || "/images/placeholder-hero.jpg";
  } catch (error) {
    console.error("Gagal mengambil gambar hero dari DB:", error);
    return "/images/placeholder-hero.jpg";
  }
}

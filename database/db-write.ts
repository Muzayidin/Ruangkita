import Database from "better-sqlite3";
import { Product } from "@/types/products";

// Fungsi untuk membuka koneksi write dan menjalankannya
const runWriteQuery = (sql: string, params: any) => {
  // KONEKSI WRITE: JANGAN gunakan { readonly: true }
  // File ini bertanggung jawab untuk operasi TULIS (INSERT/UPDATE) ke database lokal.
  const db = new Database("database/datas.db");
  try {
    const stmt = db.prepare(sql);
    const result = stmt.run(params);
    return result;
  } catch (error) {
    throw error;
  } finally {
    // PENTING: Selalu tutup koneksi setelah operasi tulis selesai
    db.close();
  }
};

// Fungsi utama untuk INSERT atau UPDATE produk
export function createOrUpdateProduct(product: Product) {
  const isUpdate = !!product.id && product.id.includes("product-"); // Asumsi: jika product.id ada, maka ini adalah update

  // Query INSERT OR REPLACE INTO akan melakukan UPDATE jika ID sudah ada
  const sql = `
        INSERT OR REPLACE INTO products 
            (id, slug, name, price, category, description, image, featured)
        VALUES 
            (@id, @slug, @name, @price, @category, @description, @image, @featured)
    `;

  // Pastikan featured diubah menjadi 0 atau 1
  const params = {
    ...product,
    featured: product.featured ? 1 : 0,
    // Buat ID baru hanya jika ini adalah INSERT
    id: product.id && isUpdate ? product.id : `product-${Date.now()}`,
  };

  const result = runWriteQuery(sql, params);

  // Asumsi: Jika insert/update berhasil, kembalikan objek yang sudah di-commit
  return { success: true, product: params };
}

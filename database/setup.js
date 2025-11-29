const Database = require("better-sqlite3");
const fs = require("fs");

// Tentukan lokasi file database
const dbFile = "database/products.db";
const db = new Database(dbFile);

function setupDatabase() {
  console.log("Menjalankan setup database...");

  // 1. Buat Tabel Produk
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      category TEXT,
      description TEXT,
      image TEXT,
      featured INTEGER
    );
  `);
  console.log("Tabel products berhasil dibuat atau sudah ada.");

  // 2. Data Awal (SEED DATA)
  const seedData = [
    {
      id: "kursi-santai-relax",
      slug: "kursi-santai-relax",
      name: "Kursi Santai Relax",
      price: 2580000,
      category: "Kursi",
      description: "Kursi santai dengan rangka kayu solid dan busa premium.",
      image: "/images/products/kursi-santai-relax.jpg",
      featured: 1,
    },
    {
      id: "lemari-kayu-klasik",
      slug: "lemari-kayu-klasik",
      name: "Lemari Kayu Klasik",
      price: 1320000,
      category: "Lemari",
      description:
        "Lemari dua pintu dengan finishing natural, cocok untuk kamar tidur.",
      image: "/images/products/lemari-kayu-klasik.jpg",
      featured: 1,
    },
    // Tambahkan semua data produk Anda di sini...
    {
      id: "kabinet-skandinavia",
      slug: "kabinet-skandinavia",
      name: "Kabinet Skandinavia",
      price: 1450000,
      category: "Lemari",
      description:
        "Kabinet minimalis gaya Skandinavia untuk ruang tamu atau kantor.",
      image: "/images/products/kabinet-skandinavia.jpg",
      featured: 1,
    },
    {
      id: "kursi-cafe-minimalis",
      slug: "kursi-cafe-minimalis",
      name: "Kursi Cafe Minimalis",
      price: 740000,
      category: "Kursi",
      description:
        "Kursi kayu dengan dudukan nyaman, ideal untuk cafe dan resto.",
      image: "/images/products/kursi-cafe-minimalis.jpg",
      featured: 0,
    },
    {
      id: "meja-kayu-minimalis",
      slug: "meja-kayu-minimalis",
      name: "Meja Kayu Minimalis",
      price: 800000,
      category: "Meja",
      description:
        "Meja serbaguna dengan desain sederhana untuk berbagai kebutuhan.",
      image: "/images/products/meja-kayu-minimalis.jpg",
      featured: 0,
    },
    {
      id: "sofa-mini-hijau",
      slug: "sofa-mini-hijau",
      name: "Sofa Mini Hijau",
      price: 1350000,
      category: "Sofa",
      description:
        "Sofa dua dudukan dengan warna hijau soft untuk ruang keluarga.",
      image: "/images/products/sofa-mini-hijau.jpg",
      featured: 1,
    },
  ];

  // Hapus data lama (opsional, untuk memastikan data selalu fresh)
  db.exec("DELETE FROM products");

  // Siapkan statement INSERT
  const insert = db.prepare(`
    INSERT INTO products 
      (id, slug, name, price, category, description, image, featured)
    VALUES 
      (@id, @slug, @name, @price, @category, @description, @image, @featured)
  `);

  // Loop dan masukkan data
  for (const product of seedData) {
    insert.run(product);
  }
  console.log(`${seedData.length} produk berhasil dimasukkan.`);

  db.close();
  console.log("Setup selesai.");
}

setupDatabase();

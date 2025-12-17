// Definisi tipe data utama untuk produk (menggunakan 'type' sesuai permintaan Anda)
export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string; // URL gambar dari database
  featured: 0 | 1; // Dari database, 1 atau 0
  soldCount?: number;
  createdAt?: Date | string;
  originalPrice?: number;
};

// Tipe yang lebih ringan untuk dropdown admin atau tampilan ringkas
export interface SimpleProduct {
  id: string;
  name: string;
  slug: string;
}

// Data array produk (diekspor sebagai NAMED EXPORT: { products })
// Data ini telah diperbarui agar sesuai dengan struktur 'export type Product'
export const products: Product[] = [
  {
    id: "prod-001",
    slug: "meja-kerja-minimalis",
    name: "Meja Kerja Minimalis",
    price: 850000,
    category: "Meja",
    description:
      "Meja kokoh dengan desain minimalis scandinavian. Ideal untuk ruang kerja modern.",
    imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
    featured: 1,
  },
  {
    id: "prod-002",
    slug: "kursi-ergonomis-premium",
    name: "Kursi Ergonomis Premium",
    price: 1500000,
    category: "Kursi",
    description:
      "Kursi dengan penyangga punggung dan leher yang bisa diatur, sangat nyaman untuk bekerja berjam-jam.",
    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80",
    featured: 0,
  },
  {
    id: "prod-003",
    slug: "lemari-pakaian-3-pintu",
    name: "Lemari Pakaian 3 Pintu",
    price: 2200000,
    category: "Penyimpanan",
    description:
      "Lemari luas dengan cermin di pintu tengah, menyediakan ruang penyimpanan yang maksimal.",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
    featured: 1,
  },
];

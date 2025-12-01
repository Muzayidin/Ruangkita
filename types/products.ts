// Definisi tipe data utama untuk produk (menggunakan 'type' sesuai permintaan Anda)
export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string; // URL gambar dari database
  featured: 0 | 1; // Dari database, 1 atau 0
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
    image: "https://placehold.co/400x300/F0F4F8/3B82F6?text=Meja+Kerja",
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
    image: "https://placehold.co/400x300/F0F4F8/10B981?text=Kursi+Ergonomis",
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
    image: "https://placehold.co/400x300/F0F4F8/EF4444?text=Lemari+Pakaian",
    featured: 1,
  },
];

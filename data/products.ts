export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: "kursi-santai-relax",
    slug: "kursi-santai-relax",
    name: "Kursi Santai Relax",
    price: 2580000,
    category: "Kursi",
    description: "Kursi santai dengan rangka kayu solid dan busa premium.",
    image: "",
    featured: true,
  },
  {
    id: "lemari-kayu-klasik",
    slug: "lemari-kayu-klasik",
    name: "Lemari Kayu Klasik",
    price: 1320000,
    category: "Lemari",
    description:
      "Lemari dua pintu dengan finishing natural, cocok untuk kamar tidur.",
    image: "",
    featured: true,
  },
  {
    id: "kabinet-skandinavia",
    slug: "kabinet-skandinavia",
    name: "Kabinet Skandinavia",
    price: 1450000,
    category: "Lemari",
    description:
      "Kabinet minimalis gaya Skandinavia untuk ruang tamu atau kantor.",
    image: "",
    featured: true,
  },
  {
    id: "kursi-cafe-minimalis",
    slug: "kursi-cafe-minimalis",
    name: "Kursi Cafe Minimalis",
    price: 740000,
    category: "Kursi",
    description:
      "Kursi kayu dengan dudukan nyaman, ideal untuk cafe dan resto.",
    image: "",
    featured: false,
  },
  {
    id: "meja-kayu-minimalis",
    slug: "meja-kayu-minimalis",
    name: "Meja Kayu Minimalis",
    price: 800000,
    category: "Meja",
    description:
      "Meja serbaguna dengan desain sederhana untuk berbagai kebutuhan.",
    image: "",
    featured: false,
  },
  {
    id: "sofa-mini-hijau",
    slug: "sofa-mini-hijau",
    name: "Sofa Mini Hijau",
    price: 1350000,
    category: "Sofa",
    description:
      "Sofa dua dudukan dengan warna hijau soft untuk ruang keluarga.",
    image: "",
    featured: true,
  },
  {
    id: "sofa-mini-hijaudaun",
    slug: "sofa-mini-hijaudaun",
    name: "Sofa Mini Hijaudaun",
    price: 1350000,
    category: "Sofa",
    description:
      "Sofa dua dudukan dengan warna hijau soft untuk ruang keluarga.",
    image: "",
    featured: true,
  },
];

export const featuredProducts = products.filter((p) => p.featured);

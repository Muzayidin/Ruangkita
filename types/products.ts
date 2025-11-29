export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string; // URL gambar dari database
  featured: 0 | 1; // 1 untuk true, 0 untuk false di SQLite
};

import { PrismaClient } from "@prisma/client";
import { Product } from "@/types/products";

const prisma = new PrismaClient();

// Fungsi untuk menambahkan produk baru
export async function addProduct(productData: Omit<Product, "id">) {
  try {
    const newProduct = await prisma.products.create({
      data: {
        slug: productData.slug,
        name: productData.name,
        price: productData.price,
        category: productData.category,
        description: productData.description,
        imageUrl: productData.imageUrl,
        stock: productData.stock,
        featured: productData.featured,
        soldCount: productData.soldCount ?? 0,
        originalPrice: productData.originalPrice,
      },
    });

    return {
      ...productData,
      id: newProduct.id,
    };
  } catch (error) {
    console.error("Database Create Error (addProduct):", error);
    throw new Error("Gagal menambahkan produk ke database.");
  }
}

// Fungsi untuk mendapatkan semua produk unggulan (Featured Products)
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const products = await prisma.products.findMany({
      where: {
        featured: 1,
      },
    });
    return products as Product[];
  } catch (error) {
    console.error("Database Read Error (getFeaturedProducts):", error);
    return [];
  }
}

// Fungsi untuk mendapatkan semua produk
export async function getAllProducts(
  limit: number = 20,
  offset: number = 0,
  filters: { category?: string; search?: string; sortBy?: string } = {}
): Promise<Product[]> {
  try {
    const where: any = {};

    // Filter Kategori
    if (filters.category && filters.category !== "Semua") {
      where.category = filters.category;
    }

    // Filter Search
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { category: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    // Sorting
    let orderBy: any = { createdAt: "desc" }; // Default
    switch (filters.sortBy) {
      case "price_asc":
        orderBy = { price: "asc" };
        break;
      case "price_desc":
        orderBy = { price: "desc" };
        break;
      case "best_selling":
        orderBy = [{ soldCount: "desc" }, { featured: "desc" }];
        break;
      case "newest":
        orderBy = [{ createdAt: "desc" }, { id: "desc" }];
        break;
    }

    const products = await prisma.products.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy,
    });

    return products as Product[];
  } catch (error) {
    console.error("Database Read Error (getAllProducts):", error);
    return [];
  }
}

// Fungsi untuk mendapatkan produk berdasarkan slug
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const product = await prisma.products.findUnique({
      where: { slug },
    });
    return product as Product | undefined;
  } catch (error) {
    console.error(`Database Read Error (getProductBySlug: ${slug}):`, error);
    return undefined;
  }
}

// Fungsi untuk mendapatkan produk terkait berdasarkan kategori
export async function getRelatedProducts(
  category: string,
  excludeSlug: string,
  limit: number = 4
): Promise<Product[]> {
  try {
    const products = await prisma.products.findMany({
      where: {
        category,
        slug: { not: excludeSlug },
      },
      take: limit,
    });
    return products as Product[];
  } catch (error) {
    console.error("Database Read Error (getRelatedProducts):", error);
    return [];
  }
}

// Fungsi untuk mencari artikel
export async function searchArticles(query: string) {
  try {
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
    return articles;
  } catch (error) {
    console.error("Database Article Search Error:", error);
    return [];
  }
}

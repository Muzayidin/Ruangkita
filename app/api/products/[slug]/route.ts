import { NextResponse } from "next/server";
import { getProductBySlug } from "@/database/db-helper";
import { Product } from "@/types/products";

interface Context {
  params: Promise<{
    slug: string;
  }>;
}

// Handler GET untuk mengambil SATU produk berdasarkan slug
export async function GET(request: Request, context: Context) {
  const params = await context.params;
  const productSlug = params.slug;

  if (!productSlug) {
    // Ini seharusnya tidak terjadi jika route diakses dengan benar
    return NextResponse.json(
      { message: "Slug produk tidak ditemukan" },
      { status: 400 }
    );
  }

  try {
    const product: Product | undefined = getProductBySlug(productSlug); // Panggil helper database

    if (!product) {
      // Jika produk tidak ditemukan di database (404)
      return NextResponse.json(
        { message: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    // Mengembalikan data produk tunggal
    return NextResponse.json(product);
  } catch (error) {
    // Menangkap error dari db-helper (misalnya, error koneksi database)
    console.error(
      `CRITICAL: Gagal mengambil produk dengan slug ${productSlug} dari DB:`,
      error
    );
    return NextResponse.json(
      { message: "Kesalahan server saat mengakses database" },
      { status: 500 } // Menggunakan 500 untuk error internal server
    );
  }
}

import { NextResponse } from "next/server";
// Asumsikan getAllProducts dan addProduct diimpor dari helper database
import { getAllProducts, addProduct } from "@/database/db-helper";

// Handler GET untuk mengambil daftar semua produk
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "newest";

    // Memanggil helper database untuk mendapatkan semua produk dengan pagination
    const products = await getAllProducts(limit, offset, { category, search, sortBy });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Gagal mengambil data produk:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data produk" },
      { status: 500 }
    );
  }
}

// Handler POST untuk MENAMBAH produk baru
export async function POST(request: Request) {
  try {
    // Mengambil data produk baru dari body request (dari formulir admin)
    const newProductData = await request.json();

    // Validasi sederhana
    if (!newProductData.name || !newProductData.slug || !newProductData.price) {
      return NextResponse.json(
        {
          message: "Data produk tidak lengkap (Nama, Slug, Harga wajib diisi)",
        },
        { status: 400 }
      );
    }

    // Panggil helper database untuk menyimpan produk baru
    const result = await addProduct(newProductData);

    // Mengembalikan status sukses 201 (Created)
    return NextResponse.json(
      { message: "Produk berhasil ditambahkan", product: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gagal menambahkan produk:", error);
    return NextResponse.json(
      { message: "Gagal menambahkan produk ke database" },
      { status: 500 }
    );
  }
}

// app/api/admin/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import crypto from "crypto";
import fs from "fs";
import path from "path";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_auth_token");
  return !!token;
}

// GET /api/admin/products -> ambil semua produk
export async function GET() {
  const ok = await requireAdmin();
  if (!ok) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const products = await prisma.products.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(products);
}

// POST /api/admin/products -> tambah produk baru (multipart/form-data)
export async function POST(req: NextRequest) {
  const ok = await requireAdmin();
  if (!ok) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();

  const name = (formData.get("name") ?? "").toString().trim();
  const slugRaw = formData.get("slug")?.toString().trim() || "";
  const category = formData.get("category")?.toString().trim() || null;
  const description = formData.get("description")?.toString().trim() || null;
  const priceStr = (formData.get("price") ?? "").toString();
  const stockStr = formData.get("stock")?.toString() ?? "";
  const imageUrlManual = formData.get("imageUrl")?.toString().trim() || "";
  const featuredStr = formData.get("featured")?.toString() ?? "";

  const imageFile = formData.get("image") as File | null;

  if (!name) {
    return new NextResponse("Name wajib diisi", { status: 400 });
  }

  const priceNumber = Number(priceStr);
  if (Number.isNaN(priceNumber)) {
    return new NextResponse("Price wajib berupa angka", {
      status: 400,
    });
  }

  // generate id & slug
  const id = crypto.randomUUID();
  const slug =
    slugRaw ||
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

  // simpan file gambar jika ada
  let finalImageUrl: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const mime = imageFile.type || "image/jpeg";
    const ext = mime.split("/")[1] || "jpg";
    const filename = `${crypto.randomUUID()}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filepath, buffer);

    finalImageUrl = `/uploads/${filename}`;
  } else if (imageUrlManual) {
    // jika tidak ada file tapi ada URL manual
    finalImageUrl = imageUrlManual;
  }

  const stockNumber = stockStr === "" ? 0 : Number(stockStr) || 0;
  const featuredNumber = featuredStr === "" ? 0 : Number(featuredStr) || 0;
  const soldCountStr = formData.get("soldCount")?.toString() ?? "";
  const soldCountNumber = soldCountStr === "" ? 0 : Number(soldCountStr) || 0;

  const originalPriceStr = formData.get("originalPrice")?.toString() ?? "";
  const originalPriceNumber = originalPriceStr === "" ? null : Number(originalPriceStr);

  try {
    const product = await prisma.products.create({
      data: {
        id,
        slug,
        name,
        price: priceNumber,
        category,
        description,
        imageUrl: finalImageUrl,
        stock: stockNumber,
        featured: featuredNumber,
        soldCount: soldCountNumber,
        originalPrice: originalPriceNumber,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    console.error("Error creating product:", err);

    if (err.code === "P2002") {
      return new NextResponse("Slug sudah digunakan", {
        status: 400,
      });
    }

    return new NextResponse("Gagal membuat produk", {
      status: 500,
    });
  }
}

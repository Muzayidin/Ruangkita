import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import crypto from "crypto";

// cek auth admin
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

// POST /api/admin/products -> tambah produk baru
export async function POST(req: Request) {
  const ok = await requireAdmin();
  if (!ok) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  let {
    id,
    slug,
    name,
    price,
    category,
    description,
    imageUrl,
    stock,
    featured,
  } = body as {
    id?: string;
    slug?: string;
    name: string;
    price: number;
    category?: string | null;
    description?: string | null;
    imageUrl?: string | null;
    stock?: number | null;
    featured?: number | null;
  };

  if (!name || typeof price !== "number") {
    return new NextResponse("Name dan price wajib diisi", { status: 400 });
  }

  // generate id & slug kalau belum dikirim dari client
  if (!id) {
    id = crypto.randomUUID();
  }

  if (!slug) {
    slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  const product = await prisma.products.create({
    data: {
      id,
      slug,
      name,
      price,
      category: category ?? null,
      description: description ?? null,
      imageUrl: imageUrl ?? null,
      stock: stock ?? 0,
      featured: featured ?? 0,
    },
  });

  return NextResponse.json(product, { status: 201 });
}

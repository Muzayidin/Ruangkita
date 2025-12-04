import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_auth_token");
  return !!token;
}

// PUT /api/admin/products/[id] -> update produk
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const ok = await requireAdmin();
  if (!ok) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();

  const {
    slug,
    name,
    price,
    category,
    description,
    imageUrl,
    stock,
    featured,
  } = body as {
    slug?: string;
    name?: string;
    price?: number;
    category?: string | null;
    description?: string | null;
    imageUrl?: string | null;
    stock?: number | null;
    featured?: number | null;
  };

  const id = params.id; // id string sesuai schema

  const product = await prisma.products.update({
    where: { id },
    data: {
      // hanya update kalau nilai dikirim, supaya tidak overwrite jadi null/undefined tanpa sengaja
      ...(slug !== undefined && { slug }),
      ...(name !== undefined && { name }),
      ...(price !== undefined && { price }),
      ...(category !== undefined && { category }),
      ...(description !== undefined && { description }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(stock !== undefined && { stock }),
      ...(featured !== undefined && { featured }),
    },
  });

  return NextResponse.json(product);
}

// DELETE /api/admin/products/[id] -> hapus produk
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const ok = await requireAdmin();
  if (!ok) return new NextResponse("Unauthorized", { status: 401 });

  const id = params.id;

  await prisma.products.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}

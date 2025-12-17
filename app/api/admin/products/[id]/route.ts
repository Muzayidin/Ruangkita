// app/api/admin/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_auth_token");
  return !!token;
}

// helper: hapus file gambar lokal di /public/uploads
async function deleteLocalImage(imageUrl?: string | null) {
  if (!imageUrl) return;
  if (!imageUrl.startsWith("/uploads/")) return;

  const filePath = path.join(process.cwd(), "public", imageUrl);

  try {
    await fs.promises.unlink(filePath);
    console.log("Deleted image:", filePath);
  } catch (err: any) {
    if (err.code === "ENOENT") {
      console.warn("Image not found, skip:", filePath);
    } else {
      console.error("Failed to delete image:", err);
    }
  }
}

// ================== PUT /api/admin/products/[id] ==================
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const ok = await requireAdmin();
  if (!ok) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await ctx.params;
  if (!id) {
    return new NextResponse("Product ID is required", { status: 400 });
  }

  const existing = await prisma.products.findUnique({ where: { id } });
  if (!existing) {
    return new NextResponse("Product not found", { status: 404 });
  }

  const formData = await req.formData();

  const name = (formData.get("name") ?? existing.name).toString();
  const slugRaw = formData.get("slug")?.toString().trim();
  const category =
    formData.get("category")?.toString().trim() ?? existing.category;
  const description =
    formData.get("description")?.toString().trim() ?? existing.description;
  const priceStr =
    formData.get("price")?.toString() ?? existing.price.toString();
  const stockStr =
    formData.get("stock")?.toString() ?? existing.stock?.toString() ?? "";
  const imageUrlManual = formData.get("imageUrl")?.toString().trim() ?? "";
  const featuredStr =
    formData.get("featured")?.toString() ?? existing.featured?.toString() ?? "";

  const imageFile = formData.get("image") as File | null;

  const priceNumber = Number(priceStr);
  if (Number.isNaN(priceNumber)) {
    return new NextResponse("Price wajib berupa angka", {
      status: 400,
    });
  }

  let newImageUrl: string | null = existing.imageUrl;

  // 1) jika ada file baru, simpan file dan pakai URL itu
  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const mime = imageFile.type || "image/jpeg";
    const ext = mime.split("/")[1] || "jpg";
    const filename = `${Date.now()}-${id}.${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filepath, buffer);

    // set URL baru
    newImageUrl = `/uploads/${filename}`;

    // hapus file lama kalau lokal
    if (existing.imageUrl && existing.imageUrl !== newImageUrl) {
      await deleteLocalImage(existing.imageUrl);
    }
  } else {
    // 2) kalau tidak ada file baru tapi ada perubahan URL manual
    if (imageUrlManual && imageUrlManual !== existing.imageUrl) {
      // jika lama lokal, hapus
      await deleteLocalImage(existing.imageUrl);
      newImageUrl = imageUrlManual;
    }
  }

  const stockNumber = stockStr === "" ? null : Number(stockStr) || 0;
  const featuredNumber = featuredStr === "" ? null : Number(featuredStr) || 0;
  const soldCountStr = formData.get("soldCount")?.toString() ?? existing.soldCount?.toString() ?? "";
  const soldCountNumber = soldCountStr === "" ? 0 : Number(soldCountStr) || 0;

  const originalPriceStr = formData.get("originalPrice")?.toString() ?? existing.originalPrice?.toString() ?? "";
  const originalPriceNumber = originalPriceStr === "" ? null : Number(originalPriceStr);

  const slug =
    slugRaw && slugRaw.length > 0
      ? slugRaw
      : existing.slug ||
      name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

  try {
    const updated = await prisma.products.update({
      where: { id },
      data: {
        slug,
        name,
        price: priceNumber,
        category,
        description,
        imageUrl: newImageUrl,
        stock: stockNumber,
        featured: featuredNumber,
        soldCount: soldCountNumber,
        originalPrice: originalPriceNumber,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Error updating product:", err);
    return new NextResponse("Failed to update product: " + (err instanceof Error ? err.message : String(err)), {
      status: 500,
    });
  }
}

// ================== DELETE /api/admin/products/[id] ==================
export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const ok = await requireAdmin();
  if (!ok) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await ctx.params;
  if (!id) {
    return new NextResponse("Product ID is required", { status: 400 });
  }

  try {
    const product = await prisma.products.findUnique({ where: { id } });
    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    await prisma.products.delete({ where: { id } });

    await deleteLocalImage(product.imageUrl);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Error deleting product:", err);
    return new NextResponse("Failed to delete product", {
      status: 500,
    });
  }
}

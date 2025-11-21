// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

interface Params {
  params: { id: string };
}

// Ambil 1 produk
export async function GET(_req: Request, { params }: Params) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Update produk
export async function PUT(request: Request, { params }: Params) {
  const body = await request.json();
  const { name, slug, price, category, description, image, featured } = body;

  const { data, error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      price,
      category,
      description,
      image,
      featured: !!featured,
    })
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// Hapus produk
export async function DELETE(_req: Request, { params }: Params) {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", params.id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

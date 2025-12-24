import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import ProductEditForm from "./ProductEditForm";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_auth_token");
  if (!token) {
    redirect("/admin/login");
  }
}

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage(props: PageProps) {
  await requireAdmin();
  const { id } = await props.params;

  if (!id) {
    notFound();
  }

  const product = await prisma.products.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Edit Produk
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          ID: {product.id}
        </p>
      </div>

      <ProductEditForm product={product as any} />
    </div>
  );
}

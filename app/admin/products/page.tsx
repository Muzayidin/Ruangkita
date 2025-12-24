import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminProductList from "@/components/admin/AdminProductList";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_auth_token");
  if (!token) redirect("/admin/login");
}

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.products.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Produk</h1>
          <p className="text-slate-500 dark:text-slate-400">Kelola katalog produk dan produk unggulan RuangKita</p>
        </div>
        <Link href="/admin/products/new">
          <button className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-semibold text-sm shadow-lg shadow-orange-900/20 transition-all hover:scale-105">
            + Tambah Produk
          </button>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Total Produk
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100 font-serif">
            {products.length}
          </div>
        </div>
      </div>

      {/* Product Grid with Search - via Client Component */}
      <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[500px]">
        <AdminProductList initialProducts={products} />
      </div>
    </div>
  );
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProductInputForm from "../[id]/ProductInputForm";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_auth_token");
  if (!token) {
    redirect("/admin/login");
  }
}

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Tambah Produk
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Buat produk baru untuk katalog RuangKita
        </p>
      </div>

      <ProductInputForm />
    </div>
  );
}

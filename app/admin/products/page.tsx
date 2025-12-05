import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProductCard from "@/components/admin/ProductCard";
import AdminShell from "../AdminShell";
import { adminTheme as t } from "../adminTheme";

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
    <AdminShell
      title="Produk"
      subtitle="Kelola katalog produk dan produk unggulan RuangKita"
      actions={
        <>
          <Link href="/admin/products/new">
            <button
              style={{
                padding: "8px 16px",
                background: t.primary,
                color: "white",
                border: "none",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Tambah Produk
            </button>
          </Link>
        </>
      }
    >
      {/* Card ringkasan (opsional) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            background: t.surface,
            borderRadius: t.radiusLg,
            border: `1px solid ${t.borderSoft}`,
            padding: 16,
            boxShadow: t.shadowSoft,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: t.textMuted,
              marginBottom: 4,
            }}
          >
            Total produk
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.text }}>
            {products.length}
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div
          style={{
            background: t.surface,
            borderRadius: t.radiusLg,
            border: `1px solid ${t.borderSoft}`,
            padding: 32,
            textAlign: "center",
            color: t.textSoft,
          }}
        >
          Belum ada produk. Mulai dengan menambahkan produk pertama.
        </div>
      ) : (
        <div
          style={{
            background: t.surface,
            borderRadius: t.radiusLg,
            border: `1px solid ${t.borderSoft}`,
            padding: 16,
            boxShadow: t.shadowCard,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/admin/products/${p.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ProductCard
                  name={p.name}
                  price={p.price}
                  imageUrl={p.imageUrl}
                  category={p.category}
                  featured={p.featured}
                  stock={p.stock}
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}

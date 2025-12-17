import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "../AdminShell";
import { adminTheme as t } from "../adminTheme";
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
    <AdminShell
      title="Produk"
      subtitle="Kelola katalog produk dan produk unggulan RuangKita"
      actions={
        <>
          <Link href="/admin/products/new">
            <button
              style={{
                padding: "10px 24px",
                background: t.primary,
                color: "white",
                border: "none",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: t.shadowSoft,
                transition: "transform 0.2s",
              }}
            >
              + Tambah Produk
            </button>
          </Link>
        </>
      }
    >
      {/* Stats Summary */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            background: t.surface,
            backdropFilter: "blur(12px)",
            borderRadius: t.radiusMd,
            border: `1px solid ${t.border}`,
            padding: 24,
            boxShadow: t.shadowCard,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1,
              color: t.textMuted,
              marginBottom: 8,
            }}
          >
            Total Produk
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: t.text, fontFamily: 'serif' }}>
            {products.length}
          </div>
        </div>
      </div>

      {/* Product Grid with Search - via Client Component */}
      <AdminProductList initialProducts={products} />
    </AdminShell>
  );
}

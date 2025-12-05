import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import ProductEditForm from "./ProductEditForm";
import AdminShell from "../../AdminShell";
import { adminTheme as t } from "../../adminTheme";

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
    <AdminShell
      title="Edit Produk"
      subtitle={`ID: ${product.id}`}
      actions={null}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.6fr)",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        {/* Kiri: preview gambar */}
        <div
          style={{
            background: t.surface,
            borderRadius: t.radiusLg,
            border: `1px solid ${t.borderSoft}`,
            padding: 16,
            boxShadow: t.shadowSoft,
          }}
        >
          <h3
            style={{
              marginTop: 0,
              marginBottom: 8,
              fontSize: 14,
              fontWeight: 600,
              color: t.textSoft,
            }}
          >
            Preview Foto
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                borderRadius: t.radiusLg,
                border: `1px solid ${t.borderSoft}`,
                overflow: "hidden",
                background: t.bgSoft,
                position: "relative",
                width: "100%",
                maxWidth: 260, // ⬅️ SAMAIN dengan card (260px)
                aspectRatio: "1 / 1", // ⬅️ tetap 1:1
                boxShadow: t.shadowSoft,
              }}
            >
              <img
                src={product.imageUrl || "/placeholder-product.jpg"}
                alt={product.name}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
          </div>

          <p
            style={{
              fontSize: 12,
              color: t.textMuted,
              marginTop: 8,
            }}
          >
            Foto akan mengikuti URL atau file yang kamu pilih di form.
          </p>
        </div>

        {/* Kanan: form edit */}
        <ProductEditForm product={product as any} />
      </div>
    </AdminShell>
  );
}

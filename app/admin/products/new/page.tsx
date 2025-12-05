import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "../../AdminShell";
import { adminTheme as t } from "../../adminTheme";
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
    <AdminShell
      title="Tambah Produk"
      subtitle="Buat produk baru untuk katalog RuangKita"
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
        {/* Kiri: preview placeholder */}
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
              borderRadius: t.radiusMd,
              border: `1px solid ${t.borderSoft}`,
              overflow: "hidden",
              background: t.bgSoft,
              height: 320,
            }}
          >
            <img
              src="/placeholder-product.jpg"
              alt="Produk baru"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
          <p
            style={{
              fontSize: 12,
              color: t.textMuted,
              marginTop: 8,
            }}
          >
            Setelah produk dibuat, foto akan tampil sesuai file atau URL yang
            kamu pilih di form.
          </p>
        </div>

        {/* Kanan: form input */}
        <ProductInputForm />
      </div>
    </AdminShell>
  );
}

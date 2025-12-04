import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";
import Link from "next/link";

async function requireAdminAuth() {
  const cookieStore = await cookies();
  const adminAuthToken = cookieStore.get("admin_auth_token");

  if (!adminAuthToken) {
    redirect("/admin/login");
  }
}

export default async function AdminDashboardPage() {
  await requireAdminAuth();

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #0070f3",
        borderRadius: "8px",
        backgroundColor: "#f0f8ff",
      }}
    >
      <h1>Selamat Datang di Dashboard Admin! 👋</h1>
      <p>
        Ini adalah halaman yang dilindungi. Hanya admin yang sudah login yang
        dapat melihatnya.
      </p>

      <div style={{ marginTop: "20px" }}>
        <h3>Menu Cepat</h3>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <Link
            href="/admin/products"
            style={{
              padding: "8px 16px",
              borderRadius: 4,
              border: "none",
              background: "#0070f3",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Kelola Produk
          </Link>

          {/* nanti bisa tambah menu lain di sini */}
        </div>
      </div>

      <div
        style={{
          marginTop: "30px",
          paddingTop: "20px",
          borderTop: "1px solid #ccc",
        }}
      >
        <p>Anda dapat mengelola produk, pesanan, dan pelanggan di sini.</p>
        <LogoutButton />
      </div>
    </div>
  );
}

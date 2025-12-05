// app/admin/AdminShell.tsx
import Link from "next/link";
import { adminTheme as t } from "./adminTheme";

type AdminShellProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

const navItemStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 8,
  fontSize: 14,
  color: t.textSoft,
  fontWeight: 500,
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: 8,
};

export default function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: AdminShellProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        display: "grid",
        gridTemplateColumns: "260px minmax(0, 1fr)",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          borderRight: `1px solid ${t.border}`,
          background: "#ffffff",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: 0.3,
            marginBottom: 8,
            color: t.text,
          }}
        >
          RuangKita Admin
        </div>
        <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 12 }}>
          Dashboard toko furniture
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Link href="/admin/products" style={navItemStyle}>
            <span>🪑</span>
            <span>Produk</span>
          </Link>
          {/* kalau nanti mau tambah menu lain tinggal tambah di sini */}
          {/* <Link href="/admin/orders" style={navItemStyle}>...</Link> */}
        </nav>

        <div style={{ flexGrow: 1 }} />

        <div
          style={{
            fontSize: 12,
            color: t.textMuted,
            borderTop: `1px solid ${t.borderSoft}`,
            paddingTop: 12,
          }}
        >
          Masuk sebagai Admin
        </div>
      </aside>

      {/* Main */}
      <main
        style={{
          padding: "20px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Top bar */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                color: t.text,
                letterSpacing: 0.2,
                fontWeight: 700,
              }}
            >
              {title}
            </h1>

            {subtitle && (
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: 13,
                  color: t.textMuted,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {actions && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {actions}
            </div>
          )}
        </header>

        {/* Body */}
        <section style={{ paddingTop: 4 }}>{children}</section>
      </main>
    </div>
  );
}

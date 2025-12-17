
// app/admin/AdminShell.tsx
"use client";

import Link from "next/link";
import { adminTheme } from "./adminTheme";

type AdminShellProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

// Simplified: We don't need useTheme here anymore because styles use vars.
// But wait, the special logic for sidebar background?
// background: mounted && theme === 'dark' ? "rgba(0,0,0,0.2)" : "rgba(255, 255, 255, 0.5)"
// I can make that a variable too? "surface".
// Let's use adminTheme.surface.

export default function AdminShell({
  title,
  subtitle,
  actions,
  children,
}: AdminShellProps) {

  const t = adminTheme;

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
    transition: "color 0.2s"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        display: "grid",
        gridTemplateColumns: "260px minmax(0, 1fr)",
        transition: "background 0.3s ease"
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          borderRight: `1px solid ${t.border}`,
          background: t.surface, // Use the variable
          backdropFilter: "blur(12px)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          transition: "border-color 0.3s ease, background 0.3s ease"
        }}
      >
        <div
          style={{
            fontWeight: 900,
            fontSize: 24,
            letterSpacing: -0.5,
            marginBottom: 8,
            color: t.text,
            fontFamily: "serif",
            transition: "color 0.3s ease"
          }}
        >
          RuangKita <span style={{ color: t.warning }}>.</span>
        </div>
        <div style={{ fontSize: 13, color: t.textSoft, marginBottom: 16 }}>
          Admin Dashboard
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Link href="/admin/dashboard" style={navItemStyle}>
            <span>🏠</span>
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/products" style={navItemStyle}>
            <span>🪑</span>
            <span>Produk</span>
          </Link>
          <Link href="/admin/articles" style={navItemStyle}>
            <span>📝</span>
            <span>Artikel</span>
          </Link>
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
                transition: "color 0.3s ease"
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

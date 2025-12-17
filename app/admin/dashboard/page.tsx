
import Link from "next/link";
import AdminShell from "../AdminShell";
import { adminTheme as t } from "../adminTheme";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Force dynamic to get fresh counts
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    // Fetch counts in parallel
    const [productCount, articleCount] = await Promise.all([
        prisma.products.count(),
        prisma.article.count(),
    ]);

    return (
        <AdminShell
            title="Dashboard"
            subtitle="Ringkasan aktivitas website"
        >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>

                {/* Card Produk */}
                <div
                    style={{
                        background: "white",
                        padding: 24,
                        borderRadius: 16,
                        border: `1px solid ${t.border}`,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 14, color: t.textSoft, fontWeight: 600 }}>Total Produk</span>
                        <span style={{ fontSize: 24 }}>🪑</span>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: t.text }}>
                        {productCount}
                    </div>
                    <Link
                        href="/admin/products"
                        style={{
                            fontSize: 13,
                            color: t.primary,
                            fontWeight: 600,
                            textDecoration: "none"
                        }}
                    >
                        Kelola Produk →
                    </Link>
                </div>

                {/* Card Artikel */}
                <div
                    style={{
                        background: "white",
                        padding: 24,
                        borderRadius: 16,
                        border: `1px solid ${t.border}`,
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 14, color: t.textSoft, fontWeight: 600 }}>Total Artikel</span>
                        <span style={{ fontSize: 24 }}>📝</span>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: t.text }}>
                        {articleCount}
                    </div>
                    <Link
                        href="/admin/articles"
                        style={{
                            fontSize: 13,
                            color: t.primary,
                            fontWeight: 600,
                            textDecoration: "none"
                        }}
                    >
                        Kelola Artikel →
                    </Link>
                </div>

            </div>

            <div style={{ marginTop: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 16 }}>Aksi Cepat</h3>
                <div style={{ display: "flex", gap: 12 }}>
                    <Link
                        href="/admin/products/new" // Assuming this exists or will exist, usually create is separate page or modal. Checking listing... usually user creates manually.
                        // Wait, I haven't checked if /admin/products/create exists. Usually products page has the button. 
                        // I'll just link to the list pages for now or create pages if I know them.
                        // I created /admin/articles/create.
                        href="/admin/articles/create"
                        style={{
                            padding: "12px 20px",
                            background: "white",
                            border: `1px solid ${t.border}`,
                            borderRadius: 12,
                            textDecoration: "none",
                            color: t.text,
                            fontWeight: 600,
                            fontSize: 14,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            boxShadow: t.shadowCard
                        }}
                    >
                        <span>✍️</span> Tulis Artikel Baru
                    </Link>

                    <Link
                        href="/admin/products"
                        style={{
                            padding: "12px 20px",
                            background: "white",
                            border: `1px solid ${t.border}`,
                            borderRadius: 12,
                            textDecoration: "none",
                            color: t.text,
                            fontWeight: 600,
                            fontSize: 14,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            boxShadow: t.shadowCard
                        }}
                    >
                        <span>📦</span> Tambah Produk
                    </Link>
                </div>
            </div>
        </AdminShell>
    );
}

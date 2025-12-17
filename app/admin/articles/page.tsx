
import Link from "next/link";
import AdminShell from "../AdminShell";
import { adminTheme as t } from "../adminTheme";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Add revalidation to ensure fresh data
export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
    const articles = await prisma.article.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <AdminShell
            title="Artikel Blog"
            subtitle="Kelola postingan blog dan artikel"
            actions={
                <Link
                    href="/admin/articles/create"
                    style={{
                        background: t.primary,
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: 500,
                        textDecoration: "none",
                    }}
                >
                    + Buat Artikel Baru
                </Link>
            }
        >
            <div
                style={{
                    background: "white",
                    borderRadius: 12,
                    border: `1px solid ${t.border}`,
                    overflow: "hidden",
                }}
            >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr
                            style={{
                                borderBottom: `1px solid ${t.border}`,
                                background: t.bg,
                                textAlign: "left",
                            }}
                        >
                            <th style={{ padding: "12px 16px", fontSize: 13, color: t.textSoft }}>Judul</th>
                            <th style={{ padding: "12px 16px", fontSize: 13, color: t.textSoft }}>Slug</th>
                            <th style={{ padding: "12px 16px", fontSize: 13, color: t.textSoft }}>Tanggal</th>
                            <th style={{ padding: "12px 16px", fontSize: 13, color: t.textSoft }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: 32, textAlign: "center", color: t.textMuted }}>
                                    Belum ada artikel.
                                </td>
                            </tr>
                        ) : (
                            articles.map((article) => (
                                <tr key={article.id} style={{ borderBottom: `1px solid ${t.borderSoft}` }}>
                                    <td style={{ padding: "12px 16px", color: t.text }}>{article.title}</td>
                                    <td style={{ padding: "12px 16px", color: t.textMuted }}>{article.slug}</td>
                                    <td style={{ padding: "12px 16px", color: t.textMuted }}>
                                        {new Date(article.createdAt).toLocaleDateString("id-ID")}
                                    </td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <span
                                            style={{
                                                background: article.published ? "#dcfce7" : "#f3f4f6", // tailwind green-100 or gray-100
                                                color: article.published ? "#166534" : "#4b5563", // tailwind green-800 or gray-600
                                                padding: "2px 8px",
                                                borderRadius: 99,
                                                fontSize: 11,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {article.published ? "Published" : "Draft"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AdminShell>
    );
}

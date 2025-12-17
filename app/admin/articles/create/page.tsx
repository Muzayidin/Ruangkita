
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import AdminShell from "../../AdminShell";
import { adminTheme as t } from "../../adminTheme";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreateArticlePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        imageUrl: "",
        content: "",
    });

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        // Auto-generate slug from title
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        setFormData((prev) => ({ ...prev, title, slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to create article");

            router.push("/admin/articles");
            router.refresh(); // Refresh the list
        } catch (error) {
            alert("Error creating article");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminShell
            title="Buat Artikel Baru"
            subtitle="Tulis artikel blog baru"
        >
            <div
                style={{
                    background: "white",
                    padding: 32,
                    borderRadius: 12,
                    border: `1px solid ${t.border}`,
                    maxWidth: 900,
                }}
            >
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Title */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Judul Artikel</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={handleTitleChange}
                            placeholder="Masukkan judul artikel..."
                            style={{
                                padding: "10px 12px",
                                border: `1px solid ${t.border}`,
                                borderRadius: 6,
                                fontSize: 14,
                                outline: "none",
                            }}
                        />
                    </div>

                    {/* Slug */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Slug (URL)</label>
                        <input
                            type="text"
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            style={{
                                padding: "10px 12px",
                                border: `1px solid ${t.border}`,
                                borderRadius: 6,
                                fontSize: 14,
                                background: t.bg,
                                color: t.textMuted,
                                outline: "none",
                            }}
                        />
                    </div>

                    {/* Image URL */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: t.text }}>URL Gambar Cover</label>
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            style={{
                                padding: "10px 12px",
                                border: `1px solid ${t.border}`,
                                borderRadius: 6,
                                fontSize: 14,
                                outline: "none",
                            }}
                        />
                    </div>

                    {/* Rich Text Content */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <label style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Konten</label>
                        <div style={{ height: 400, marginBottom: 50 }}> {/* Extra header for toolbar */}
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={(content) => setFormData({ ...formData, content })}
                                style={{ height: "100%" }}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 24 }}>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            disabled={loading}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 6,
                                fontSize: 14,
                                fontWeight: 600,
                                background: "transparent",
                                border: `1px solid ${t.border}`,
                                color: t.textSoft,
                                cursor: "pointer",
                            }}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 6,
                                fontSize: 14,
                                fontWeight: 600,
                                background: t.primary,
                                color: "white",
                                border: "none",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? "Menyimpan..." : "Simpan Artikel"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminShell>
    );
}

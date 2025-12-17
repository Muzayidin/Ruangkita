"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/admin/ProductCard";
import { adminTheme as t } from "@/app/admin/adminTheme";

// Duplicate type for now to avoid large refactors elsewhere, or better yet, import from types if possible.
// Because the page passes Prisma objects, we define a loose interface here or reuse your Product types.
// Assuming props come from prisma which matches:
interface AdminProduct {
    id: string;
    name: string;
    price: number;
    category: string;
    imageUrl: string | null;
    description: string;
    featured: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
}

export default function AdminProductList({ initialProducts }: { initialProducts: any[] }) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = initialProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div style={{ marginBottom: 24, display: "flex", gap: 16, alignItems: "center" }}>
                <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        flex: 1,
                        padding: "12px 16px",
                        borderRadius: t.radiusMd,
                        border: `1px solid ${t.border}`,
                        background: t.surface,
                        color: t.text,
                        outline: "none",
                        fontSize: 14,
                        transition: "all 0.2s ease",
                        boxShadow: "none"
                    }}
                // Add focus style manually or via class if using CSS-in-JS/Tailwind (Admin usually uses inline styles in this project based on view_file)
                />
                {/* You could add sort/filter dropdowns here later */}
            </div>

            {filteredProducts.length === 0 ? (
                <div
                    style={{
                        background: t.surface,
                        borderRadius: t.radiusLg,
                        border: `1px solid ${t.border}`,
                        padding: 48,
                        textAlign: "center",
                        color: t.textSoft,
                        fontSize: 16
                    }}
                >
                    {searchQuery ? `Tidak ada produk yang cocok dengan "${searchQuery}"` : "Belum ada produk."}
                </div>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                        gap: 12,
                    }}
                >
                    {filteredProducts.map((p) => (
                        <Link
                            key={p.id}
                            href={`/admin/products/${p.id}`}
                            style={{ textDecoration: "none", color: "inherit", display: 'block' }}
                        >
                            <ProductCard
                                name={p.name}
                                price={p.price}
                                imageUrl={p.imageUrl || ""}
                                category={p.category}
                                featured={p.featured}
                                stock={p.stock}
                            />
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}

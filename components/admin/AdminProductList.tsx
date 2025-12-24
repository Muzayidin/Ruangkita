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
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Get unique categories
    const categories = ["All", ...Array.from(new Set(initialProducts.map(p => p.category || "Uncategorized"))).filter(Boolean)];

    const filteredProducts = initialProducts.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || (p.category || "Uncategorized") === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <>
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Cari produk berdasarkan nama..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors shadow-sm"
                    />
                </div>

                {/* Filter Category */}
                <div className="w-full md:w-48">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="block w-full py-2.5 pl-3 pr-10 border border-slate-200 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-colors shadow-sm"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat === "All" ? "Semua Kategori" : cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-12 px-6 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <div className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {searchQuery ? `Tidak ada produk yang cocok dengan "${searchQuery}"` : "Belum ada produk dalam katalog."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredProducts.map((p) => (
                        <Link
                            key={p.id}
                            href={`/admin/products/${p.id}`}
                            className="block group"
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

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types/products";
import Link from "next/link";

interface Article {
    id: number;
    title: string;
    slug: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";

    const [products, setProducts] = useState<Product[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!query) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setProducts(data.products || []);
                setArticles(data.articles || []);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [query]);

    return (
        <main className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
            <h1 className="text-2xl md:text-3xl font-bold mb-8">
                Hasil Pencarian untuk "<span className="text-accent">{query}</span>"
            </h1>

            {loading ? (
                <div className="flex flex-col gap-4 animate-pulse">
                    <div className="h-8 bg-muted/20 w-1/3 rounded"></div>
                    <div className="h-64 bg-muted/20 w-full rounded"></div>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Products Section */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>🛒</span> Produk Ditemukan ({products.length})
                        </h2>
                        {products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted italic">Tidak ada produk yang cocok.</p>
                        )}
                    </section>

                    {/* Articles Section */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>📝</span> Artikel Ditemukan ({articles.length})
                        </h2>
                        {articles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {articles.map((article) => (
                                    <Link
                                        key={article.id}
                                        href={`/blog/${article.slug}`}
                                        className="group border border-muted/20 rounded-xl p-4 hover:bg-muted/5 transition-colors"
                                    >
                                        <h3 className="font-bold text-lg group-hover:text-accent transition-colors mb-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-muted line-clamp-2">
                                            {article.content.replace(/<[^>]*>?/gm, "")} {/* Strip HTML tags simply */}
                                        </p>
                                        <span className="text-xs text-muted mt-2 block">
                                            {new Date(article.createdAt).toLocaleDateString("id-ID", { dateStyle: 'long' })}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted italic">Tidak ada artikel yang cocok.</p>
                        )}
                    </section>

                    {products.length === 0 && articles.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">🔍</div>
                            <p className="text-lg">Tidak ditemukan hasil apapun.</p>
                            <p className="text-sm text-muted">Coba kata kunci lain.</p>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}

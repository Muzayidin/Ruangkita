"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Product } from "@/types/products"; // Impor tipe Product

export default function ProductsPage() {
  // Gunakan tipe Product untuk state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false); // Prevent duplicate fetch

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState(""); // State pencarian
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Category dropdown
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false); // Sort dropdown
  const [isScrolled, setIsScrolled] = useState(false); // UI Scroll state

  // Handle scroll for UI (hide filters)
  useEffect(() => {
    const handleScrollUI = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScrollUI, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollUI);
  }, []);

  // Gunakan useEffect untuk reset dan reload saat filter berubah
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Reset page dan products saat filter berubah
    setPage(1);
    setHasMore(true);
    setProducts([]);
    loadProducts(1, true); // true = isReset
  }, [selectedCategory, sortBy]); // Removed searchQuery from dependencies

  const handleSearch = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(1);
    setHasMore(true);
    setProducts([]);
    loadProducts(1, true);
  };

  async function loadProducts(pageToLoad: number, isReset: boolean = false) {
    // Jika sedang fetching dan bukan reset (paginasi), jangan fetch lagi
    // Tapi jika reset, kita harus fetch meskipun sedang loading sebelumnya
    if (isFetching && !isReset) return;

    setIsFetching(true);
    setLoading(true);

    const params = new URLSearchParams();
    params.set("page", pageToLoad.toString());
    params.set("limit", "12");
    if (selectedCategory && selectedCategory !== "Semua") {
      params.set("category", selectedCategory);
    }
    if (searchQuery) {
      params.set("search", searchQuery);
    }
    if (sortBy) {
      params.set("sortBy", sortBy);
    }

    // Mengambil data dari API Route (yang kini membaca dari database)
    const res = await fetch(`/api/products?${params.toString()}`, { cache: "no-store" });

    if (!res.ok) {
      console.error("Gagal mengambil produk dari API:", res.statusText);
      setLoading(false);
      setIsFetching(false);
      return;
    }

    const data: Product[] = await res.json();

    if (data.length < 12) {
      setHasMore(false);
    }

    // Artificial delay for better UX
    if (pageToLoad > 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (pageToLoad === 1) {
      setProducts(data);
    } else {
      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newProducts = data.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newProducts];
      });
    }

    setLoading(false);
    setIsFetching(false);
  }

  // Initial load (only once on mount, subsequent loads handled by useEffect for filters or infinite scroll)
  useEffect(() => {
    // This useEffect is now primarily for initial mount.
    // Filter changes are handled by the other useEffect.
    // We can keep this for clarity or remove if the other useEffect covers initial load sufficiently.
    // For now, let's keep it as it ensures a load even if no filters are set initially.
    if (products.length === 0 && !isFetching) { // Only load if products are empty and not already fetching
      loadProducts(1);
    }
  }, []);


  // Infinite Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 // Load when near bottom
      ) {
        if (hasMore && !isFetching && !loading) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            loadProducts(nextPage);
            return nextPage;
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isFetching, loading]);

  // Ambil unique categories (dari SEMUA yang sudah terload - mungkin perlu refactor untuk ambil dari DB endpoint server separate, tapi untuk MVP ini oke)
  const categories = ["Semua", "Ruang Tamu", "Ruang Makan", "Kamar Tidur", "Ruang Kerja", "Dapur", "Dekorasi", "Teras & Taman", "Ruang Keluarga"];

  const sortOptions = [
    { value: "newest", label: "Terbaru" },
    { value: "best_selling", label: "Terlaris" },
    { value: "price_asc", label: "Termurah" },
    { value: "price_desc", label: "Termahal" },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 min-h-screen">
      <div className="sticky top-12 md:top-16 z-40 bg-background/95 backdrop-blur-sm -mx-4 px-4 pb-2 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-muted/20 pb-1 mb-1 pt-1 md:pb-4 md:mb-6 md:pt-4 gap-1 md:gap-4">
          <div className="hidden md:block">
            <h1 className="text-base md:text-3xl font-bold text-foreground">
              Katalog Produk
            </h1>

          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-56">
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full bg-background border border-muted/20 text-foreground text-xs md:text-sm py-1.5 md:py-2 pl-10 pr-4 rounded-full focus:outline-none focus:ring-1 focus:ring-accent shadow-sm"
                />
                <svg
                  className="absolute left-3 top-2.5 h-4 w-4 text-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                onClick={handleSearch}
                className="bg-accent text-accent-foreground text-xs md:text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm hover:opacity-90 transition-opacity"
              >
                Cari
              </button>
            </div>

            <div className={`flex flex-row gap-3 ${isScrolled ? "max-h-0 opacity-0 overflow-hidden md:max-h-20 md:opacity-100 md:overflow-visible" : "max-h-20 opacity-100"}`}>
              {/* Category Dropdown (All Screens) */}
              <div className="relative z-50 flex-1 md:flex-none">
                <button
                  onClick={() => { setIsDropdownOpen(!isDropdownOpen); setIsSortDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 bg-background border border-muted/20 text-foreground text-xs md:text-sm font-medium py-2 px-4 rounded-full shadow-sm hover:border-accent/50 transition-colors focus:outline-none focus:ring-1 focus:ring-accent min-w-[120px] justify-between"
                >
                  <span className="truncate max-w-[100px]">{selectedCategory || "Kategori"}</span>
                  <svg className={`h-4 w-4 text-muted transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-muted/20 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat === "Semua" ? null : cat);
                            setSearchQuery(""); // Reset search query when category changes
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${(selectedCategory === cat) || (cat === "Semua" && selectedCategory === null)
                            ? "bg-accent/10 text-accent font-medium"
                            : "text-foreground hover:bg-muted/10"
                            }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Dropdown (All Screens) */}
              <div className="relative z-40 flex-1 md:flex-none">
                <button
                  onClick={() => { setIsSortDropdownOpen(!isSortDropdownOpen); setIsDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 bg-background border border-muted/20 text-foreground text-xs md:text-sm font-medium py-2 px-4 rounded-full shadow-sm hover:border-accent/50 transition-colors focus:outline-none focus:ring-1 focus:ring-accent min-w-[120px] justify-between"
                >
                  <span className="truncate max-w-[100px]">{sortOptions.find(o => o.value === sortBy)?.label}</span>
                  <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
                </button>

                {isSortDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-40 bg-background border border-muted/20 rounded-xl shadow-xl overflow-hidden z-50 animate-fade-in">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${sortBy === option.value
                          ? "bg-accent/10 text-accent font-medium"
                          : "text-foreground hover:bg-muted/10"
                          }`}
                      >
                        {option.label}
                        {sortBy === option.value && (
                          <span className="text-accent">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {/* Loading Skeletons */}
        {loading && (
          <>
            {/* Show skeletons if initial load OR appending */}
            {Array.from({ length: products.length === 0 ? 8 : 4 }).map((_, i) => (
              <ProductCardSkeleton key={`skeleton-${i}`} />
            ))}
          </>
        )}
      </div>

      {!hasMore && !loading && products.length > 0 && (
        <div className="text-center py-12 border-t border-muted/20 mt-8">
          <p className="text-muted mb-4">Anda sudah mencapai akhir.</p>
          <p className="text-sm text-muted mb-6">Tidak menemukan produk yang dicari?</p>
          <a
            href="https://wa.me/6281932708104?text=Halo%20Admin,%20saya%20tertarik%20untuk%20custom%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
          >
            <span>Hubungi Admin untuk Custom</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.68-2.031-.967-.272-.297-.471-.446-.099-.124-1.632-6.526 2.511-6.526 2.511s.447.018.669.026c.223.007.546.037.893.421.347.371 1.14 1.115 1.238 1.487.643 2.475-.248 3.515-.347 3.664-.099.148-.223.222-.52.074.075-.149-1.76-8.63 2.651 8.63 2.651 3.664 12.39-4.965 14.53-.025.148-.05.148-3.027 1.611-3.324 1.611-.297-.037-.52-.074-.594-.124-.074-.05-.272-.074-.57-.223z" />
            </svg>
          </a>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📦</div>
          <p className="text-xl text-muted mb-6">Produk tidak tersedia</p>
          <a
            href="https://wa.me/6281932708104?text=Halo%20Admin,%20saya%20tertarik%20untuk%20custom%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <span>Hubungi Admin untuk Custom</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-8.68-2.031-.967-.272-.297-.471-.446-.099-.124-1.632-6.526 2.511-6.526 2.511s.447.018.669.026c.223.007.546.037.893.421.347.371 1.14 1.115 1.238 1.487.643 2.475-.248 3.515-.347 3.664-.099.148-.223.222-.52.074.075-.149-1.76-8.63 2.651 8.63 2.651 3.664 12.39-4.965 14.53-.025.148-.05.148-3.027 1.611-3.324 1.611-.297-.037-.52-.074-.594-.124-.074-.05-.272-.074-.57-.223z" />
            </svg>
          </a>
        </div>
      )}
    </main>
  );
}

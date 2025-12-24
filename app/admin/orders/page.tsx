import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { OrdersTableClient } from "@/components/admin/OrdersTableClient";

// Helper for price formatting if not imported
const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);
};

export const dynamic = "force-dynamic";

// Define searchParams type
interface AdminOrdersPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Helper for status colors
const getStatusColor = (status: string | null | undefined) => {
    if (!status) return 'bg-slate-100 text-slate-400';

    switch (status.toLowerCase()) {
        case 'terkirim':
            return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        case 'proses':
            return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
        case 'tanpa':
        case '-':
            return 'bg-slate-50 text-slate-400 border border-slate-200 dark:bg-slate-900 dark:border-slate-800';
        default:
            return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
    }
};

export default async function AdminOrdersPage(props: AdminOrdersPageProps) {
    const searchParams = await props.searchParams;
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: {
                    product: true
                }
            },
        },
    });

    // Calculate Summaries
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Status counts
    const pendingCount = orders.filter(o => !o.productionStatus || o.productionStatus === 'Pending').length;
    const processCount = orders.filter(o => o.productionStatus === 'Proses').length;
    const shippedCount = orders.filter(o => o.productionStatus === 'Terkirim').length;
    const completedCount = orders.filter(o => o.productionStatus === 'Selesai').length;

    // Helper for "Belum Terkirim" logic (Pending, Proses, etc.)
    const isNotShipped = (status: string | null) => {
        if (!status) return false; // Treat null/empty as "Tanpa" (excluded from "Belum Terkirim")
        const s = status.toLowerCase();
        return !['terkirim', 'selesai', 'tanpa', '-'].includes(s);
    };

    // Component counts (Belum Terkirim)
    const chairProcessCount = orders.filter(o => isNotShipped(o.chairStatus)).length;
    const tableProcessCount = orders.filter(o => isNotShipped(o.tableStatus)).length;
    const baseProcessCount = orders.filter(o => isNotShipped(o.baseStatus)).length;

    // Filter Logic
    const currentStatus = typeof searchParams.status === 'string' ? searchParams.status : undefined;
    const currentFilter = typeof searchParams.filter === 'string' ? searchParams.filter : undefined;
    const searchQuery = typeof searchParams.search === 'string' ? searchParams.search.toLowerCase() : undefined;
    const sortOrder = typeof searchParams.sort === 'string' ? searchParams.sort : 'desc';

    let filteredOrders = orders;

    // Apply search query first
    if (searchQuery) {
        filteredOrders = filteredOrders.filter(o => {
            const customerMatch = o.customerName.toLowerCase().includes(searchQuery);
            const whatsappMatch = o.whatsapp.includes(searchQuery);
            const idMatch = o.id.toLowerCase().includes(searchQuery);
            const productMatch = o.items.some(item => item.product.name.toLowerCase().includes(searchQuery));
            return customerMatch || whatsappMatch || idMatch || productMatch;
        });
    }

    // Then apply status/filter
    if (currentStatus) {
        filteredOrders = filteredOrders.filter(o => {
            if (currentStatus === 'Pending') return !o.productionStatus || o.productionStatus === 'Pending';
            return o.productionStatus === currentStatus;
        });
    } else if (currentFilter) {
        if (currentFilter === 'kursi_terkirim') {
            filteredOrders = filteredOrders.filter(o => o.chairStatus === 'Terkirim');
        } else if (currentFilter === 'meja_terkirim') {
            filteredOrders = filteredOrders.filter(o => o.tableStatus === 'Terkirim');
        } else if (currentFilter === 'dulangan_terkirim') {
            filteredOrders = filteredOrders.filter(o => o.baseStatus === 'Terkirim');
        } else if (currentFilter === 'kursi_belum_terkirim') {
            filteredOrders = filteredOrders.filter(o => isNotShipped(o.chairStatus));
        } else if (currentFilter === 'meja_belum_terkirim') {
            filteredOrders = filteredOrders.filter(o => isNotShipped(o.tableStatus));
        } else if (currentFilter === 'dulangan_belum_terkirim') {
            filteredOrders = filteredOrders.filter(o => isNotShipped(o.baseStatus));
        }
    }

    // Apply sort order
    filteredOrders = [...filteredOrders].sort((a, b) => {
        if (sortOrder === 'asc') {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Pesanan Masuk
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Kelola pesanan dari pelanggan
                </p>
            </div>

            <div className="space-y-4">
                {/* Global Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link href="/admin/orders" className={`block p-6 rounded-xl border shadow-sm transition-all ${!currentStatus && !currentFilter ? 'bg-orange-50 border-orange-200 ring-1 ring-orange-200 dark:bg-orange-900/10 dark:border-orange-900' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-orange-200 dark:hover:border-orange-900'}`}>
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Pesanan</div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">{totalOrders}</div>
                    </Link>
                    <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Pendapatan</div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2">{formatRupiah(totalRevenue)}</div>
                    </div>
                    <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm md:col-span-2">
                        <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Status Pesanan Global</div>
                        <div className="grid grid-cols-2 gap-2 text-center">
                            <Link href="/admin/orders?status=Proses" className={`rounded-lg p-2 transition-all ${currentStatus === 'Proses' ? 'bg-yellow-100 ring-2 ring-yellow-400 dark:bg-yellow-900/40' : 'bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:hover:bg-yellow-900/30'}`}>
                                <div className="text-xs text-yellow-600 uppercase font-bold">Proses</div>
                                <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">{processCount}</div>
                            </Link>
                            <Link href="/admin/orders?status=Terkirim" className={`rounded-lg p-2 transition-all ${currentStatus === 'Terkirim' ? 'bg-orange-100 ring-2 ring-orange-400 dark:bg-orange-900/40' : 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/30'}`}>
                                <div className="text-xs text-orange-600 uppercase font-bold">SELESAI</div>
                                <div className="text-lg font-bold text-orange-700 dark:text-orange-400">{shippedCount}</div>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Component Summary Cards for "Belum Terkirim" */}
                <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Monitoring Produksi (Belum Terkirim)</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link href="/admin/orders?filter=kursi_belum_terkirim" className={`flex items-center justify-between p-4 rounded-lg border transition-all ${currentFilter === 'kursi_belum_terkirim' ? 'bg-yellow-50 border-yellow-200 ring-1 ring-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-yellow-200'}`}>
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase">Kursi Proses</div>
                                <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{chairProcessCount}</div>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xs font-bold">
                                K
                            </div>
                        </Link>
                        <Link href="/admin/orders?filter=meja_belum_terkirim" className={`flex items-center justify-between p-4 rounded-lg border transition-all ${currentFilter === 'meja_belum_terkirim' ? 'bg-yellow-50 border-yellow-200 ring-1 ring-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-yellow-200'}`}>
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase">Meja Proses</div>
                                <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{tableProcessCount}</div>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xs font-bold">
                                M
                            </div>
                        </Link>
                        <Link href="/admin/orders?filter=dulangan_belum_terkirim" className={`flex items-center justify-between p-4 rounded-lg border transition-all ${currentFilter === 'dulangan_belum_terkirim' ? 'bg-yellow-50 border-yellow-200 ring-1 ring-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-yellow-200'}`}>
                            <div>
                                <div className="text-xs text-slate-500 font-bold uppercase">Dulangan Proses</div>
                                <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{baseProcessCount}</div>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xs font-bold">
                                D
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search and Sort Controls */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="flex-1 w-full md:max-w-md">
                    <form action="/admin/orders" method="GET" className="relative">
                        <input
                            type="text"
                            name="search"
                            defaultValue={searchQuery}
                            placeholder="Cari pesanan (nama, WA, produk, ID)..."
                            className="w-full pl-4 pr-10 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        />
                        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <form action="/admin/orders" method="GET" className="flex-1 md:flex-initial">
                        {searchQuery && <input type="hidden" name="search" value={searchQuery} />}
                        {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
                        {currentFilter && <input type="hidden" name="filter" value={currentFilter} />}
                        <select
                            name="sort"
                            defaultValue={sortOrder}
                            className="w-full md:w-auto px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-sm focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="desc">🕐 Terbaru</option>
                            <option value="asc">🕐 Terlama</option>
                        </select>
                    </form>
                    <Link
                        href="/admin/orders/new"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
                    >
                        + Tambah
                    </Link>
                </div>
            </div>

            {/* Search Results Info */}
            {(searchQuery || currentStatus || currentFilter) && (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                    {searchQuery ? (
                        <span>
                            Ditemukan <strong className="text-slate-900 dark:text-slate-100">{filteredOrders.length}</strong> pesanan dari pencarian &quot;<strong>{searchQuery}</strong>&quot;
                        </span>
                    ) : (
                        <span>
                            Menampilkan <strong className="text-slate-900 dark:text-slate-100">{filteredOrders.length}</strong> pesanan
                        </span>
                    )}
                </div>
            )}


            <OrdersTableClient orders={filteredOrders} />
        </div>
    );
}

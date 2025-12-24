
import Link from "next/link";


import { PrismaClient } from "@prisma/client";
import { AdminDashboardCharts } from "@/components/admin/AdminDashboardCharts";

const prisma = new PrismaClient();

// Force dynamic to get fresh counts
export const dynamic = "force-dynamic";



export default async function AdminDashboardPage() {
    // Fetch counts and recent orders with status aggregation
    const [productCount, articleCount, orderCount, recentOrders, statusCounts] = await Promise.all([
        prisma.products.count(),
        prisma.article.count(),
        prisma.order.count(),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.order.groupBy({
            by: ['productionStatus'],
            _count: {
                id: true
            }
        })
    ]);

    // Parse status counts
    const processCount = statusCounts.find(s => s.productionStatus === 'Proses')?._count.id || 0;
    const shippedCount = statusCounts.find(s => s.productionStatus === 'Selesai' || s.productionStatus === 'Terkirim')?._count.id || 0;
    // Note: Normalize 'Terkirim' to 'Selesai' bucket if acceptable, or show separately. 
    // In import script we mapped 'Terkirim' -> 'Selesai'. But let's handle if raw data has 'Terkirim'.
    // Actually our import script mapped 'Terkirim' to 'Selesai'. So lets just check 'Selesai'.
    // However, if there are legacy or raw 'Terkirim', we might miss them.
    // Let's safe check both.

    const finishedCount = statusCounts
        .filter(s => s.productionStatus === 'Selesai' || s.productionStatus === 'Terkirim')
        .reduce((acc, curr) => acc + curr._count.id, 0);


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400">Ringkasan aktivitas website & penjualan</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Pesanan */}
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Pesanan</span>
                            <span className="text-xl">🛍️</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            {orderCount}
                        </div>
                    </div>
                </div>

                {/* Pesanan Proses */}
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Dalam Proses</span>
                            <span className="text-xl">🔨</span>
                        </div>
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                            {processCount}
                        </div>
                    </div>
                </div>

                {/* Pesanan Selesai */}
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Selesai / Terkirim</span>
                            <span className="text-xl">✅</span>
                        </div>
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {finishedCount}
                        </div>
                    </div>
                </div>

                {/* Total Produk */}
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Katalog Produk</span>
                            <span className="text-xl">🪑</span>
                        </div>
                        <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                            {productCount}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts & Recent */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AdminDashboardCharts />
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Pesanan Terbaru</h3>
                        <Link href="/admin/orders" className="text-xs text-orange-600 hover:text-orange-500 font-medium">
                            Lihat Semua
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {recentOrders.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">Belum ada pesanan terbaru.</p>
                        ) : (
                            recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{order.customerName}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500">Rp {order.total.toLocaleString('id-ID')}</span>
                                            <span className="text-[10px] text-slate-400">• {new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${order.productionStatus === 'Selesai' || order.productionStatus === 'Terkirim'
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : order.productionStatus === 'Proses'
                                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {order.productionStatus || 'Pending'}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

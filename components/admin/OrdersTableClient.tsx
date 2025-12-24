"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Order = {
    id: string;
    customerName: string;
    whatsapp: string;
    address: string | null;
    productionStatus: string | null;
    chairStatus: string | null;
    tableStatus: string | null;
    baseStatus: string | null;
    deliveryDate: Date | null;
    notes: string | null;
    total: number;
    createdAt: Date;
    items: {
        product: {
            name: string;
        };
        quantity: number;
    }[];
};

const formatRupiah = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);
};

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

export function OrdersTableClient({ orders }: { orders: Order[] }) {
    const router = useRouter();
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [bulkAction, setBulkAction] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === orders.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(orders.map(o => o.id)));
        }
    };

    const handleBulkAction = async () => {
        if (!bulkAction || selectedIds.size === 0) return;

        const confirmed = confirm(`Yakin ingin ${bulkAction === 'delete' ? 'menghapus' : 'mengubah status'} ${selectedIds.size} pesanan?`);
        if (!confirmed) return;

        setLoading(true);
        try {
            const response = await fetch('/api/orders/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: bulkAction,
                    orderIds: Array.from(selectedIds),
                    ...(bulkAction.startsWith('status_') && { status: bulkAction.replace('status_', '') })
                }),
            });

            if (!response.ok) throw new Error('Bulk action failed');

            setSelectedIds(new Set());
            setBulkAction("");

            router.refresh();
            toast.success('Status berhasil diperbarui!');
        } catch (error) {
            toast.error('Terjadi kesalahan saat mengupdate status');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Bulk Actions Toolbar */}
            {selectedIds.size > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-medium text-orange-900 dark:text-orange-100">
                            {selectedIds.size} pesanan dipilih
                        </span>
                        <select
                            value={bulkAction}
                            onChange={(e) => setBulkAction(e.target.value)}
                            className="px-3 py-1.5 text-sm border border-orange-300 dark:border-orange-700 rounded-lg bg-white dark:bg-slate-900"
                        >
                            <option value="">Pilih Aksi...</option>
                            <option value="status_Proses">Ubah ke Proses</option>
                            <option value="status_Terkirim">Ubah ke Selesai</option>
                            <option value="delete">Hapus</option>
                        </select>
                        <button
                            onClick={handleBulkAction}
                            disabled={!bulkAction || loading}
                            className="px-4 py-1.5 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Memproses...' : 'Jalankan'}
                        </button>
                        <button
                            onClick={() => setSelectedIds(new Set())}
                            className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-4 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.size === orders.length && orders.length > 0}
                                        onChange={toggleSelectAll}
                                        className="rounded border-slate-300"
                                    />
                                </th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">ID / Tanggal</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Pembeli</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Barang</th>
                                <th className="px-4 py-4 font-medium text-center">Status</th>
                                <th className="px-4 py-4 font-medium">Catatan</th>
                                <th className="px-4 py-4 font-medium min-w-[140px]">Sub Produk</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Tgl Kirim</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Total</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-6 py-8 text-center text-slate-500">
                                        Tidak ada pesanan.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                                    >
                                        <td className="px-4 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(order.id)}
                                                onChange={() => toggleSelect(order.id)}
                                                className="rounded border-slate-300"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs text-slate-500">#{order.id.slice(0, 8)}</div>
                                            <div className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString("id-ID")}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 dark:text-slate-100">{order.customerName}</div>
                                            <div className="text-xs text-slate-500">{order.whatsapp}</div>
                                        </td>
                                        <td className="px-6 py-4 max-w-[200px]">
                                            <div className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                                                {order.items.map(i => `${i.product.name} (${i.quantity})`).join(", ")}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(order.productionStatus)}`}>
                                                {order.productionStatus === 'Terkirim' ? 'SELESAI' : (order.productionStatus || 'Pending')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 max-w-[150px]">
                                            <div className="text-xs text-slate-600 dark:text-slate-400 truncate" title={order.notes || ""}>
                                                {order.notes || "-"}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-2">
                                                {(order.chairStatus && order.chairStatus !== 'Tanpa' && order.chairStatus !== '-') && (
                                                    <div className="flex items-center justify-between text-xs gap-2">
                                                        <span className="text-slate-500">Kursi</span>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(order.chairStatus)}`}>
                                                            {order.chairStatus}
                                                        </span>
                                                    </div>
                                                )}
                                                {(order.tableStatus && order.tableStatus !== 'Tanpa' && order.tableStatus !== '-') && (
                                                    <div className="flex items-center justify-between text-xs gap-2">
                                                        <span className="text-slate-500">Meja</span>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(order.tableStatus)}`}>
                                                            {order.tableStatus}
                                                        </span>
                                                    </div>
                                                )}
                                                {(order.baseStatus && order.baseStatus !== 'Tanpa' && order.baseStatus !== '-') && (
                                                    <div className="flex items-center justify-between text-xs gap-2">
                                                        <span className="text-slate-500">Dulangan</span>
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getStatusColor(order.baseStatus)}`}>
                                                            {order.baseStatus}
                                                        </span>
                                                    </div>
                                                )}
                                                {(!order.chairStatus || order.chairStatus === 'Tanpa' || order.chairStatus === '-') &&
                                                    (!order.tableStatus || order.tableStatus === 'Tanpa' || order.tableStatus === '-') &&
                                                    (!order.baseStatus || order.baseStatus === 'Tanpa' || order.baseStatus === '-') && (
                                                        <span className="text-slate-400 text-xs">-</span>
                                                    )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString("id-ID") : "-"}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                                            {formatRupiah(order.total)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/admin/orders/${order.id}`} className="text-orange-600 hover:text-orange-500 font-medium text-xs border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors">
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

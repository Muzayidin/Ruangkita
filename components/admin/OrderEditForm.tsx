"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Define a type for the order prop that matches what's passed from the server
// You might want to generate this from Prisma Client types for strict safety
type Order = any;

export function OrderEditForm({ order }: { order: Order }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        productionStatus: order.productionStatus || "",
        chairStatus: order.chairStatus || "",
        tableStatus: order.tableStatus || "",
        baseStatus: order.baseStatus || "",
        deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : "",
        notes: order.notes || "",
    });

    // Bulk update state
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkUpdateData, setBulkUpdateData] = useState({
        productName: '',
        statusType: 'chairStatus' as 'chairStatus' | 'tableStatus' | 'baseStatus',
        newStatus: 'Proses' as 'Proses' | 'Terkirim' | 'Tanpa',
        quantity: 1
    });
    const [bulkLoading, setBulkLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Update form data
        const updatedData = { ...formData, [name]: value };

        // Auto-calculate production status based on component statuses
        if (name === 'chairStatus' || name === 'tableStatus' || name === 'baseStatus') {
            const chairStatus = name === 'chairStatus' ? value : formData.chairStatus;
            const tableStatus = name === 'tableStatus' ? value : formData.tableStatus;
            const baseStatus = name === 'baseStatus' ? value : formData.baseStatus;

            // Check if all components are completed (Terkirim or empty/Tanpa)
            const allCompleted =
                (chairStatus === 'Terkirim' || chairStatus === '' || chairStatus === 'Tanpa') &&
                (tableStatus === 'Terkirim' || tableStatus === '' || tableStatus === 'Tanpa') &&
                (baseStatus === 'Terkirim' || baseStatus === '' || baseStatus === 'Tanpa');

            // Check if any component is in process
            const anyInProcess =
                chairStatus === 'Proses' ||
                tableStatus === 'Proses' ||
                baseStatus === 'Proses';

            // Set production status accordingly
            if (anyInProcess) {
                updatedData.productionStatus = 'Proses';
            } else if (allCompleted && (chairStatus === 'Terkirim' || tableStatus === 'Terkirim' || baseStatus === 'Terkirim')) {
                updatedData.productionStatus = 'Terkirim';
            }
        }

        setFormData(updatedData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/orders/${order.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Gagal mengupdate pesanan");

            router.refresh();
            toast.success("Pesanan berhasil diperbarui!");
            router.push("/admin/orders");
        } catch (error) {
            toast.error("Terjadi kesalahan saat mengupdate pesanan");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBulkUpdate = async () => {
        if (!bulkUpdateData.productName) {
            toast.error('Pilih produk terlebihdahulu');
            return;
        }

        setBulkLoading(true);
        try {
            const response = await fetch('/api/orders/bulk-update-by-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: order.customerName,
                    productName: bulkUpdateData.productName,
                    statusType: bulkUpdateData.statusType,
                    newStatus: bulkUpdateData.newStatus,
                    quantity: bulkUpdateData.quantity
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Gagal update');
            }

            toast.success(`Berhasil! ${result.count} pesanan telah diupdate`);
            setShowBulkModal(false);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Terjadi kesalahan saat bulk update');
            console.error(error);
        } finally {
            setBulkLoading(false);
        }
    };

    const StatusSelect = ({ label, name, value }: { label: string; name: string; value: string }) => (
        <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
            <select
                name={name}
                value={value}
                onChange={handleChange}
                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5 focus:ring-orange-500 focus:border-orange-500"
            >
                <option value="Tanpa">Tanpa</option>
                <option value="Proses">Proses Pengerjaan (Merah)</option>
                <option value="Terkirim">Terkirim (Hijau)</option>
            </select>
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-8">

            {/* Detail Pesanan (Read Only) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                    <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Pelanggan</label>
                    <div className="font-medium text-lg">{order.customerName}</div>
                    <div className="text-sm text-slate-500">{order.whatsapp}</div>
                    <div className="text-sm text-slate-500 mt-1">{order.address || "Alamat tidak tersedia"}</div>
                </div>
                <div>
                    <label className="text-xs text-slate-500 uppercase font-bold tracking-wider">Produk Dipesan</label>
                    <ul className="mt-1 space-y-1">
                        {order.items.map((item: any) => (
                            <li key={item.id} className="text-sm flex justify-between">
                                <span>{item.product.name}</span>
                                <span className="font-mono text-slate-500">x{item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between font-bold">
                        <span>Total</span>
                        <span>Rp {order.total.toLocaleString("id-ID")}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Components */}
                <div className="space-y-6">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 border-b pb-2">Status Komponen</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <StatusSelect label="Kursi" name="chairStatus" value={formData.chairStatus} />
                        <StatusSelect label="Meja" name="tableStatus" value={formData.tableStatus} />
                        <StatusSelect label="Dulangan" name="baseStatus" value={formData.baseStatus} />
                    </div>

                    {/* Auto-calculated Production Status */}
                    <div className="mt-4 p-3 rounded-lg border-2 border-dashed border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Status Produksi (Otomatis):</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${formData.productionStatus === 'Terkirim'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                {formData.productionStatus === 'Terkirim' ? 'Selesai' : (formData.productionStatus || 'Belum Diset')}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Status akan otomatis menjadi "Selesai" jika semua komponen terkirim
                        </p>
                    </div>
                </div>

                {/* Pengiriman & Catatan */}
                <div className="space-y-6">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 border-b pb-2">Pengiriman & Info</h3>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tanggal Kirim</label>
                        <input
                            type="date"
                            name="deliveryDate"
                            value={formData.deliveryDate}
                            onChange={handleChange}
                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5 focus:ring-orange-500 focus:border-orange-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Catatan Tambahan</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5 focus:ring-orange-500 focus:border-orange-500"
                            placeholder="Contoh: Request warna khusus, kirim pagi hari..."
                        />
                    </div>
                </div>
            </div>

            {/* Bulk Update Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                            Update Status Produk Sama
                        </h3>

                        <div className="space-y-4">
                            {/* Product Selection */}
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                                    Pilih Produk
                                </label>
                                <select
                                    value={bulkUpdateData.productName}
                                    onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, productName: e.target.value })}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5"
                                >
                                    <option value="">-- Pilih Produk --</option>
                                    {order.items.map((item: any, idx: number) => (
                                        <option key={idx} value={item.product.name}>
                                            {item.product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status Type */}
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                                    Jenis Status
                                </label>
                                <select
                                    value={bulkUpdateData.statusType}
                                    onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, statusType: e.target.value as any })}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5"
                                >
                                    <option value="chairStatus">Kursi</option>
                                    <option value="tableStatus">Meja</option>
                                    <option value="baseStatus">Dulangan</option>
                                </select>
                            </div>

                            {/* New Status */}
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                                    Status Baru
                                </label>
                                <select
                                    value={bulkUpdateData.newStatus}
                                    onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, newStatus: e.target.value as any })}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5"
                                >
                                    <option value="Tanpa">Tanpa</option>
                                    <option value="Proses">Proses</option>
                                    <option value="Terkirim">Terkirim</option>
                                </select>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">
                                    Jumlah Pesanan
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={bulkUpdateData.quantity}
                                    onChange={(e) => setBulkUpdateData({ ...bulkUpdateData, quantity: parseInt(e.target.value) || 1 })}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5"
                                    placeholder="Berapa pesanan yang diupdate?"
                                />
                            </div>

                            {/* Info */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                    Akan mengupdate status untuk {bulkUpdateData.quantity} pesanan dengan nama: <strong>{order.customerName}</strong> dan produk: <strong>{bulkUpdateData.productName || '(belum dipilih)'}</strong>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                type="button"
                                onClick={() => setShowBulkModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleBulkUpdate}
                                disabled={bulkLoading || !bulkUpdateData.productName}
                                className="flex-1 px-4 py-2.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {bulkLoading ? 'Memproses...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                    type="button"
                    onClick={() => setShowBulkModal(true)}
                    className="px-4 py-2.5 rounded-lg border-2 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 font-medium transition-colors"
                >
                    🔄 Update Produk Sama
                </button>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 font-medium transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </div>
        </form>
    );
}

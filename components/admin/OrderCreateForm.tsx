"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Trash, X, Copy } from "lucide-react";

type Product = {
    id: string;
    name: string;
    price: number;
};

type OrderData = {
    customerName: string;
    whatsapp: string;
    address: string;
    productionStatus: string;
    chairStatus: string;
    tableStatus: string;
    baseStatus: string;
    deliveryDate: string;
    notes: string;
    items: { productId: string; quantity: number; price: number; isCustom?: boolean; customName?: string }[];
};

export function OrderCreateForm({ products }: { products: Product[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const createEmptyOrder = (): OrderData => ({
        customerName: "",
        whatsapp: "",
        address: "",
        productionStatus: "Proses",
        chairStatus: "Tanpa",
        tableStatus: "Tanpa",
        baseStatus: "Tanpa",
        deliveryDate: "",
        notes: "",
        items: [{ productId: "", quantity: 1, price: 0, isCustom: false, customName: "" }],
    });

    const [orders, setOrders] = useState<OrderData[]>([createEmptyOrder()]);
    const [duplicateCount, setDuplicateCount] = useState<number>(1);
    const [productSearch, setProductSearch] = useState<{ [key: string]: string }>({});
    const [showDropdown, setShowDropdown] = useState<{ [key: string]: boolean }>({});

    const addNewOrder = () => {
        setOrders([...orders, createEmptyOrder()]);
    };

    const removeOrder = (orderIndex: number) => {
        if (orders.length > 1) {
            setOrders(orders.filter((_, i) => i !== orderIndex));
        }
    };

    const duplicateOrder = (orderIndex: number, count: number = 1) => {
        const orderToDuplicate = { ...orders[orderIndex] };
        const newDuplicates = Array(count).fill(null).map(() => ({ ...orderToDuplicate }));
        setOrders([...orders, ...newDuplicates]);
    };

    const updateOrder = (orderIndex: number, field: keyof Omit<OrderData, 'items'>, value: string) => {
        const newOrders = [...orders];
        (newOrders[orderIndex] as any)[field] = value;
        setOrders(newOrders);
    };

    const handleItemChange = (orderIndex: number, itemIndex: number, field: string, value: any) => {
        const newOrders = [...orders];
        if (field === "productId") {
            const product = products.find((p) => p.id === value);
            newOrders[orderIndex].items[itemIndex].productId = value;
            newOrders[orderIndex].items[itemIndex].price = product ? product.price : 0;
            newOrders[orderIndex].items[itemIndex].isCustom = false;
        } else {
            (newOrders[orderIndex].items[itemIndex] as any)[field] = value;
        }
        setOrders(newOrders);
    };

    const addItem = (orderIndex: number) => {
        const newOrders = [...orders];
        newOrders[orderIndex].items.push({ productId: "", quantity: 1, price: 0, isCustom: false, customName: "" });
        setOrders(newOrders);
    };

    const toggleCustomProduct = (orderIndex: number, itemIndex: number) => {
        const newOrders = [...orders];
        const item = newOrders[orderIndex].items[itemIndex];
        item.isCustom = !item.isCustom;
        if (item.isCustom) {
            item.productId = "";
            item.customName = "";
            item.price = 0;
        }
        setOrders(newOrders);
    };

    const getFilteredProducts = (orderIndex: number, itemIndex: number) => {
        const searchKey = `${orderIndex} -${itemIndex} `;
        const search = productSearch[searchKey]?.toLowerCase() || "";
        if (!search) return products;
        return products.filter(p => p.name.toLowerCase().includes(search));
    };

    const selectProduct = (orderIndex: number, itemIndex: number, product: Product) => {
        handleItemChange(orderIndex, itemIndex, "productId", product.id);
        const searchKey = `${orderIndex} -${itemIndex} `;
        setProductSearch({ ...productSearch, [searchKey]: product.name });
        setShowDropdown({ ...showDropdown, [searchKey]: false });
    };

    const removeItem = (orderIndex: number, itemIndex: number) => {
        const newOrders = [...orders];
        if (newOrders[orderIndex].items.length > 1) {
            newOrders[orderIndex].items = newOrders[orderIndex].items.filter((_, i) => i !== itemIndex);
            setOrders(newOrders);
        }
    };

    const calculateTotal = (order: OrderData) => {
        return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            if (!order.customerName.trim()) {
                toast.error(`Pesanan #${i + 1}: Nama pelanggan wajib diisi`);
                return;
            }
            if (order.items.some((item: any) => !item.productId && !item.isCustom)) {
                toast.error(`Pesanan #${i + 1}: Pilih produk untuk semua item atau aktifkan mode kustom`);
                return;
            }
            if (order.items.some((item: any) => item.isCustom && (!item.customName || !item.price))) {
                toast.error(`Pesanan #${i + 1}: Nama dan harga produk kustom wajib diisi`);
                return;
            }
        }

        setLoading(true);

        try {
            const ordersToSubmit = orders.map(order => ({
                ...order,
                total: calculateTotal(order),
            }));

            const response = await fetch("/api/orders/create-multiple", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orders: ordersToSubmit }),
            });

            if (!response.ok) throw new Error("Gagal membuat pesanan");

            const result = await response.json();
            router.refresh();
            toast.success(`Berhasil! ${result.count} pesanan telah dibuat.`);
            router.push("/admin/orders");
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan saat menyimpan pesanan");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header dengan total orders */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {orders.length} Pesanan
                    </h2>
                    <p className="text-sm text-slate-500">Semua pesanan akan disimpan sebagai order terpisah</p>
                </div>
                <button
                    type="button"
                    onClick={addNewOrder}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Pesanan
                </button>
            </div>

            {/* Render each order */}
            {orders.map((order, orderIndex) => (
                <div key={orderIndex} className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-950 relative">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            Pesanan #{orderIndex + 1}
                        </h3>
                        <div className="flex gap-2 items-center">
                            <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                                <input
                                    type="number"
                                    min="1"
                                    max="200"
                                    value={duplicateCount}
                                    onChange={(e) => setDuplicateCount(parseInt(e.target.value) || 0)}
                                    onFocus={(e) => e.target.select()}
                                    onBlur={(e) => {
                                        const val = parseInt(e.target.value);
                                        if (!val || val < 1) setDuplicateCount(1);
                                    }}
                                    className="w-16 text-center text-xs border-0 bg-transparent focus:ring-0 p-1"
                                    title="Jumlah duplikat"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const count = duplicateCount > 0 ? duplicateCount : 1;
                                        duplicateOrder(orderIndex, count);
                                    }}
                                    className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors"
                                    title={`Duplikat ${duplicateCount > 0 ? duplicateCount : 1} x`}
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                            {orders.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeOrder(orderIndex)}
                                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Hapus pesanan ini"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Nama Pelanggan *</label>
                                <input
                                    required
                                    value={order.customerName}
                                    onChange={(e) => updateOrder(orderIndex, 'customerName', e.target.value)}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">WhatsApp</label>
                                <input
                                    value={order.whatsapp}
                                    onChange={(e) => updateOrder(orderIndex, 'whatsapp', e.target.value)}
                                    placeholder="0812..."
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5"
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-1">
                                <label className="text-sm font-medium">Alamat</label>
                                <textarea
                                    value={order.address}
                                    onChange={(e) => updateOrder(orderIndex, 'address', e.target.value)}
                                    rows={2}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5"
                                />
                            </div>
                        </div>

                        {/* Items */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium">Item Pesanan</label>
                                <button
                                    type="button"
                                    onClick={() => addItem(orderIndex)}
                                    className="text-xs flex items-center gap-1 text-orange-600 font-medium"
                                >
                                    <Plus className="w-4 h-4" /> Tambah Item
                                </button>
                            </div>
                            {order.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="space-y-2 p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/50 dark:bg-slate-800/30">
                                    <div className="flex gap-3 items-center">
                                        <button
                                            type="button"
                                            onClick={() => toggleCustomProduct(orderIndex, itemIndex)}
                                            className={`text - xs px - 2 py - 1 rounded font - medium transition - colors ${item.isCustom
                                                ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                                : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                                } `}
                                            title="Toggle produk kustom"
                                        >
                                            {item.isCustom ? '✓ Kustom' : 'Kustom?'}
                                        </button>
                                        {order.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(orderIndex, itemIndex)}
                                                className="ml-auto p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {item.isCustom ? (
                                        <div className="flex gap-3">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Nama produk..."
                                                    value={item.customName || ""}
                                                    onChange={(e) => handleItemChange(orderIndex, itemIndex, "customName", e.target.value)}
                                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5"
                                                />
                                            </div>
                                            <div className="w-32">
                                                <input
                                                    type="number"
                                                    placeholder="Harga"
                                                    value={item.price || ""}
                                                    onChange={(e) => handleItemChange(orderIndex, itemIndex, "price", parseInt(e.target.value) || 0)}
                                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5"
                                                />
                                            </div>
                                            <div className="w-20">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(orderIndex, itemIndex, "quantity", parseInt(e.target.value))}
                                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5 text-center"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="🔍 Ketik nama produk..."
                                                    value={productSearch[`${orderIndex} -${itemIndex} `] || ""}
                                                    onChange={(e) => {
                                                        const key = `${orderIndex} -${itemIndex} `;
                                                        setProductSearch({ ...productSearch, [key]: e.target.value });
                                                        setShowDropdown({ ...showDropdown, [key]: true });
                                                    }}
                                                    onFocus={() => {
                                                        const key = `${orderIndex} -${itemIndex} `;
                                                        setShowDropdown({ ...showDropdown, [key]: true });
                                                    }}
                                                    onBlur={() => {
                                                        const key = `${orderIndex} -${itemIndex} `;
                                                        setTimeout(() => setShowDropdown({ ...showDropdown, [key]: false }), 200);
                                                    }}
                                                    className="w-full rounded-lg border-2 border-orange-200 dark:border-orange-800 bg-white dark:bg-slate-800 text-sm p-2.5 pr-8 focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
                                                />
                                                {productSearch[`${orderIndex} -${itemIndex} `] && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const key = `${orderIndex} -${itemIndex} `;
                                                            setProductSearch({ ...productSearch, [key]: "" });
                                                            handleItemChange(orderIndex, itemIndex, "productId", "");
                                                        }}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}

                                                {/* Autocomplete Dropdown */}
                                                {showDropdown[`${orderIndex} -${itemIndex} `] && getFilteredProducts(orderIndex, itemIndex).length > 0 && (
                                                    <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                        {getFilteredProducts(orderIndex, itemIndex).map((p) => (
                                                            <button
                                                                key={p.id}
                                                                type="button"
                                                                onClick={() => selectProduct(orderIndex, itemIndex, p)}
                                                                className="w-full text-left px-4 py-2.5 hover:bg-orange-50 dark:hover:bg-orange-900/20 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors"
                                                            >
                                                                <div className="font-medium text-sm">{p.name}</div>
                                                                <div className="text-xs text-slate-500 dark:text-slate-400">Rp {p.price.toLocaleString("id-ID")}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Selected Product Info */}
                                            {item.productId && (
                                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-2">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="font-medium text-orange-900 dark:text-orange-100">
                                                            {products.find(p => p.id === item.productId)?.name}
                                                        </span>
                                                        <span className="text-orange-700 dark:text-orange-300 font-semibold">
                                                            Rp {item.price.toLocaleString("id-ID")}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex gap-3">
                                                <div className="w-20">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleItemChange(orderIndex, itemIndex, "quantity", parseInt(e.target.value))}
                                                        className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5 text-center"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="text-right font-bold text-lg pt-2">
                                Total: Rp {calculateTotal(order).toLocaleString("id-ID")}
                            </div>
                        </div>

                        {/* Status & Delivery */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Tanggal Kirim</label>
                                <input
                                    type="date"
                                    value={order.deliveryDate}
                                    onChange={(e) => updateOrder(orderIndex, 'deliveryDate', e.target.value)}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Status Pesanan</label>
                                <select
                                    value={order.productionStatus}
                                    onChange={(e) => updateOrder(orderIndex, 'productionStatus', e.target.value)}
                                    className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5"
                                >
                                    <option value="Proses">Proses</option>
                                    <option value="Terkirim">Terkirim</option>
                                </select>
                            </div>
                        </div>

                        {/* Sub Products */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium">Detail Sub Produk (Opsional)</label>
                            <div className="flex gap-3">
                                {order.chairStatus === 'Tanpa' && (
                                    <button
                                        type="button"
                                        onClick={() => updateOrder(orderIndex, 'chairStatus', 'Proses')}
                                        className="text-xs px-3 py-1.5 rounded-full border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors"
                                    >
                                        + Kursi
                                    </button>
                                )}
                                {order.tableStatus === 'Tanpa' && (
                                    <button
                                        type="button"
                                        onClick={() => updateOrder(orderIndex, 'tableStatus', 'Proses')}
                                        className="text-xs px-3 py-1.5 rounded-full border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors"
                                    >
                                        + Meja
                                    </button>
                                )}
                                {order.baseStatus === 'Tanpa' && (
                                    <button
                                        type="button"
                                        onClick={() => updateOrder(orderIndex, 'baseStatus', 'Proses')}
                                        className="text-xs px-3 py-1.5 rounded-full border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors"
                                    >
                                        + Dulangan
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {order.chairStatus !== 'Tanpa' && (
                                    <div className="space-y-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 relative group">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Kursi</label>
                                            <button
                                                type="button"
                                                onClick={() => updateOrder(orderIndex, 'chairStatus', 'Tanpa')}
                                                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <select
                                            value={order.chairStatus}
                                            onChange={(e) => updateOrder(orderIndex, 'chairStatus', e.target.value)}
                                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5"
                                        >
                                            <option value="Proses">Proses</option>
                                            <option value="Terkirim">Terkirim</option>
                                        </select>
                                    </div>
                                )}
                                {order.tableStatus !== 'Tanpa' && (
                                    <div className="space-y-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 relative group">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Meja</label>
                                            <button
                                                type="button"
                                                onClick={() => updateOrder(orderIndex, 'tableStatus', 'Tanpa')}
                                                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <select
                                            value={order.tableStatus}
                                            onChange={(e) => updateOrder(orderIndex, 'tableStatus', e.target.value)}
                                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5"
                                        >
                                            <option value="Proses">Proses</option>
                                            <option value="Terkirim">Terkirim</option>
                                        </select>
                                    </div>
                                )}
                                {order.baseStatus !== 'Tanpa' && (
                                    <div className="space-y-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800 relative group">
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Dulangan</label>
                                            <button
                                                type="button"
                                                onClick={() => updateOrder(orderIndex, 'baseStatus', 'Tanpa')}
                                                className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <select
                                            value={order.baseStatus}
                                            onChange={(e) => updateOrder(orderIndex, 'baseStatus', e.target.value)}
                                            className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5"
                                        >
                                            <option value="Proses">Proses</option>
                                            <option value="Terkirim">Terkirim</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Catatan / Keterangan</label>
                            <textarea
                                value={order.notes}
                                onChange={(e) => updateOrder(orderIndex, 'notes', e.target.value)}
                                className="w-full rounded-lg border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm p-2.5"
                            />
                        </div>
                    </div>
                </div>
            ))}

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-gradient-to-t from-white dark:from-slate-950 pb-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 font-medium transition-colors disabled:opacity-50"
                >
                    {loading ? "Menyimpan..." : `Buat ${orders.length} Pesanan`}
                </button>
            </div>
        </form>
    );
}

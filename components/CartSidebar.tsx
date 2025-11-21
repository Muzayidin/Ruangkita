"use client";

import { useCart } from "./CartProvider";

export function CartSidebar() {
  const { items, removeItem, total, open, setOpen } = useCart();

  const waNumber = "6281234567890"; // ganti dengan nomor WhatsApp kamu

  const messageLines = items.map(
    (item, index) =>
      `${index + 1}. ${item.product.name} x${item.qty} - Rp ${(
        item.product.price * item.qty
      ).toLocaleString("id-ID")}`
  );

  const waMessage =
    `Halo, saya ingin memesan furniture berikut:

` +
    (messageLines.length ? messageLines.join("\n") : "(belum ada item)") +
    `

Total: Rp ${total.toLocaleString("id-ID")}

Nama:
Alamat lengkap:
Catatan tambahan:`;

  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    waMessage
  )}`;

  return (
    <aside
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl p-4 flex flex-col transform transition-transform duration-300 z-[999] ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Keranjang Belanja</h3>
        <button onClick={() => setOpen(false)} className="text-2xl">
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {items.length === 0 && (
          <p className="text-gray-500 text-sm">
            Keranjang masih kosong. Tambahkan produk dari katalog.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.product.id}
            className="border-b pb-2 flex justify-between items-start gap-2"
          >
            <div>
              <p className="text-sm font-medium">{item.product.name}</p>
              <p className="text-xs text-gray-500">
                x{item.qty} · Rp{" "}
                {(item.product.price * item.qty).toLocaleString("id-ID")}
              </p>
            </div>
            <button
              className="text-xs text-red-500"
              onClick={() => removeItem(item.product.id)}
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
      <div className="border-t pt-3 mt-3 space-y-2">
        <div className="flex justify-between text-sm font-semibold">
          <span>Total</span>
          <span>Rp {total.toLocaleString("id-ID")}</span>
        </div>
        <a
          href={waLink}
          target="_blank"
          className={`block text-center text-sm py-2 rounded ${
            items.length === 0
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          aria-disabled={items.length === 0}
        >
          Checkout via WhatsApp
        </a>
      </div>
    </aside>
  );
}

"use client";

import { useCart } from "./CartProvider";

export function CartSidebar() {
  const { items, addToCart, decrementItem, removeItem, total, open, setOpen } =
    useCart();

  const waNumber = "6289512345678"; // Ganti dengan nomor Admin

  const messageLines = items.map(
    (item, index) =>
      `${index + 1}. ${item.product.name} (x${item.qty}) - Rp ${(
        item.product.price * item.qty
      ).toLocaleString("id-ID")}`
  );

  const waMessage =
    `Halo, saya ingin memesan furniture berikut:\n\n` +
    (messageLines.length ? messageLines.join("\n") : "(belum ada item)") +
    `\n\nTotal: Rp ${total.toLocaleString(
      "id-ID"
    )}\n\nNama:\nAlamat Pengiriman:\nCatatan:`;

  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    waMessage
  )}`;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 right-0 z-[100] w-full max-w-sm bg-background/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-500 ease-in-out border-l border-white/20 ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full bg-background/50">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-muted/20">
            <div>
              <h3 className="text-xl font-bold font-serif text-foreground">
                Keranjang
              </h3>
              <p className="text-xs text-muted font-medium tracking-wide uppercase mt-1">
                {items.length} Item Dipilih
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-muted/10 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                <span className="text-6xl">🛍️</span>
                <p className="text-muted font-medium">
                  Keranjang masih kosong.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="px-6 py-2 bg-muted/20 rounded-full text-sm font-bold hover:bg-muted/30 transition"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 items-start animate-fade-in"
                >
                  {/* Image Thumbnail */}
                  <div className="w-20 h-20 bg-muted/20 rounded-xl overflow-hidden relative flex-shrink-0 border border-muted/20">
                    {/* Note: We use img tag here for simplicity if Next Image is complex in context, but better to use Next Image if possible. 
                        Since cart items might not have loaded image props perfectly, we fallback. */}
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">No Img</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground leading-tight mb-1 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-muted mb-3">
                      {item.product.category}
                    </p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3 bg-card rounded-full px-2 py-1 shadow-sm border border-muted/20">
                        <button
                          onClick={() => decrementItem(item.product.id)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted/10 text-muted transition"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-4 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => addToCart(item.product)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-muted/10 text-muted transition"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-foreground">
                          Rp {(item.product.price * item.qty).toLocaleString("id-ID")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-card/50 backdrop-blur-md border-t border-muted/20 space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-muted uppercase tracking-wider">
                Total Estimasi
              </span>
              <span className="text-2xl font-black text-foreground">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>

            <p className="text-xs text-muted text-center">
              *Harga belum termasuk ongkir. Checkout via WhatsApp untuk konfirmasi.
            </p>

            <a
              href={waLink}
              target="_blank"
              onClick={() => items.length === 0 && setOpen(false)} // Prevent click if empty, just close
              className={`block w-full py-4 rounded-xl font-bold text-center text-lg shadow-xl transition-all transform hover:-translate-y-1 ${items.length === 0
                ? "bg-muted text-muted-foreground cursor-not-allowed pointer-events-none"
                : "bg-green-600 hover:bg-green-500 text-white shadow-green-600/20"
                }`}
            >
              Checkout WhatsApp
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}

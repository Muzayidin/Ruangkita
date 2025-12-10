"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Product } from "@/types/products";

export type CartItem = {
  product: Product;
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeItem: (productId: string) => void;
  decrementItem: (productId: string) => void;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = "ruangkita-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch (error) {
      console.error("Gagal memuat keranjang", error);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Gagal menyimpan keranjang", error);
    }
  }, [items]);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.product.id === product.id);
      if (existing) {
        return prev.map((it) =>
          it.product.id === product.id ? { ...it, qty: it.qty + 1 } : it
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    setOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((it) => it.product.id !== productId));
  };

  const decrementItem = (productId: string) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.product.id === productId);
      if (existing) {
        if (existing.qty === 1) {
          return prev.filter((it) => it.product.id !== productId);
        }
        return prev.map((it) =>
          it.product.id === productId ? { ...it, qty: it.qty - 1 } : it
        );
      }
      return prev;
    });
  };

  const total = items.reduce((acc, it) => acc + it.product.price * it.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeItem: removeFromCart,
        decrementItem,
        total,
        open,
        setOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart harus digunakan di dalam CartProvider");
  }
  return ctx;
}

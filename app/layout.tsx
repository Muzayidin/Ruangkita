import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "@/components/cart/CartProvider";
import { Navbar } from "@/components/layout/Navbar";
import { CartSidebar } from "@/components/cart/CartSidebar";
import { FooterWrapper } from "@/components/layout/FooterWrapper";

export const metadata: Metadata = {
  title: "RuangKita - Toko Furniture Modern",
  description: "Toko furniture minimalis untuk rumah dan bisnis Anda.",
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased transition-colors duration-300">
        <ThemeProvider>
          <CartProvider>
            <Navbar />
            {children}
            <FooterWrapper />
            <CartSidebar />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

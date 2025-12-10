import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "@/components/CartProvider";
import { Navbar } from "@/components/Navbar";
import { CartSidebar } from "@/components/CartSidebar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "RuangKita - Toko Furniture Modern",
  description: "Toko furniture minimalis untuk rumah dan bisnis Anda.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-100 text-gray-800">
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <CartSidebar />
        </CartProvider>
      </body>
    </html>
  );
}

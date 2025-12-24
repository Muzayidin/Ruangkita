"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function FooterWrapper() {
    const pathname = usePathname();

    // Hide footer on products page or admin pages
    if (pathname === "/products" || pathname?.startsWith("/admin")) {
        return null;
    }

    return <Footer />;
}

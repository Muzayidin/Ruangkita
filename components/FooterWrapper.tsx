"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function FooterWrapper() {
    const pathname = usePathname();

    // Hide footer on products page
    if (pathname === "/products") {
        return null;
    }

    return <Footer />;
}

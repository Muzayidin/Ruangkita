
"use client";

import { adminTheme, adminPalette } from "./adminTheme";
import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Default to light to avoid flash if possible, or stick to mounted check
    const currentPalette = mounted && theme === 'dark' ? adminPalette.dark : adminPalette.light;

    const cssVars = {
        "--adm-bg": currentPalette.bg,
        "--adm-bg-soft": currentPalette.bgSoft,
        "--adm-surface": currentPalette.surface,
        "--adm-surface-highlight": currentPalette.surfaceHighlight,
        "--adm-border": currentPalette.border,
        "--adm-border-soft": currentPalette.borderSoft,
        "--adm-text": currentPalette.text,
        "--adm-text-soft": currentPalette.textSoft,
        "--adm-text-muted": currentPalette.textMuted,
        "--adm-primary": currentPalette.primary,
        "--adm-primary-hover": currentPalette.primaryHover,
        "--adm-danger": currentPalette.danger,
        "--adm-danger-hover": currentPalette.dangerHover,
        "--adm-warning": currentPalette.warning,
        "--adm-shadow-soft": currentPalette.shadowSoft,
        "--adm-shadow-card": currentPalette.shadowCard,
    } as React.CSSProperties;

    // We can't return null during server render if we want SEO, but layout wraps pages.
    // If we return null, everything blinks.
    // Better to return children with default vars (light) to match server html.

    return (
        <div
            style={{
                ...cssVars,
                color: adminTheme.text,
                background: adminTheme.bg,
                textAlign: "left",
                minHeight: "100vh",
                transition: "background 0.3s ease, color 0.3s ease"
            }}
        >
            {children}
        </div>
    );
}

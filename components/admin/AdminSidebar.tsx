"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    FileText,
    Settings,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
        title: "Produk",
        href: "/admin/products",
        icon: <Package className="h-5 w-5" />,
    },
    {
        title: "Artikel",
        href: "/admin/articles",
        icon: <FileText className="h-5 w-5" />,
    },
    {
        title: "Pemesanan",
        href: "/admin/orders",
        icon: <Package className="h-5 w-5" />,
    },
    {
        title: "Pengaturan",
        href: "/admin/settings",
        icon: <Settings className="h-5 w-5" />,
    },
];

export function AdminSidebar({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    const pathname = usePathname();

    return (
        <>
            <motion.aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-screen bg-slate-950 text-slate-100 border-r border-slate-800 transition-all duration-300 ease-in-out hidden md:flex flex-col"
                )}
                initial={false}
                animate={{ width: open ? 240 : 80 }}
            >
                <div className="flex items-center h-16 px-4 border-b border-slate-800/50">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                            R
                        </div>
                        {open && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                RuangAdmin
                            </motion.span>
                        )}
                    </div>
                </div>

                <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group",
                                    isActive
                                        ? "bg-orange-600/10 text-orange-500"
                                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                                )}
                            >
                                {item.icon}
                                {open && (
                                    <span className="font-medium text-sm whitespace-nowrap">
                                        {item.title}
                                    </span>
                                )}
                                {!open && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-slate-800">
                                        {item.title}
                                    </div>
                                )}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 w-1 h-1/2 bg-orange-500 rounded-r-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-slate-800/50">
                    <button className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors">
                        <LogOut className="h-5 w-5" />
                        {open && <span className="font-medium text-sm">Keluar</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                className="fixed top-0 left-0 z-50 h-screen w-64 bg-slate-950 text-slate-100 md:hidden border-r border-slate-800"
                initial={{ x: "-100%" }}
                animate={{ x: open ? 0 : "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
                <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
                    <span className="font-bold text-xl">Menu</span>
                    <button onClick={() => setOpen(false)}>
                        <X className="h-6 w-6 text-slate-400" />
                    </button>
                </div>
                <div className="p-4 space-y-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                                pathname.startsWith(item.href)
                                    ? "bg-orange-600/10 text-orange-500"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                            )}
                        >
                            {item.icon}
                            <span className="font-medium">{item.title}</span>
                        </Link>
                    ))}
                </div>
            </motion.aside>
        </>
    );
}

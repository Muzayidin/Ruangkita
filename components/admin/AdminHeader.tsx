"use client";
import React from "react";
import { Menu, Bell, Search, User } from "lucide-react";
import { clsx } from "clsx";

export function AdminHeader({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    return (
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setOpen(!open)}
                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Global Search (Optional) */}
                <div className="hidden md:flex items-center relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari sesuatu..."
                        className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border-none rounded-full text-sm focus:ring-2 focus:ring-orange-500 w-64 transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
                </button>

                <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4 md:pl-6">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Admin User</div>
                        <div className="text-xs text-slate-500">Super Admin</div>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center text-white shadow-lg">
                        <User className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </header>
    );
}

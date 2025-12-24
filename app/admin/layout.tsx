"use client";
import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { cn } from "@/lib/utils";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
            <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            <div
                className={cn(
                    "transition-all duration-300 ease-in-out flex flex-col min-h-screen",
                    sidebarOpen ? "md:ml-60" : "md:ml-20"
                )}
            >
                <AdminHeader open={sidebarOpen} setOpen={setSidebarOpen} />

                <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    );
}

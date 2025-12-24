import { prisma } from "@/lib/prisma";
import { OrderCreateForm } from "@/components/admin/OrderCreateForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewOrderPage() {
    const products = await prisma.products.findMany({
        orderBy: { name: "asc" },
    });

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/orders" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Buat Pesanan Baru
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        Input data pesanan manual
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
                <OrderCreateForm products={products} />
            </div>
        </div>
    );
}

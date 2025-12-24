import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { OrderEditForm } from "@/components/admin/OrderEditForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrderDetailPage(props: OrderDetailPageProps) {
    const params = await props.params;
    const {
        id
    } = params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    if (!order) {
        notFound();
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/admin/orders" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                        Edit Progres Pesanan
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        #{order.id} - {order.customerName}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6">
                <OrderEditForm order={order} />
            </div>
        </div>
    );
}

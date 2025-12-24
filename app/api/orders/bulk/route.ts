import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { action, orderIds, status } = await request.json();

        if (!action || !orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
            return NextResponse.json(
                { error: "Invalid parameters" },
                { status: 400 }
            );
        }

        if (action === 'delete') {
            // Delete order items first
            await prisma.orderItem.deleteMany({
                where: { orderId: { in: orderIds } }
            });

            // Then delete orders
            const deleteResult = await prisma.order.deleteMany({
                where: { id: { in: orderIds } }
            });

            return NextResponse.json({
                success: true,
                deleted: deleteResult.count
            });
        } else if (action.startsWith('status_')) {
            if (!status) {
                return NextResponse.json(
                    { error: "Status required" },
                    { status: 400 }
                );
            }

            // Update production status for all selected orders
            const updateResult = await prisma.order.updateMany({
                where: { id: { in: orderIds } },
                data: { productionStatus: status }
            });

            return NextResponse.json({
                success: true,
                updated: updateResult.count
            });
        } else {
            return NextResponse.json(
                { error: "Unknown action" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Bulk operation error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

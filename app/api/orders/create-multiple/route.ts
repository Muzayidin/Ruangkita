import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { orders } = await request.json();

        if (!orders || !Array.isArray(orders) || orders.length === 0) {
            return NextResponse.json(
                { error: "Invalid request: orders array required" },
                { status: 400 }
            );
        }

        // Validate all orders before creating
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            if (!order.customerName) {
                return NextResponse.json(
                    { error: `Order ${i + 1}: Customer name is required` },
                    { status: 400 }
                );
            }
            if (!order.items || order.items.length === 0) {
                return NextResponse.json(
                    { error: `Order ${i + 1}: At least one item is required` },
                    { status: 400 }
                );
            }
        }

        // Create all orders in a transaction
        const createdOrders = await prisma.$transaction(
            orders.map((orderData: any) => {
                // Set default values for component statuses if not provided
                const chairStatus = orderData.chairStatus || 'Tanpa';
                const tableStatus = orderData.tableStatus || 'Tanpa';
                const baseStatus = orderData.baseStatus || 'Tanpa';

                // Auto-calculate production status
                const anyInProcess =
                    chairStatus === 'Proses' ||
                    tableStatus === 'Proses' ||
                    baseStatus === 'Proses';

                const productionStatus = anyInProcess ? 'Proses' : 'Terkirim';

                return prisma.order.create({
                    data: {
                        ...orderData,
                        chairStatus,
                        tableStatus,
                        baseStatus,
                        productionStatus,
                        deliveryDate: orderData.deliveryDate ? new Date(orderData.deliveryDate) : null,
                        items: {
                            create: orderData.items.map((item: any) => {
                                // For custom products, don't connect to product table
                                if (item.isCustom || !item.productId) {
                                    return {
                                        quantity: item.quantity,
                                        price: item.price
                                    };
                                }
                                // For normal products, connect to product table
                                return {
                                    productId: item.productId,
                                    quantity: item.quantity,
                                    price: item.price
                                };
                            })
                        }
                    },
                    include: {
                        items: true
                    }
                });
            })
        );

        return NextResponse.json({
            success: true,
            count: createdOrders.length,
            orders: createdOrders
        });
    } catch (error) {
        console.error("Error creating multiple orders:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

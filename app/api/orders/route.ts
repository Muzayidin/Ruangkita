import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET endpoint for fetching orders (used by dashboard charts)
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const days = searchParams.get('days');

        let whereClause = {};

        // If days parameter provided, filter by date range
        if (days) {
            const daysAgo = new Date();
            daysAgo.setDate(daysAgo.getDate() - parseInt(days));

            whereClause = {
                createdAt: {
                    gte: daysAgo
                }
            };
        }

        const orders = await prisma.order.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                createdAt: true,
                productionStatus: true,
                total: true,
                customerName: true
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const json = await request.json();
        const { items, ...orderData } = json;

        const newOrder = await prisma.order.create({
            data: {
                ...orderData,
                deliveryDate: orderData.deliveryDate ? new Date(orderData.deliveryDate) : null,
                items: {
                    create: items.map((item: any) => ({
                        product: { connect: { id: item.productId } },
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                items: true
            }
        });

        return NextResponse.json(newOrder);
    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

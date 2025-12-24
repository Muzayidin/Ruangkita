import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

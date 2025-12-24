import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const categories = await prisma.products.findMany({
            select: {
                category: true,
            },
            distinct: ['category'],
            orderBy: {
                category: 'asc',
            }
        });

        // Extract category names and filter out nulls/empties
        const categoryList = categories
            .map((c) => c.category)
            .filter((c): c is string => !!c && c.trim().length > 0);

        return NextResponse.json(categoryList);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { message: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}

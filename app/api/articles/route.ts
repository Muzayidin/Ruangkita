
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, slug, content, imageUrl } = body;

        if (!title || !slug || !content) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const article = await prisma.article.create({
            data: {
                title,
                slug,
                content,
                imageUrl,
            },
        });

        return NextResponse.json(article);
    } catch (error) {
        console.error("Error creating article:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const articles = await prisma.article.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(articles);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
    }
}

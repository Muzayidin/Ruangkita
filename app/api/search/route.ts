import { NextResponse } from "next/server";
import { getAllProducts, searchArticles } from "@/database/db-helper";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");

        if (!query) {
            return NextResponse.json({ products: [], articles: [] });
        }

        // Search Products
        // We reuse getAllProducts but limit it to search results
        // getAllProducts accepts { search: query }
        const products = getAllProducts(100, 0, { search: query });

        // Search Articles
        const articles = searchArticles(query);

        return NextResponse.json({
            products,
            articles,
        });
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

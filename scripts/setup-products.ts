import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Creating/updating products...");

    // Upsert products with correct names and prices
    const products = [
        { name: "Kursi King", price: 800000 },
        { name: "Monalisa", price: 830000 },
        { name: "Kursi Menjangan", price: 1150000 },
        { name: "RT", price: 750000 },
    ];

    for (const product of products) {
        const existing = await prisma.products.findFirst({
            where: { name: product.name }
        });

        if (existing) {
            await prisma.products.update({
                where: { id: existing.id },
                data: { price: product.price }
            });
        } else {
            await prisma.products.create({
                data: {
                    name: product.name,
                    slug: product.name.toLowerCase().replace(/\s+/g, '-'),
                    description: product.name,
                    price: product.price,
                    imageUrl: "/placeholder.jpg",
                    category: "Furniture",
                }
            });
        }
        console.log(`✓ ${product.name} - Rp ${product.price.toLocaleString("id-ID")}`);
    }

    console.log("\nProducts created/updated successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

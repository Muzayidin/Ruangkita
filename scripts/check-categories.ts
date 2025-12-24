import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.products.findMany({
        select: {
            category: true,
        },
        distinct: ['category'],
    });

    console.log("Categories in DB:", categories.map(c => c.category));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

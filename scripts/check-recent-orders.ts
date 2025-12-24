import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const orders = await prisma.order.findMany({
        take: 5,
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    console.log("Recent 5 Orders:");
    orders.forEach((order) => {
        console.log(`ID: ${order.id}`);
        console.log(`Customer: ${order.customerName}`);
        console.log(`Status Global: ${order.productionStatus}`); // Verify global status
        console.log(`Kursi: ${order.chairStatus}, Meja: ${order.tableStatus}, Dulangan: ${order.baseStatus}`);
        console.log(`Items: ${order.items.map(i => i.product.name).join(', ')}`);
        console.log("---------------------------------------------------");
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

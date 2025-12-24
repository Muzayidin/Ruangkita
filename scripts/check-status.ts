import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });

    console.log("Recent orders with component statuses:\n");

    for (const order of orders) {
        console.log(`ID: ${order.id}`);
        console.log(`Customer: ${order.customerName}`);
        console.log(`Production Status: ${order.productionStatus}`);
        console.log(`Chair Status: ${order.chairStatus}`);
        console.log(`Table Status: ${order.tableStatus}`);
        console.log(`Base Status: ${order.baseStatus}`);
        console.log(`Created: ${order.createdAt}`);
        console.log("---");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

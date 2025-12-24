import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Get all orders with future dates
    const orders = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: new Date('2026-01-01') // Orders after 2026
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    console.log(`Found ${orders.length} orders with future dates. Updating...`);

    // Update each order to have a date in the past year
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        // Create dates spread over the past year, most recent first
        const daysAgo = i * 7; // Space orders 7 days apart
        const newDate = new Date();
        newDate.setDate(newDate.getDate() - daysAgo);

        await prisma.order.update({
            where: { id: order.id },
            data: { createdAt: newDate }
        });

        console.log(`Updated order ${order.id.slice(0, 8)} from ${order.createdAt.toISOString().split('T')[0]} to ${newDate.toISOString().split('T')[0]}`);
    }

    console.log('Done! All orders now have realistic dates.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

import { PrismaClient } from "@prisma/client";
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const orders = await prisma.order.findMany({
        take: 10,
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            items: true
        }
    });

    const output = orders.map(order => `ID: ${order.id} | Date: ${order.createdAt} | Status: ${order.productionStatus}`).join('\n');
    fs.writeFileSync('last-order.txt', output);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

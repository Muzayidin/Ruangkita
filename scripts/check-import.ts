
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.order.count();
    console.log(`Total orders in database: ${count}`);

    const sample = await prisma.order.findFirst({
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { product: true } } }
    });
    console.log('Sample latest order:', JSON.stringify(sample, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

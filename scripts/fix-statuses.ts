
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Fixing order statuses...");

    // Update all orders that have a deliveryDate to 'Terkirim'
    // Assuming if deliveryDate exists, it's shipped/scheduled.
    // If strict 'past date' check is needed:
    // we can filter in JS, but SQL/Prisma 'not null' is a good start.

    // We'll update to 'Terkirim' (matches dashboard logic for 'Selesai/Terkirim' bucket)

    const result = await prisma.order.updateMany({
        where: {
            deliveryDate: { not: null }
        },
        data: {
            productionStatus: 'Terkirim'
        }
    });

    console.log(`Updated ${result.count} orders to 'Terkirim'.`);

    // Verify
    const counts = await prisma.order.groupBy({
        by: ['productionStatus'],
        _count: { id: true }
    });
    console.log('New Status Counts:', counts);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Normalizing statuses: converting '-' to 'Tanpa'...");

    // Update chairStatus
    const chairUpdate = await prisma.order.updateMany({
        where: { chairStatus: '-' },
        data: { chairStatus: 'Tanpa' }
    });
    console.log(`Updated ${chairUpdate.count} orders (chairStatus: '-' -> 'Tanpa')`);

    // Update tableStatus
    const tableUpdate = await prisma.order.updateMany({
        where: { tableStatus: '-' },
        data: { tableStatus: 'Tanpa' }
    });
    console.log(`Updated ${tableUpdate.count} orders (tableStatus: '-' -> 'Tanpa')`);

    // Update baseStatus
    const baseUpdate = await prisma.order.updateMany({
        where: { baseStatus: '-' },
        data: { baseStatus: 'Tanpa' }
    });
    console.log(`Updated ${baseUpdate.count} orders (baseStatus: '-' -> 'Tanpa')`);

    // Update carvingStatus - assuming this might have it too
    const carvingUpdate = await prisma.order.updateMany({
        where: { carvingStatus: '-' },
        data: { carvingStatus: 'Tanpa' }
    });
    console.log(`Updated ${carvingUpdate.count} orders (carvingStatus: '-' -> 'Tanpa')`);

    console.log("Normalization complete.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

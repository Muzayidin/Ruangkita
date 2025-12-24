import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Fixing NULL statuses to 'Tanpa'...");

    // Update NULLs to 'Tanpa'
    const chairUpdate = await prisma.order.updateMany({
        where: { chairStatus: null },
        data: { chairStatus: 'Tanpa' }
    });
    console.log(`Updated ${chairUpdate.count} chairs (NULL -> Tanpa)`);

    const tableUpdate = await prisma.order.updateMany({
        where: { tableStatus: null },
        data: { tableStatus: 'Tanpa' }
    });
    console.log(`Updated ${tableUpdate.count} tables (NULL -> Tanpa)`);

    const baseUpdate = await prisma.order.updateMany({
        where: { baseStatus: null },
        data: { baseStatus: 'Tanpa' }
    });
    console.log(`Updated ${baseUpdate.count} bases (NULL -> Tanpa)`);

    console.log("Done.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

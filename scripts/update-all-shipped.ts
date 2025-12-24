
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Updating ALL orders to 'Terkirim'...");

    const updateResult = await prisma.order.updateMany({
        data: {
            productionStatus: 'Terkirim'
        }
    });

    console.log(`Successfully updated ${updateResult.count} orders to status 'Terkirim'.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Searching for orders with 'Kursi Ropan'...");

    // Find orders that contain 'Kursi Ropan'
    const ordersToUpdate = await prisma.order.findMany({
        where: {
            items: {
                some: {
                    product: {
                        name: {
                            contains: 'Kursi Ropan',
                        }
                    }
                }
            }
        },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    console.log(`Found ${ordersToUpdate.length} orders containing 'Kursi Ropan'.`);

    if (ordersToUpdate.length === 0) {
        console.log("No orders found to update.");
        return;
    }

    // Update them
    const updateResult = await prisma.order.updateMany({
        where: {
            id: {
                in: ordersToUpdate.map(o => o.id)
            }
        },
        data: {
            productionStatus: 'Terkirim'
        }
    });

    console.log(`Successfully updated ${updateResult.count} orders to status 'Terkirim'.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

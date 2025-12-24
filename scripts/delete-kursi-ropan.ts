import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Find all orders containing "Kursi Ropan" product
    const ordersWithKursiRopan = await prisma.order.findMany({
        where: {
            items: {
                some: {
                    product: {
                        name: {
                            contains: "Kursi Ropan"
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

    console.log(`Found ${ordersWithKursiRopan.length} orders with Kursi Ropan`);

    if (ordersWithKursiRopan.length === 0) {
        console.log("No orders to delete.");
        return;
    }

    // Delete all order items first
    for (const order of ordersWithKursiRopan) {
        await prisma.orderItem.deleteMany({
            where: { orderId: order.id }
        });
    }

    // Then delete the orders
    const deleteResult = await prisma.order.deleteMany({
        where: {
            id: {
                in: ordersWithKursiRopan.map(o => o.id)
            }
        }
    });

    console.log(`Deleted ${deleteResult.count} orders containing Kursi Ropan`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

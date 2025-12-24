import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Syncing Global Status based on Components...");

    const orders = await prisma.order.findMany();
    let updatedCount = 0;

    for (const order of orders) {
        const components = [
            // order.carvingStatus, 
            order.chairStatus,
            order.tableStatus,
            order.baseStatus
        ].map(s => s?.toLowerCase() || '');

        let newStatus = order.productionStatus;

        // Check if any component is in process
        // Treating 'proses', 'ukir', 'pending' (optional) as needing attention?
        // User specifically said: "ketika produk status nya proses, artinya terdapat meja/kursi/dulangan yang masih proses"
        const isProcess = components.some(s => ['proses', 'ukir'].includes(s));

        // Check if all relevant components are shipped/done (ignoring 'tanpa' and '-')
        const activeComponents = components.filter(s => !['tanpa', '-', ''].includes(s));
        const isAllShipped = activeComponents.length > 0 && activeComponents.every(s => ['terkirim', 'selesai'].includes(s));

        if (isProcess) {
            newStatus = 'Proses';
        } else if (isAllShipped) {
            newStatus = 'Terkirim';
        }
        // If empty/tanpa only? leave as is or 'Pending'? 
        // Let's stick to the user's "Proses" rule primarily.

        if (newStatus !== order.productionStatus) {
            await prisma.order.update({
                where: { id: order.id },
                data: { productionStatus: newStatus }
            });
            process.stdout.write(`.`);
            updatedCount++;
        }
    }

    console.log(`\nSynced ${updatedCount} orders.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

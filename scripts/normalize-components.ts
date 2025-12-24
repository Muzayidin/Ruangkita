import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Normalizing Component Statuses to: Proses, Terkirim, Tanpa");

    const orders = await prisma.order.findMany();
    let updatedCount = 0;

    for (const order of orders) {
        let needsUpdate = false;
        const updates: any = {};

        const normalize = (status: string | null) => {
            if (!status) return 'Tanpa';
            const s = status.toLowerCase();
            if (s === '-' || s === 'null') return 'Tanpa';
            if (s === 'tanpa') return 'Tanpa';
            if (s === 'terkirim') return 'Terkirim';
            if (s === 'selesai') return 'Terkirim'; // Map Selesai to Terkirim
            if (s === 'proses') return 'Proses';
            if (s === 'ukir') return 'Proses'; // Map Ukir to Proses
            if (s === 'pending') return 'Proses'; // Map Pending to Proses

            return 'Proses'; // Default fallback for unknown? Or stay safe? Let's Default to Proses if it has text.
        };

        const newChair = normalize(order.chairStatus);
        const newTable = normalize(order.tableStatus);
        const newBase = normalize(order.baseStatus);

        if (newChair !== (order.chairStatus || 'Tanpa')) {
            updates.chairStatus = newChair;
            needsUpdate = true;
        }
        if (newTable !== (order.tableStatus || 'Tanpa')) {
            updates.tableStatus = newTable;
            needsUpdate = true;
        }
        if (newBase !== (order.baseStatus || 'Tanpa')) {
            updates.baseStatus = newBase;
            needsUpdate = true;
        }

        if (needsUpdate) {
            await prisma.order.update({
                where: { id: order.id },
                data: updates
            });
            updatedCount++;
        }
    }

    console.log(`Normalized ${updatedCount} orders.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

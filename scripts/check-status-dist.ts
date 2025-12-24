import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const orders = await prisma.order.findMany();

    const chairStats: Record<string, number> = {};
    const tableStats: Record<string, number> = {};
    const baseStats: Record<string, number> = {};

    orders.forEach(o => {
        const c = o.chairStatus || 'NULL';
        const t = o.tableStatus || 'NULL';
        const b = o.baseStatus || 'NULL';

        chairStats[c] = (chairStats[c] || 0) + 1;
        tableStats[t] = (tableStats[t] || 0) + 1;
        baseStats[b] = (baseStats[b] || 0) + 1;
    });

    console.log("Chair Status Distribution:", chairStats);
    console.log("Table Status Distribution:", tableStats);
    console.log("Base Status Distribution:", baseStats);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

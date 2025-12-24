
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const total = await prisma.products.count();
    const featured = await prisma.products.count({ where: { featured: 1 } });
    const imported = await prisma.products.findMany({ take: 5 });

    console.log(`Total Products: ${total}`);
    console.log(`Featured Products: ${featured}`);
    console.log('Sample Products:', imported.map(p => ({ name: p.name, featured: p.featured })));
}

main()
    .finally(async () => await prisma.$disconnect());

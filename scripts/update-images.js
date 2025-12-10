
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting image update...');

    // Update Meja Kerja
    await prisma.products.update({
        where: { slug: 'meja-kerja-minimalis' },
        data: { imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80' },
    });

    // Update Kursi
    await prisma.products.update({
        where: { slug: 'kursi-ergonomis-premium' },
        data: { imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80' },
    });

    // Update Lemari
    await prisma.products.update({
        where: { slug: 'lemari-pakaian-3-pintu' },
        data: { imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80' },
    });

    console.log('Images updated successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

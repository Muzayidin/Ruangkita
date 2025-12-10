
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const productsToSeed = [
    {
        slug: 'meja-kerja-minimalis',
        name: 'Meja Kerja Minimalis',
        price: 850000,
        category: 'Meja',
        description: 'Meja kokoh dengan desain minimalis scandinavian. Ideal untuk ruang kerja modern.',
        imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
        featured: 1,
        id: 'prod-001', // random ID needed for creation if not auto-increment string
        stock: 50
    },
    {
        slug: 'kursi-ergonomis-premium',
        name: 'Kursi Ergonomis Premium',
        price: 1500000,
        category: 'Kursi',
        description: 'Kursi dengan penyangga punggung dan leher yang bisa diatur, sangat nyaman untuk bekerja berjam-jam.',
        imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80',
        featured: 1,
        id: 'prod-002',
        stock: 20
    },
    {
        slug: 'lemari-pakaian-3-pintu',
        name: 'Lemari Pakaian 3 Pintu',
        price: 2200000,
        category: 'Penyimpanan',
        description: 'Lemari luas dengan cermin di pintu tengah, menyediakan ruang penyimpanan yang maksimal.',
        imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
        featured: 1,
        id: 'prod-003',
        stock: 10
    },
    {
        slug: 'kursi-cafe-minimalis', // Existing one
        name: 'Kursi Cafe Minimalis',
        price: 450000,
        category: 'Kursi',
        description: 'Kursi santai cocok untuk cafe atau ruang tamu.',
        imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445857?auto=format&fit=crop&w=800&q=80',
        featured: 0,
        // ID likely exists, won't specify for upsert in where clause but need forcreate if not exists
        id: 'existing-id-placeholder',
        stock: 15
    }
];

async function main() {
    console.log('Seeding products...');

    for (const product of productsToSeed) {
        // Check if exists by slug
        const existing = await prisma.products.findFirst({
            where: { slug: product.slug }
        });

        if (existing) {
            console.log(`Updating ${product.slug}...`);
            await prisma.products.update({
                where: { slug: product.slug },
                data: {
                    imageUrl: product.imageUrl,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    featured: product.featured,
                    stock: product.stock
                }
            });
        } else {
            console.log(`Creating ${product.slug}...`);
            await prisma.products.create({
                data: {
                    id: product.id === 'existing-id-placeholder' ? 'prod-' + Date.now() : product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    description: product.description,
                    imageUrl: product.imageUrl,
                    featured: product.featured,
                    stock: product.stock
                }
            });
        }
    }

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

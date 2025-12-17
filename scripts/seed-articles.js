
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const articles = [
    {
        title: "Tips Dekorasi Ruang Kerja Minimalis",
        slug: "tips-dekorasi-ruang-kerja-minimalis",
        content: "<p>Memiliki ruang kerja yang nyaman dan estetis dapat meningkatkan produktivitas. Mulailah dengan memilih meja yang tepat dan pencahayaan yang cukup...</p>",
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        published: true
    },
    {
        title: "Memilih Kursi Ergonomis yang Tepat",
        slug: "memilih-kursi-ergonomis-tepat",
        content: "<p>Kesehatan punggung sangat penting bagi pekerja kantoran. Kursi ergonomis membantu menjaga postur tubuh tetap baik selama bekerja...</p>",
        imageUrl: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80",
        published: true
    },
    {
        title: "Tren Warna Interior 2025",
        slug: "tren-warna-interior-2025",
        content: "<p>Tahun 2025 membawa kembali warna-warna alam yang menenangkan seperti Sage Green dan Terracotta. Pelajari cara mengaplikasikannya...</p>",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
        published: true
    },
    {
        title: "Cara Merawat Furniture Kayu",
        slug: "cara-merawat-furniture-kayu",
        content: "<p>Furniture kayu membutuhkan perawatan khusus agar tahan lama. Hindari paparan sinar matahari langsung dan bersihkan debu secara rutin...</p>",
        imageUrl: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=800&q=80",
        published: true
    },
    {
        title: "Inspirasi Ruang Tamu Modern",
        slug: "inspirasi-ruang-tamu-modern",
        content: "<p>Ruang tamu adalah wajah rumah Anda. Desain modern mengutamakan fungsi dan kesederhanaan tanpa mengorbankan keindahan...</p>",
        imageUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80",
        published: true
    }
];

async function main() {
    console.log('Seeding articles...');

    for (const article of articles) {
        const existing = await prisma.article.findUnique({
            where: { slug: article.slug }
        });

        if (!existing) {
            await prisma.article.create({
                data: article
            });
            console.log(`Created article: ${article.title}`);
        } else {
            console.log(`Article already exists: ${article.title}`);
        }
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

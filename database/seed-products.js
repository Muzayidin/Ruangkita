const Database = require('better-sqlite3');
const path = require('path');
const { randomUUID } = require('crypto');

// Connect to the database
const dbPath = path.join(__dirname, 'datas.db');
console.log(`Open connection to ${dbPath}`);
const db = new Database(dbPath);

const products = [
    {
        name: "Sofa Minimalis Grey",
        slug: "sofa-minimalis-grey-v2",
        price: 3500000,
        originalPrice: 4500000,
        category: "Ruang Tamu",
        description: "Sofa 3 dudukan dengan bahan kain canvas premium warna abu-abu. Rangka kayu jati solid.",
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
        stock: 10,
        featured: 1,
        soldCount: 45
    },
    {
        name: "Meja Kopi Industrial",
        slug: "meja-kopi-industrial-oak",
        price: 1200000,
        category: "Ruang Tamu",
        description: "Meja kopi gaya industrial dengan kaki besi hitam dan top table kayu oak solid.",
        imageUrl: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=800&q=80",
        stock: 15,
        featured: 0,
        soldCount: 12
    },
    {
        name: "Kursi Makan Rotan",
        slug: "kursi-makan-rotan-bali",
        price: 850000,
        category: "Ruang Makan",
        description: "Kursi makan dengan sandaran rotan alami khas Bali. Nyaman dan estetik.",
        imageUrl: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=800&q=80",
        stock: 50,
        featured: 1,
        soldCount: 120
    },
    {
        name: "Lemari Pakaian 3 Pintu",
        slug: "lemari-pakaian-3-pintu-putih",
        price: 5500000,
        originalPrice: 5800000,
        category: "Kamar Tidur",
        description: "Lemari pakaian luas dengan cermin full body dan finishing duco putih halus.",
        imageUrl: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80",
        stock: 5,
        featured: 1,
        soldCount: 8
    },
    {
        name: "Rak Buku Dinding",
        slug: "rak-buku-dinding-floating",
        price: 250000,
        category: "Ruang Kerja",
        description: "Rak buku melayang (floating shelf) minimalis. Kuat menahan beban hingga 10kg.",
        imageUrl: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80",
        stock: 100,
        featured: 0,
        soldCount: 300
    },
    {
        name: "Lampu Gantung Nordic",
        slug: "lampu-gantung-nordic-gold",
        price: 950000,
        category: "Dekorasi",
        description: "Lampu gantung desain Skandinavia dengan aksen emas yang mewah.",
        imageUrl: "https://images.unsplash.com/photo-1513506003011-3b03124a1e50?auto=format&fit=crop&w=800&q=80",
        stock: 20,
        featured: 0,
        soldCount: 35
    },
    {
        name: "Meja Kerja Ergonomis",
        slug: "meja-kerja-standing-desk",
        price: 4200000,
        originalPrice: 5000000,
        category: "Ruang Kerja",
        description: "Meja kerja height-adjustable (bisa naik turun) elektrik. Top table mahogany.",
        imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
        stock: 8,
        featured: 1,
        soldCount: 5
    },
    {
        name: "Vas Bunga Keramik",
        slug: "vas-bunga-keramik-terracotta",
        price: 150000,
        category: "Dekorasi",
        description: "Vas bunga handmade dari tanah liat dengan tekstur alami.",
        imageUrl: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&w=800&q=80",
        stock: 45,
        featured: 0,
        soldCount: 67
    },
    {
        name: "Kursi Santai Lounge",
        slug: "kursi-santai-lounge-green",
        price: 2800000,
        category: "Ruang Tamu",
        description: "Lounge chair empuk dengan warna hijau emerald velvet yang elegan.",
        imageUrl: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80",
        stock: 12,
        featured: 1,
        soldCount: 22
    },
    {
        name: "Kabinet TV Retro",
        slug: "kabinet-tv-retro-teak",
        price: 2100000,
        category: "Ruang Tamu",
        description: "Meja TV kayu jati dengan model kaki jengki ala tahun 70-an.",
        imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
        stock: 18,
        featured: 0,
        soldCount: 15
    },
    {
        name: "Tempat Tidur Queen",
        slug: "tempat-tidur-queen-upholstered",
        price: 6700000,
        originalPrice: 7500000,
        category: "Kamar Tidur",
        description: "Rangka tempat tidur queen size dengan headboard empuk berlapis kain linen.",
        imageUrl: "https://images.unsplash.com/photo-1505693416388-b0346efee866?auto=format&fit=crop&w=800&q=80",
        stock: 6,
        featured: 1,
        soldCount: 9
    },
    {
        name: "Nakas Bedside Table",
        slug: "nakas-bedside-midcentury",
        price: 850000,
        category: "Kamar Tidur",
        description: "Meja samping tempat tidur dengan 2 laci penyimpanan.",
        imageUrl: "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800&q=80",
        stock: 30,
        featured: 0,
        soldCount: 41
    },
    {
        name: "Set Meja Makan 4 Kursi",
        slug: "set-meja-makan-4-kursi-scandi",
        price: 5200000,
        category: "Ruang Makan",
        description: "Paket hemat meja makan kayu solid + 4 kursi scandinavian style.",
        imageUrl: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80",
        stock: 10,
        featured: 1,
        soldCount: 25
    },
    {
        name: "Karpet Bulu Halus",
        slug: "karpet-bulu-halus-beige",
        price: 900000,
        category: "Dekorasi",
        description: "Karpet lantai super lembut ukurna 200x150cm, anti slip.",
        imageUrl: "https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?auto=format&fit=crop&w=800&q=80",
        stock: 60,
        featured: 0,
        soldCount: 150
    },
    {
        name: "Cermin Dinding Bulat",
        slug: "cermin-dinding-bulat-gold",
        price: 450000,
        category: "Dekorasi",
        description: "Cermin bulat diameter 60cm dengan frame besi warna emas.",
        imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80",
        stock: 25,
        featured: 0,
        soldCount: 88
    },
    {
        name: "Bar Stool Kulit",
        slug: "bar-stool-kulit-sintetis",
        price: 1100000,
        category: "Dapur",
        description: "Kursi bar tinggi dengan dudukan kulit sintetis mudah dibersihkan.",
        imageUrl: "https://images.unsplash.com/photo-1503602642458-2321114453ad?auto=format&fit=crop&w=800&q=80",
        stock: 20,
        featured: 0,
        soldCount: 19
    },
    {
        name: "Rak Sepatu Kayu",
        slug: "rak-sepatu-kayu-susun",
        price: 350000,
        category: "Teras & Taman",
        description: "Rak sepatu kayu jati belanda 4 susun, muat 12 pasang sepatu.",
        imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80",
        stock: 40,
        featured: 0,
        soldCount: 200
    },
    {
        name: "Pot Tanaman Besar",
        slug: "pot-tanaman-besar-concrete",
        price: 250000,
        category: "Teras & Taman",
        description: "Pot tanaman outdoor bahan beton minimalis industrial.",
        imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80",
        stock: 35,
        featured: 0,
        soldCount: 56
    },
    {
        name: "Bean Bag Jumbo",
        slug: "bean-bag-jumbo-navy",
        price: 750000,
        category: "Ruang Keluarga",
        description: "Bean bag ukuran XL super nyaman untuk rebahan nonton TV.",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
        stock: 15,
        featured: 1,
        soldCount: 60
    },
    {
        name: "Meja Rias Kartini",
        slug: "meja-rias-kartini-ukir",
        price: 2800000,
        category: "Kamar Tidur",
        description: "Meja rias kayu jati dengan ukiran khas Jepara yang klasik.",
        imageUrl: "https://images.unsplash.com/photo-1595188880628-9844ebbf69c7?auto=format&fit=crop&w=800&q=80",
        stock: 5,
        featured: 0,
        soldCount: 3
    }
];

const stmt = db.prepare(`
    INSERT INTO products (id, slug, name, price, category, description, imageUrl, featured, stock, soldCount, originalPrice, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
`);

const insertMany = db.transaction((products) => {
    for (const product of products) {
        try {
            const id = randomUUID();
            stmt.run(
                id,
                product.slug,
                product.name,
                product.price,
                product.category,
                product.description,
                product.imageUrl,
                product.featured,
                product.stock,
                product.soldCount,
                product.originalPrice || null
            );
            console.log(`Inserted: ${product.name}`);
        } catch (err) {
            console.log(`Skipped (Duplicate/Error): ${product.name} - ${err.message}`);
        }
    }
});

insertMany(products);
console.log('Seeding completed!');

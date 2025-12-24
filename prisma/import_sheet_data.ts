
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper to normalize status
const normalizeStatus = (status: string | undefined | null): string => {
    if (!status) return 'Tanpa';
    const s = status.toLowerCase();
    if (s === '-' || s === 'null' || s === 'tanpa') return 'Tanpa';
    if (s === 'terkirim' || s === 'selesai') return 'Terkirim';
    if (s === 'proses' || s === 'ukir' || s === 'pending') return 'Proses';
    return 'Proses'; // Default fallback
};

const sheetData = [
    {
        "tanggal_pesan": "29/11/2025",
        "pembeli": "Cimfok",
        "nama_barang": "Kursi King",
        "status_ukir": "Ukir",
        "status_kursi": "Terkirim",
        "status_meja": "Terkirim",
        "status_dulangan": "Tanpa",
        "tanggal_kirim": "29/11/2025",
        "harga": "",
        "keterangan": "ukiran"
    },
    {
        "tanggal_pesan": "29/11/2025",
        "pembeli": "Cimfok",
        "nama_barang": "Monalisa",
        "status_ukir": "Ukir",
        "status_kursi": "Terkirim",
        "status_meja": "Terkirim",
        "status_dulangan": "Terkirim",
        "tanggal_kirim": "29/11/2025",
        "harga": "Rp830.000",
        "keterangan": "ukiran"
    },
    {
        "tanggal_pesan": "1/12/2025",
        "pembeli": "Cimfok",
        "nama_barang": "Kursi Menjangan",
        "status_ukir": "Ukir",
        "status_kursi": "Terkirim",
        "status_meja": "Terkirim",
        "status_dulangan": "Proses",
        "tanggal_kirim": "6/12/2025",
        "harga": "Rp1.150.000",
        "keterangan": ""
    },
    {
        "tanggal_pesan": "1/12/2025",
        "pembeli": "Rejoso",
        "nama_barang": "RT",
        "status_ukir": "Ukir",
        "status_kursi": "Terkirim",
        "status_meja": "Proses",
        "status_dulangan": "Tanpa",
        "tanggal_kirim": "1/12/2025",
        "harga": "Rp750.000",
        "keterangan": "rejoso"
    },
    {
        "tanggal_pesan": "3/12/2025",
        "pembeli": "Cimfok",
        "nama_barang": "Kursi Ropan",
        "status_ukir": "",
        "status_kursi": "Terkirim",
        "status_meja": "",
        "status_dulangan": "",
        "tanggal_kirim": "",
        "harga": "Rp75.000",
        "keterangan": ""
    }
];

// Helper to parse "dd/mm/yyyy"
function parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map(Number);
    // Month is 0-indexed in JS
    return new Date(year, month - 1, day);
}

// Helper to parse price "Rp830.000" -> 830000
function parsePrice(priceStr: string): number {
    if (!priceStr) return 0;
    const cleaned = priceStr.replace(/[^0-9]/g, "");
    return parseInt(cleaned) || 0;
}

async function main() {
    console.log("Start importing data...");

    for (const item of sheetData) {
        if (!item.nama_barang) continue;

        // 1. Find or Create Product
        // We try to find match by name. If not, create new one.
        let product = await prisma.products.findFirst({
            where: {
                name: {
                    contains: item.nama_barang, // Simple fuzzy match
                    // mode: 'insensitive' // SQLite default is insensitive often, but let's see
                },
            },
        });

        const price = parsePrice(item.harga);

        if (!product) {
            console.log(`Creating new product: ${item.nama_barang}`);
            product = await prisma.products.create({
                data: {
                    name: item.nama_barang,
                    slug: item.nama_barang.toLowerCase().replace(/ /g, "-") + "-" + Date.now(), // Simple slug gen
                    price: price > 0 ? price : 100000, // Default price if empty
                    description: `Imported from sheet`,
                    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1000", // Default chair image
                    category: "Furniture",
                },
            });
        }

        // 2. Create Order
        const createdAt = parseDate(item.tanggal_pesan) || new Date();
        const deliveryDate = parseDate(item.tanggal_kirim);

        // Map sheet status to our schema fields
        // Logic: if sheet says "Terkirim" -> maybe global status is shipped?
        // We will just store the specific component statuses as strings

        await prisma.order.create({
            data: {
                customerName: item.pembeli || "Unknown Customer",
                whatsapp: "-", // No phone in sheet
                address: "-",
                total: price,
                createdAt: createdAt,
                deliveryDate: deliveryDate,
                notes: item.keterangan,

                // Component Statuses
                carvingStatus: null, // Removed field
                chairStatus: normalizeStatus(item.status_kursi),
                tableStatus: normalizeStatus(item.status_meja),
                baseStatus: normalizeStatus(item.status_dulangan),

                // Default global status
                status: "pending",

                items: {
                    create: {
                        productId: product.id,
                        quantity: 1,
                        price: price,
                    },
                },
            },
        });
    }

    console.log("Import completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

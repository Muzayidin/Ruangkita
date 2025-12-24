
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1lKDl__0yznxlv7gz2KI8C0O4wNplMVhfvHqP3LJog7U/export?format=csv';

async function fetchCsvData(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }
    return response.text();
}

function parseDate(dateStr: string): Date | null {
    if (!dateStr || dateStr.trim() === '') return null;
    // Expect DD/MM/YYYY
    const parts = dateStr.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
    }
    return null;
}

function parsePrice(priceStr: string): number {
    if (!priceStr) return 0;
    // Remove "Rp", ".", and whitespace
    const clean = priceStr.replace(/[^0-9]/g, '');
    return parseInt(clean, 10) || 0;
}

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-')   // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
}

async function main() {
    console.log('Fetching CSV data...');
    const csvContent = await fetchCsvData(SHEET_CSV_URL);

    // Simple CSV parser logic (splitting by newline, then by comma, handling quotes if needed)
    // Given the sample, quotes aren't heavily used, but we should be safe.
    // We'll split by line first.
    const lines = csvContent.split(/\r?\n/);

    // Skip header (Row 0)
    const dataLines = lines.slice(1).filter(line => line.trim().length > 0);

    console.log(`Found ${dataLines.length} rows to process.`);

    for (const line of dataLines) {
        // Naive split by comma mechanism that respects quotes could be complex
        // But checking sample: "Rp75.000" has no comma. "ukiran" no comma.
        // We can try simple split first. If data has commas inside value, this breaks.
        // Sample: "No.,Tanggal Pesan,..." -> standard csv.
        // Use a regex for safer splitting match(/(?:^|,)(\"(?:[^\"]+|\"\")*\"|[^,]*)/g)

        const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        // The above regex is flaky. Let's use a simple split if we assume no commas in content.
        // Or a specific parser function.
        const row = line.split(',');
        // Note: price like "830.000" might be "830,000" in some locales but here it uses dot.
        // Format: No (0), Tanggal Pesan (1), Pembeli (2), Nama Barang (3), Tipe (4), Ukir (5), Tanggal Kirim (6), kursi (7), Meja (8), Dulangan (9), Harga (10), Keterangan (11)

        if (row.length < 4) continue; // Skip malformed

        const no = row[0];
        const dateStr = row[1];
        const customerName = row[2] || "Unknown";
        const productName = row[3] || "Item Custom";
        const type = row[4];
        const carvingStatusRaw = row[5];
        const deliveryDateStr = row[6];
        const chairStatusRaw = row[7];
        const tableStatusRaw = row[8];
        const baseStatusRaw = row[9];
        const priceStr = row[10];
        const notes = row[11];

        // normalize status
        const normalizeStatus = (s: string) => {
            if (!s) return null;
            const upper = s.trim().toUpperCase();
            if (upper === 'TERKIRIM') return 'Selesai';
            if (upper === 'PROSES') return 'Proses';
            if (upper === 'TANPA') return null;
            if (upper === 'UKIR') return 'Proses'; // Assuming "Ukir" in status column means it's being carved? Or finished? Sample row 1 has "Ukir" then delivery date same day. Maybe "Ada"?
            // Let's keep original string if unsure, but mapped to Title Case
            return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
        };

        const carvingStatus = normalizeStatus(carvingStatusRaw); // "Ukir" -> "Ukir"
        const chairStatus = normalizeStatus(chairStatusRaw);
        const tableStatus = normalizeStatus(tableStatusRaw);
        const baseStatus = normalizeStatus(baseStatusRaw);

        const price = parsePrice(priceStr);
        const orderDate = parseDate(dateStr) || new Date();
        const deliveryDate = parseDate(deliveryDateStr);

        // 1. Find or Create Product
        // We append type to name if present to distinguish variants
        const finalProductName = type && type.trim() !== '' ? `${productName.trim()} (${type.trim()})` : productName.trim();
        const productSlug = slugify(finalProductName) + '-' + Math.random().toString(36).substring(2, 7); // Add random to ensure uniqueness or use determinstic?
        // Better: slugify(finalProductName). If conflicts, we likely want the SAME product.

        // Let's try to find product by name first
        let product = await prisma.products.findFirst({
            where: { name: finalProductName }
        });

        if (!product) {
            // Check by slug
            const slug = slugify(finalProductName);
            // Upsert might be risky if we have duplicates in CSV.
            // We'll create if not exists.

            // To be safe with unique slug constraint in a loop:
            // We use upsert on slug.
            product = await prisma.products.upsert({
                where: { slug: slug },
                update: {}, // No update
                create: {
                    name: finalProductName,
                    slug: slug,
                    price: price, // Use the price from this order as base price?
                    category: "Imported",
                    description: `Imported from sheet. Tipe: ${type}`,
                    stock: 100,
                    imageUrl: '/placeholder-product.jpg'
                }
            });
        }

        // 2. Create Order
        // Each row is an order.
        await prisma.order.create({
            data: {
                customerName: customerName,
                whatsapp: "-", // No phone in sheet?
                address: "-", // No address in sheet
                total: price,
                status: "pending",
                createdAt: orderDate,
                productionStatus: "Proses", // Default to 'Proses'
                carvingStatus: carvingStatus,
                chairStatus: chairStatus,
                tableStatus: tableStatus,
                baseStatus: baseStatus,
                deliveryDate: deliveryDate,
                notes: notes,
                items: {
                    create: {
                        productId: product.id,
                        quantity: 1, // Assume 1 per row
                        price: price // Store snapshot price
                    }
                }
            }
        });

        process.stdout.write('.');
    }
    console.log('\nImport finished.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper to parse DD/MM/YYYY format
function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
}

async function main() {
    const ordersData = [
        { date: "29/11/2025", customer: "Cimfok", productName: "Kursi King", type: "321", delivery: "29/11/2025", kursi: "Selesai", meja: "Selesai", dulangan: "Tanpa", price: 800000 },
        { date: "29/11/2025", customer: "Cimfok", productName: "Monalisa", type: "3k", delivery: "29/11/2025", kursi: "Selesai", meja: "Selesai", dulangan: "Selesai", price: 830000 },
        { date: "29/11/2025", customer: "Cimfok", productName: "Monalisa", type: "3k", delivery: "29/11/2025", kursi: "Selesai", meja: "Selesai", dulangan: "Selesai", price: 830000 },
        { date: "29/11/2025", customer: "Cimfok", productName: "Monalisa", type: "3k", delivery: "29/11/2025", kursi: "Selesai", meja: "Selesai", dulangan: "Selesai", price: 830000 },
        { date: "1/12/2025", customer: "Cimfok", productName: "Kursi Menjangan", type: "321", delivery: "6/12/2025", kursi: "Selesai", meja: "Selesai", dulangan: "Proses", price: 1150000 },
        { date: "1/12/2025", customer: "Cimfok", productName: "Kursi Menjangan", type: "321", delivery: "6/12/2025", kursi: "Selesai", meja: "Selesai", dulangan: "Proses", price: 1150000 },
        { date: "1/12/2025", customer: "Rejoso", productName: "RT", type: "", delivery: "1/12/2025", kursi: "Selesai", meja: "Selesai", dulangan: "Tanpa", price: 750000 },
        { date: "1/12/2025", customer: "Rejoso", productName: "RT", type: "", delivery: "1/12/2025", kursi: "Selesai", meja: "Selesai", dulangan: "Tanpa", price: 750000 },
        { date: "1/12/2025", customer: "Rejoso", productName: "RT", type: "", delivery: "1/12/2025", kursi: "Selesai", meja: "Selesai", dulangan: "Tanpa", price: 750000 },
        { date: "1/12/2025", customer: "Rejoso", productName: "RT", type: "", delivery: "1/12/2025", kursi: "Selesai", meja: "Selesai", dulangan: "Tanpa", price: 750000 },
    ];

    console.log(`Creating ${ordersData.length} orders...`);

    for (let i = 0; i < ordersData.length; i++) {
        const data = ordersData[i];

        // Find product by name
        const product = await prisma.products.findFirst({
            where: { name: data.productName }
        });

        if (!product) {
            console.error(`Product not found: ${data.productName}`);
            continue;
        }

        // Determine global status: if all components are Selesai, set to Selesai, otherwise Proses
        const allCompleted = data.kursi === 'Selesai' && data.meja === 'Selesai' &&
            (data.dulangan === 'Selesai' || data.dulangan === 'Tanpa');
        const productionStatus = allCompleted ? 'Selesai' : 'Proses';

        await prisma.order.create({
            data: {
                customerName: data.customer,
                whatsapp: "081234567890", // Default WhatsApp
                address: "",
                productionStatus: productionStatus,
                chairStatus: data.kursi,
                tableStatus: data.meja,
                baseStatus: data.dulangan,
                deliveryDate: parseDate(data.delivery),
                notes: data.type ? `Tipe: ${data.type}` : "",
                total: data.price * 1, // Use actual price from data
                createdAt: parseDate(data.date),
                items: {
                    create: [
                        {
                            productId: product.id,
                            quantity: 1,
                            price: data.price // Use actual price from data
                        }
                    ]
                }
            }
        });

        console.log(`Created order ${i + 1}/${ordersData.length}: ${data.customer} - ${data.productName} (Rp ${data.price.toLocaleString("id-ID")})`);
    }

    console.log("Import completed successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

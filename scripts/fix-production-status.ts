import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Fixing production status for all orders...");

    const orders = await prisma.order.findMany();

    let fixedCount = 0;

    for (const order of orders) {
        const chairStatus = order.chairStatus;
        const tableStatus = order.tableStatus;
        const baseStatus = order.baseStatus;

        // Check if any component is in process
        const anyInProcess =
            chairStatus === "Proses" ||
            tableStatus === "Proses" ||
            baseStatus === "Proses";

        // Check if all components are completed
        const allCompleted =
            (chairStatus === "Selesai" || chairStatus === "" || chairStatus === "Tanpa" || !chairStatus) &&
            (tableStatus === "Selesai" || tableStatus === "" || tableStatus === "Tanpa" || !tableStatus) &&
            (baseStatus === "Selesai" || baseStatus === "" || baseStatus === "Tanpa" || !baseStatus);

        // Determine correct status
        let correctStatus = order.productionStatus;

        if (anyInProcess) {
            correctStatus = "Proses";
        } else if (allCompleted && (chairStatus === "Selesai" || tableStatus === "Selesai" || baseStatus === "Selesai")) {
            correctStatus = "Selesai";
        }

        // Update if different
        if (correctStatus !== order.productionStatus) {
            await prisma.order.update({
                where: { id: order.id },
                data: { productionStatus: correctStatus },
            });
            console.log(`Fixed: ${order.customerName} - ${order.productionStatus} → ${correctStatus}`);
            fixedCount++;
        }
    }

    console.log(`\nDone! Fixed ${fixedCount} orders.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

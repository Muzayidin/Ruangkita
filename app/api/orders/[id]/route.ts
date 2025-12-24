import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const json = await request.json();

        // Convert date string back to Date object if exists
        const dataToUpdate: any = { ...json };
        if (dataToUpdate.deliveryDate) {
            dataToUpdate.deliveryDate = new Date(dataToUpdate.deliveryDate);
        } else {
            dataToUpdate.deliveryDate = null;
        }

        // Auto-calculate production status based on component statuses
        const chairStatus = dataToUpdate.chairStatus || json.chairStatus;
        const tableStatus = dataToUpdate.tableStatus || json.tableStatus;
        const baseStatus = dataToUpdate.baseStatus || json.baseStatus;

        // Check if any component is in process
        const anyInProcess =
            chairStatus === 'Proses' ||
            tableStatus === 'Proses' ||
            baseStatus === 'Proses';

        // Check if all components are completed
        const allCompleted =
            (chairStatus === 'Terkirim' || chairStatus === '' || chairStatus === 'Tanpa' || !chairStatus) &&
            (tableStatus === 'Terkirim' || tableStatus === '' || tableStatus === 'Tanpa' || !tableStatus) &&
            (baseStatus === 'Terkirim' || baseStatus === '' || baseStatus === 'Tanpa' || !baseStatus);

        // Set production status accordingly
        if (anyInProcess) {
            dataToUpdate.productionStatus = 'Proses';
        } else if (allCompleted && (chairStatus === 'Terkirim' || tableStatus === 'Terkirim' || baseStatus === 'Terkirim')) {
            dataToUpdate.productionStatus = 'Terkirim';
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: dataToUpdate,
        });

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

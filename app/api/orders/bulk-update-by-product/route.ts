import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { customerName, productName, statusType, newStatus, quantity } = body;

        // Validation
        if (!customerName || !productName || !statusType || !newStatus || !quantity) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!['chairStatus', 'tableStatus', 'baseStatus'].includes(statusType)) {
            return NextResponse.json(
                { error: 'Invalid status type' },
                { status: 400 }
            );
        }

        if (!['Proses', 'Terkirim', 'Tanpa'].includes(newStatus)) {
            return NextResponse.json(
                { error: 'Invalid status value' },
                { status: 400 }
            );
        }

        if (quantity < 1) {
            return NextResponse.json(
                { error: 'Quantity must be at least 1' },
                { status: 400 }
            );
        }

        // Find matching orders
        const matchingOrders = await prisma.order.findMany({
            where: {
                customerName: customerName,
                items: {
                    some: {
                        product: {
                            name: productName
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'asc' // Update oldest first
            },
            take: quantity,
            select: {
                id: true,
                chairStatus: true,
                tableStatus: true,
                baseStatus: true
            }
        });

        if (matchingOrders.length === 0) {
            return NextResponse.json(
                { error: 'No matching orders found', count: 0 },
                { status: 404 }
            );
        }

        // Update the orders
        const orderIds = matchingOrders.map((o: any) => o.id);

        // Update status for each order and recalculate productionStatus
        const updatePromises = orderIds.map(async (orderId: string) => {
            const order = matchingOrders.find((o: any) => o.id === orderId)!;

            // Update the specific status
            const updatedStatuses: any = {};
            updatedStatuses[statusType] = newStatus;

            // Get current values
            const chairStatus = statusType === 'chairStatus' ? newStatus : order.chairStatus;
            const tableStatus = statusType === 'tableStatus' ? newStatus : order.tableStatus;
            const baseStatus = statusType === 'baseStatus' ? newStatus : order.baseStatus;

            // Auto-calculate productionStatus
            const allCompleted =
                (chairStatus === 'Terkirim' || chairStatus === '' || chairStatus === 'Tanpa' || !chairStatus) &&
                (tableStatus === 'Terkirim' || tableStatus === '' || tableStatus === 'Tanpa' || !tableStatus) &&
                (baseStatus === 'Terkirim' || baseStatus === '' || baseStatus === 'Tanpa' || !baseStatus);

            const anyInProcess =
                chairStatus === 'Proses' ||
                tableStatus === 'Proses' ||
                baseStatus === 'Proses';

            let productionStatus = 'Pending';
            if (anyInProcess) {
                productionStatus = 'Proses';
            } else if (allCompleted && (chairStatus === 'Terkirim' || tableStatus === 'Terkirim' || baseStatus === 'Terkirim')) {
                productionStatus = 'Terkirim';
            }

            updatedStatuses.productionStatus = productionStatus;

            return prisma.order.update({
                where: { id: orderId },
                data: updatedStatuses
            });
        });

        await Promise.all(updatePromises);

        return NextResponse.json({
            success: true,
            count: matchingOrders.length,
            message: `Successfully updated ${matchingOrders.length} order(s)`
        });

    } catch (error) {
        console.error('Bulk update error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

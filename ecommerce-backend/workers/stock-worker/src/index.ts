import "dotenv/config";
import { PrismaClient, OrderStatus } from "../../../generated/prisma/client.js";
import type { Channel } from "amqplib";
import { getChannel } from "./mq/rabbit.js";
import { env } from "./env.js";

const prisma = new PrismaClient();

async function processMessage(msg: any, channel: Channel) {
    const content = JSON.parse(msg.content.toString());
    console.log("[STOCK-WORKER] received: ", content);

    const order = await prisma.order.findUnique({
        where: { id: content.orderId },
        include: { items: true },
    });

    if (!order) {
        console.warn("[STOCK-WORKER] order not found: ", content.orderId);
        return channel.ack(msg);
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
        console.log(`[STOCK-WORKER] skipping (status: ${order.status})`);
        return channel.ack(msg);
    }

    try {
        await prisma.$transaction(async (tx) => {
            const items = await tx.orderItem.findMany({
                where: { id: order.id },
                include: { product: true },
            });

            for (const item of items) {
                if (item.product.stock < item.quantity) {
                    await tx.order.update({
                        where: { id: order.id },
                        data: { status: OrderStatus.CANCELLED },
                    });
                    throw new Error("INSUFFICIENT_STOCK");
                }
            }

            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: item.product.stock - item.quantity },
                });
            }

            await tx.order.update({
                where: { id: order.id },
                data: { status: OrderStatus.CONFIRMED },
            });
        });

        console.log("[STOCK-WORKER] order confirmed:  ", order.id);
    } catch (error: any) {
        if (error?.message === "INSUFFICIENT_STOCK") {
            console.warn("[STOCK-WORKER] order cancelled (stock): ", order.id);
        } else {
            console.log("[STOCK-WORKER] error: ", error);
        }
    } finally {
        channel.ack(msg);
    }
}

async function main() {
    const channel = await getChannel();
    await channel.consume(
        "stock.payment_confirmed",
        (msg: any) => processMessage(msg, channel),
        { noAck: false }
    );
    console.log("[STOCK-WORKER] consuming stock.payment_confirmed");
}

main().catch((error) => {
    console.error("[STOCK-WORKER] error: ", error);
    process.exit(1);
});

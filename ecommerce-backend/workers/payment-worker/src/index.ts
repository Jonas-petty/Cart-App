import { PrismaClient, OrderStatus } from "../../../generated/prisma/client.js";
import type { Channel } from "amqplib";
import { getChannel } from "./mq/rabbit.js";
import { env } from "./env.js";

const prisma = new PrismaClient();

async function publishPaymentConfirmed(channel: Channel, orderId: string) {
    const data = {
        orderId,
        paidAt: new Date().toISOString(),
        v: 1,
    };

    channel.publish(
        env.PAYMENT_EXCHANGE,
        "payment.confirmed",
        Buffer.from(JSON.stringify(data)),
        { contentType: "application/json", persistent: true }
    );
}

async function publishPaymentFailed(
    channel: Channel,
    orderId: string,
    reason: string
) {
    const data = {
        orderId,
        reason,
        failedAt: new Date().toISOString(),
        v: 1,
    };

    channel.publish(
        env.PAYMENT_EXCHANGE,
        "payment.failed",
        Buffer.from(JSON.stringify(data)),
        { contentType: "application/json", persistent: true }
    );
}

async function processMessage(msg: any, channel: Channel) {
    const content = JSON.parse(msg.content.toString());
    console.log("[PAYMENT-WORKER] received: ", content);

    const order = await prisma.order.findUnique({
        where: { id: content.orderId },
    });

    if (!order) {
        console.warn("[PAYMENT-WORKER] order not found: ", content.orderId);
        return channel.ack(msg);
    }

    if (order.status !== OrderStatus.PENDING_PAYMENT) {
        console.log(`[PAYMENT-WORKER] skipping (status: ${order.status})`);
        return channel.ack(msg);
    }

    const paymentApproved = Math.random() < 0.8; // I'm simulating the payment approve odds with 80%

    if (paymentApproved) {
        await publishPaymentConfirmed(channel, content.orderId);
        console.log("[PAYMENT-WORKER] payment.confirmed published");
    } else {
        await prisma.order.update({
            where: { id: content.orderId },
            data: { status: OrderStatus.PAYMENT_FAILED },
        });

        await publishPaymentFailed(
            channel,
            content.orderId,
            "Payment rejected"
        );
        console.log("[PAYMENT-WORKER] payment.failed published");
    }

    channel.ack(msg);
}

async function main() {
    const channel = await getChannel();
    await channel.consume(
        "payment.order_created",
        (msg: any) => processMessage(msg, channel),
        { noAck: false }
    );
}

main().catch((error) => {
    console.error("[PAYMENT-WORKER] error: ", error);
    process.exit(1);
});

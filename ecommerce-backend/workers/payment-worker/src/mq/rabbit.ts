import amqplib from "amqplib";
import type { Channel, ChannelModel } from "amqplib";
import { env } from "../env.js";

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export async function getChannel(): Promise<Channel> {
    if (channel) return channel;

    if (!connection) {
        connection = await amqplib.connect(env.RABBITMQ_URL);
    }

    channel = await connection.createChannel();
    return channel;
}

export async function assertRabbitTopology() {
    const channel = await getChannel();
    await channel.assertExchange(env.ORDER_EXCHANGE, "topic", {
        durable: true,
    });
    await channel.assertExchange(env.PAYMENT_EXCHANGE, "topic", {
        durable: true,
    });
    await channel.assertQueue("payment.order_created", { durable: true });
    await channel.bindQueue(
        "payment.order_created",
        env.ORDER_EXCHANGE,
        "order.created"
    );
}

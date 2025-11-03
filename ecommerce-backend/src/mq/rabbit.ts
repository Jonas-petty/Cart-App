import amqplib from "amqplib";
import type { ChannelModel, Channel, Options } from "amqplib";
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

export async function ensureRabbitTopology() {
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

    await channel.assertQueue("stock.payment_confirmed", { durable: true });
    await channel.bindQueue(
        "stock.payment_confirmed",
        env.PAYMENT_EXCHANGE,
        "payment.confirmed"
    );
}

export async function publish(
    exchange: string,
    routingKey: string,
    payload: any,
    options?: Options.Publish
) {
    const channel = await getChannel();
    const buffer = Buffer.from(JSON.stringify(payload));
    return channel.publish(exchange, routingKey, buffer, {
        contentType: "application/json",
        persistent: true,
        ...options,
    });
}

import { publish } from "../mq/rabbit.js";
import { env } from "../env.js";

export async function publishOrderCreated(
    orderId: string,
    customerId: string,
    total: number,
    items: Array<{ productId: string; quantity: number }>,
    occurredAt: string,
    v: number
) {
    return publish(env.ORDER_EXCHANGE, "order.created", {
        orderId,
        customerId,
        total,
        items,
        occurredAt,
        v,
    });
}

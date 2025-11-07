if (!process.env.RABBITMQ_URL) {
    throw new Error("RABBITMQ_URL variable is missing on the environment.");
}

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL variable is missing on the environment.");
}

export const env = {
    ORDER_EXCHANGE: process.env.ORDER_EXCHANGE ?? "order.events",
    PAYMENT_EXCHANGE: process.env.PAYMENT_EXCHANGE ?? "payment.events",
    RABBITMQ_URL: process.env.RABBITMQ_URL,
    DATABASE_URL: process.env.DATABASE_URL,
};

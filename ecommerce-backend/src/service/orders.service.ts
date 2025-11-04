import { prisma } from "../db/index.js";
import { publishOrderCreated } from "../publisher/orders.publisher.js";
import { ProductService } from "./products.service.js";

export const OrderService = {
    list: () => {
        return prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            include: { items: true },
        });
    },
    listByCustomerId: (customerId: string) => {
        return prisma.order.findMany({
            where: { customerId },
            orderBy: { createdAt: "desc" },
            include: { items: true },
        });
    },
    findById: (id: string) => {
        return prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });
    },
    create: async (
        customerId: string,
        items: Array<{ productId: string; quantity: number }>
    ) => {
        const productsIds = items.map((item) => item.productId);
        const products = await ProductService.findManyByIds(productsIds);

        if (products.length !== productsIds.length) {
            throw Object.assign(new Error("Product not found"), {
                statusCode: 404,
            });
        }

        const total = items.reduce((acc, item) => {
            const product = products.find(
                (product) => product.id === item.productId
            )!;
            return acc + Number(product.price) * item.quantity;
        }, 0);

        const order = await prisma.$transaction(async (tx) => {
            const created = await tx.order.create({
                data: {
                    customerId,
                    items: {
                        create: items.map((item) => {
                            const product = products.find(
                                (product) => product.id === item.productId
                            )!;
                            return {
                                productId: item.productId,
                                quantity: item.quantity,
                                unitPrice: product.price,
                            };
                        }),
                    },
                },
                include: { items: true },
            });
            return created;
        });

        await publishOrderCreated(
            order.id,
            order.customerId,
            total,
            items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
            })),
            new Date().toISOString(),
            1
        );
        return order;
    },
};

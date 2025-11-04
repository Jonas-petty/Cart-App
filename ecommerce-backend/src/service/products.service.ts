import { prisma } from "../db/index.js";

export const ProductService = {
    list: () => {
        return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    },
    getById: (id: string) => {
        return prisma.product.findFirst({ where: { id } });
    },
    create: (payload: { name: string; price: number; stock: number }) => {
        return prisma.product.create({ data: payload });
    },
    delete: (id: string) => {
        return prisma.product.deleteMany({ where: { id } });
    },
};
``
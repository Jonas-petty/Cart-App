import { prisma } from "../db/index.js";

export const ProductService = {
    list: () => {
        return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    },
    findById: (id: string) => {
        return prisma.product.findUnique({ where: { id } });
    },
    findManyByIds: (productIds: Array<string>) => {
        return prisma.product.findMany({ where: { id: { in: productIds } } });
    },
    create: (payload: { name: string; price: number; stock: number }) => {
        return prisma.product.create({ data: payload });
    },
    delete: (id: string) => {
        return prisma.product.deleteMany({ where: { id } });
    },
};

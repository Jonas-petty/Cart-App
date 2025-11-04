import { prisma } from "../db/index.js";

export const CustumerSevice = {
    list: () => {
        return prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
    },
    create: (payload: { name: string; email: string; cpf: string }) => {
        return prisma.customer.create({ data: payload });
    },
    delete: (id: string) => {
        return prisma.customer.deleteMany({ where: { id } });
    },
};

import { prisma } from "../db/index.js";

export const CustumerSevice = {
    list: () => {
        prisma.customer.findMany({ orderBy: { createdAt: "desc" } });
    },
    add: (payload: { name: string; email: string; cpf: string }) => {
        prisma.customer.create({ data: payload });
    },
    remove: (id: string) => {
        prisma.customer.deleteMany({ where: { id } });
    },
};

import type { Request, Response, NextFunction } from "express";
import { CustumerSevice } from "../service/customers.service.js";
import z from "zod";

export async function list(_req: Request, res: Response, next: NextFunction) {
    try {
        const customersList = await CustumerSevice.list();
        res.json(customersList);
    } catch (error) {
        next(error);
    }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = z.object({ id: z.string() }).parse(req.params);
        const customer = await CustumerSevice.getById(id);
        res.json({ ...customer });
    } catch (error) {
        next(error);
    }
}

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = z.object({
            name: z.string(),
            email: z.string(),
            cpf: z.string(),
        });

        const { name, email, cpf } = schema.parse(req.body);
        const customer = await CustumerSevice.create({ name, email, cpf });

        res.status(201).json(customer);
    } catch (error) {
        next(error);
    }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = z.object({ id: z.string() }).parse(req.params);
        const result = await CustumerSevice.delete(id);
        res.json({ delete: result.count });
    } catch (error) {
        next(error);
    }
}

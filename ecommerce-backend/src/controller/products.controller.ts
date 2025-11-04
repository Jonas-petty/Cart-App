import type { Request, Response, NextFunction } from "express";
import { ProductService } from "../service/products.service.js";
import z from "zod";

export async function list(_req: Request, res: Response, next: NextFunction) {
    try {
        const productsList = await ProductService.list();
        res.json(productsList);
    } catch (error) {
        next(error);
    }
}

export async function findById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = z.object({ id: z.string() }).parse(req.params);
        const customer = await ProductService.findById(id);
        res.json({ ...customer });
    } catch (error) {
        next(error);
    }
}

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = z.object({
            name: z.string(),
            price: z
                .number()
                .refine(
                    (value) =>
                        Number.isFinite(value) &&
                        /^(\d{1,12})(\.\d{2})$/.test(value.toFixed(2))
                ),
            stock: z.number(),
        });

        const { name, price, stock } = schema.parse(req.body);
        const customer = await ProductService.create({ name, price, stock });

        res.status(201).json(customer);
    } catch (error) {
        next(error);
    }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = z.object({ id: z.string() }).parse(req.params);
        const result = await ProductService.delete(id);
        res.json({ delete: result.count });
    } catch (error) {
        next(error);
    }
}

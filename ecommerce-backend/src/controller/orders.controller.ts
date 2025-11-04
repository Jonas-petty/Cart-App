import type { Request, Response, NextFunction } from "express";
import { OrderService } from "../service/orders.service.js";
import z from "zod";

export async function list(_req: Request, res: Response, next: NextFunction) {
    try {
        const ordersList = await OrderService.list();
        res.json(ordersList);
    } catch (error) {
        next(error);
    }
}

export async function findById(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { id } = z.object({ id: z.string() }).parse(req.params);
        const order = await OrderService.findById(id);
        res.json({ ...order });
    } catch (error) {
        next(error);
    }
}

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = z.object({
            custoemerId: z.string(),
            items: z
                .array(
                    z.object({
                        productId: z.string(),
                        quantity: z.number().int().positive(),
                    })
                )
                .min(1),
        });

        const { custoemerId, items } = schema.parse(req.body);
        const order = await OrderService.create(custoemerId, items);

        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
}

export async function listByCustomerId(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { id } = z.object({ id: z.string() }).parse(req.params);
        const orders = await OrderService.listByCustomerId(id);
        res.json(orders);
    } catch (error) {
        next(error);
    }
}

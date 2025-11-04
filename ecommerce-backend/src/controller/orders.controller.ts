import type { Request, Response, NextFunction } from "express";
import { OrderService } from "../service/orders.service.js";
import z from "zod";
import { error } from "console";

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

        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json(order);
    } catch (error) {
        next(error);
    }
}

export async function create(req: Request, res: Response, next: NextFunction) {
    try {
        const schema = z.object({
            customerId: z.string(),
            items: z
                .array(
                    z.object({
                        productId: z.string(),
                        quantity: z.number().int().positive(),
                    })
                )
                .min(1),
        });

        const { customerId, items } = schema.parse(req.body);
        const order = await OrderService.create(customerId, items);

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

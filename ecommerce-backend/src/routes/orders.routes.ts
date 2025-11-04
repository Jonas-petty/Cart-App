import { Router } from "express";
import * as orders from "../controller/orders.controller.js";

const router = Router();

router.get("/orders/", orders.list);
router.get("/orders/:id", orders.findById);
router.post("/orders", orders.create);
router.get("/customers/:id/orders", orders.listByCustomerId);

export default router;

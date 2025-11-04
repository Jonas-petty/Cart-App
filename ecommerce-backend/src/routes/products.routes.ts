import { Router } from "express";
import * as products from "../controller/products.controller.js";

const router = Router();

router.get("/products", products.list);
router.get("/products/:id", products.getById);
router.post("/products", products.create);
router.delete("/products/:id", products.remove);

export default router;

import { Router } from "express";
import * as customers from "../controller/customers.controller.js";

const router = Router();

router.get("/customers", customers.list);
router.get("/customers/:id", customers.getById);
router.post("/customers", customers.create);
router.delete("/customers/:id", customers.remove);

export default router;

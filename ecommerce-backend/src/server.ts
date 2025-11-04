import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.js";
import { ensureRabbitTopology } from "./mq/rabbit.js";
import customersRouter from "./routes/customers.routes.js";
import productsRouter from "./routes/products.routes.js";
import ordersRouter from "./routes/orders.routes.js";

async function bootstrap() {
    await ensureRabbitTopology();

    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use("/api", customersRouter);
    app.use("/api", productsRouter);
    app.use("/api", ordersRouter);

    app.use(errorHandler);

    const port = process.env.PORT || 3000;
    app.listen(port, () =>
        console.log(`[API] listening on http://localhost:${port}`)
    );
}

bootstrap().catch((error) => {
    console.error("[API] bootstrap error: ", error);
    process.exit(1);
});

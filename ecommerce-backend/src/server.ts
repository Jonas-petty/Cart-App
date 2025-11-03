import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.js";
import { ensureRabbitTopology } from "./mq/rabbit.js";

async function bootstrap() {
    await ensureRabbitTopology();

    const app = express();

    app.use(cors());
    app.use(express.json());
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

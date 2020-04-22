import express, { Request, Response } from "express";

import { Order } from "./models";
import { getAllOrders, getAvgOrderAmountByDay } from "./order-service";
import { pool } from "./database-service";

const app = express();

app.get("/orders", async (req: Request, res: Response) => {
  const orders = await getAllOrders();
  res.send(orders);
});

app.get("/orders/:orderId", async (req: Request, res: Response) => {
  const order: Order = {
    id: req.params.orderId,
    createdAt: new Date(),
    amountCents: 489,
  };
  res.send(order);
});

app.post("/orders", async (req: Request, res: Response) => {
  res.status(303);
  res.set("location", "/orders/123");
  res.end();
});

app.get("/order-stats", async (req: Request, res: Response) => {
  const stats = await getAvgOrderAmountByDay();
  res.send(stats);
});

function gracefulShutdown(err: Error) {
  console.error(err);
  pool.end();
}

process.on("uncaughtException", gracefulShutdown);
process.on("unhandledRejection", gracefulShutdown);

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000/");
});

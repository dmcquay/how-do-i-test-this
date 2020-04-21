import express, { Request, Response } from "express";

import { getAllOrders, getAvgOrderAmountByDay } from "./order-service";
import { pool } from "./database-service";

const app = express();

app.get("/orders", async (req: Request, res: Response) => {
  const orders = await getAllOrders();
  res.set("Content-type", "application/json");
  res.send(orders);
});

app.get("/order-stats", async (req: Request, res: Response) => {
  const stats = await getAvgOrderAmountByDay();
  res.set("Content-type", "application/json");
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

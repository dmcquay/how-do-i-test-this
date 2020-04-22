import express, { Request, Response } from "express";

import {
  getAllOrders,
  getAvgOrderAmountByDay,
  createOrder,
  getOrderById,
} from "./order-service";
import { createOrderRequestToOrderModel } from "./transforms";
import { isValidCreateOrderRequest } from "./validation";
import { pool } from "./database-service";

const app = express();
app.use(express.json());

app.get("/orders", async (req: Request, res: Response) => {
  const orders = await getAllOrders();
  res.send(orders);
});

app.get("/orders/:orderId", async (req: Request, res: Response) => {
  const order = await getOrderById(req.params.orderId);
  res.send(order);
});

app.post("/orders", async (req: Request, res: Response) => {
  if (!isValidCreateOrderRequest(req.body)) {
    res.status(400);
    res.send("Invalid create order request");
    return;
  }

  const order = createOrderRequestToOrderModel(req.body);
  await createOrder(order);
  res.status(303);
  res.set("location", `/orders/${order.id}`);
  res.end();
});

app.get("/order-stats", async (req: Request, res: Response) => {
  const stats = await getAvgOrderAmountByDay();
  res.send(stats);
});

async function gracefulShutdown(err: Error) {
  console.error(err);
  await pool.end();
  process.exit(1);
}

process.on("uncaughtException", gracefulShutdown);
process.on("unhandledRejection", gracefulShutdown);

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000/");
});

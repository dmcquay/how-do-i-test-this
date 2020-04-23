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
import { getOrderRiskScore } from "./risk-service";
import { CreateOrderRequest } from "./models";
import config from "./config";

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
  const createOrderRequest = req.body as CreateOrderRequest;

  const riskScore = await getOrderRiskScore(createOrderRequest);

  const order = createOrderRequestToOrderModel(createOrderRequest, riskScore);
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

app.listen(config.port, () => {
  console.log(`API Started. Listening on port ${config.port}.`);
});

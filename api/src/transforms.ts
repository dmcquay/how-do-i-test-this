import * as uuid from "uuid";

import { Order, CreateOrderRequest } from "./models";

export function dbRowToOrderModel(row: any): Order {
  return {
    id: row.id,
    amountCents: row.amount_cents,
    createdAt: row.created_at,
  };
}

export function createOrderRequestToOrderModel(req: CreateOrderRequest): Order {
  return {
    id: uuid.v4(),
    createdAt: new Date(),
    amountCents: req.amountCents,
  };
}

import * as uuid from "uuid";

import { OrderModel, CreateOrderRequest } from "./models";

export function dbRowToOrderModel(row: any): OrderModel {
  return {
    id: row.id,
    amountCents: row.amount_cents,
    createdAt: row.created_at,
    riskScore: row.risk_score,
  };
}

export function createOrderRequestToOrderModel(
  req: CreateOrderRequest,
  riskScore: number
): OrderModel {
  return {
    id: uuid.v4(),
    createdAt: new Date(),
    amountCents: req.amountCents,
    riskScore,
  };
}

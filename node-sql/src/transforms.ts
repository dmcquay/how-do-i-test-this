import { Order } from "./models";

export function dbRowToOrderModel(row: any): Order {
  return {
    id: row.id,
    amountCents: row.amount_cents,
    createdAt: row.created_at,
  };
}

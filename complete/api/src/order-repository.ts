import { pool } from "./database-service";
import { OrderModel, AverageOrderSizeByDayOfWeekStatsRecord } from "./models";
import { dbRowToOrderModel } from "./transforms";

export async function getAllOrders(): Promise<OrderModel[]> {
  const results = await pool.query('SELECT * FROM "order"');
  return results.rows.map(dbRowToOrderModel);
}

export async function getAvgOrderAmountByDay(): Promise<
  AverageOrderSizeByDayOfWeekStatsRecord[]
> {
  const results = await pool.query(`
    SELECT
      CAST(ROUND(AVG(amount_cents)) AS INT) AS "averageOrderAmount",
      DATE_PART('dow', created_at) AS "dayOfWeek"
    FROM "order"
    GROUP BY DATE_PART('dow', created_at)
    ORDER BY "dayOfWeek" ASC
  `);
  return results.rows;
}

export async function createOrder(order: OrderModel): Promise<void> {
  await pool.query(
    `INSERT INTO "order"
    (id, created_at, amount_cents, risk_score)
    VALUES ($1, $2, $3, $4)`,
    [order.id, order.createdAt, order.amountCents, order.riskScore]
  );
}

export async function getOrderById(orderId: string): Promise<OrderModel> {
  const result = await pool.query(`SELECT * FROM "order" WHERE id = $1`, [
    orderId,
  ]);
  return dbRowToOrderModel(result.rows[0]);
}

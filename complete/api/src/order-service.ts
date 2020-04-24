import { pool } from "./database-service";
import { Order, AverageOrderSizeByDayOfWeekStats } from "./models";
import { dbRowToOrderModel } from "./transforms";

export async function getAllOrders(): Promise<Order[]> {
  const results = await pool.query('SELECT * FROM "order"');
  return results.rows.map(dbRowToOrderModel);
}

function getAverageOrderAmountForDayOfWeekFromRows(
  dayOfWeek: number,
  rows: any[]
) {
  const row = rows.find((x) => x.dayOfWeek === dayOfWeek);
  return row ? (row.averageOrderAmount as number) : 0;
}

export async function getAvgOrderAmountByDay(): Promise<
  AverageOrderSizeByDayOfWeekStats
> {
  const results = await pool.query(`
    SELECT
      CAST(ROUND(AVG(amount_cents)) AS INT) AS "averageOrderAmount",
      DATE_PART('dow', created_at) AS "dayOfWeek"
    FROM "order"
    GROUP BY DATE_PART('dow', created_at)
  `);

  return {
    sunday: getAverageOrderAmountForDayOfWeekFromRows(0, results.rows),
    monday: getAverageOrderAmountForDayOfWeekFromRows(1, results.rows),
    tuesday: getAverageOrderAmountForDayOfWeekFromRows(2, results.rows),
    wednesday: getAverageOrderAmountForDayOfWeekFromRows(3, results.rows),
    thursday: getAverageOrderAmountForDayOfWeekFromRows(4, results.rows),
    friday: getAverageOrderAmountForDayOfWeekFromRows(5, results.rows),
    saturday: getAverageOrderAmountForDayOfWeekFromRows(6, results.rows),
  };
}

export async function createOrder(order: Order): Promise<void> {
  await pool.query(
    `
    INSERT INTO "order"
    (id, created_at, amount_cents, risk_score)
    VALUES
    ($1, $2, $3, $4)
  `,
    [order.id, order.createdAt, order.amountCents, order.riskScore]
  );
}

export async function getOrderById(orderId: string): Promise<Order> {
  const result = await pool.query(`SELECT * FROM "order" WHERE id = $1`, [
    orderId,
  ]);
  return dbRowToOrderModel(result.rows[0]);
}

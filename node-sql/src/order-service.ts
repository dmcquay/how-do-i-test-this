import { pool } from "./database-service";

export async function getAllOrders() {
  const results = await pool.query('SELECT * FROM "order"');
  return results.rows;
}

export async function getAvgOrderAmountByDay() {
  // ROUND(AVG(amount_cents))
  const results = await pool.query(`
  SELECT CAST(ROUND(AVG(amount_cents)) AS INT) AS "averageOrderAmount", DATE_PART('dow', created_at) AS "dayOfWeek" FROM "order"
  GROUP BY DATE_PART('dow', created_at)`);
  console.log(results.rows);
  return results.rows;
  // const dayofWeek = results.rows

  // 0 => sunday
  // 1 => monday
  // 4 => thursday
  // 5 => friday
}

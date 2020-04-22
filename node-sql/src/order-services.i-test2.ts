import { expect } from "chai";

import { getAllOrders, getAvgOrderAmountByDay } from "./order-service";
import { pool } from "./database-service";

describe("order-services", () => {
  before(async () => {
    await pool.query(`
      INSERT INTO "order"
      (id, amount_cents, created_at)
      VALUES
      ('id-1', 1256, '2020-04-10'),
      ('id-2', 5489, '2020-04-02'),
      ('id-3', 625, '2020-04-03'),
      ('id-3', 1625, '2020-04-05')
    `);
  });

  after(async () => {
    await pool.query('DELETE FROM "order"');
  });

  describe("#getAllOrders", () => {
    it("returns a list of all orders", async () => {
      const orderList = await getAllOrders();
      expect(orderList).to.have.lengthOf(4);
    });
  });

  describe("#getAvgOrderAmountByDay", () => {
    it("returns the avg amount per weekly day", async () => {
      const weeklyList = await getAvgOrderAmountByDay();

      expect(weeklyList).to.eql({
        sunday: 1625,
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 5489,
        friday: 941,
        saturday: 0,
      });
    });
  });
});

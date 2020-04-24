import { expect } from "chai";
import * as uuid from "uuid";

import {
  getAllOrders,
  getAvgOrderAmountByDay,
  createOrder,
  getOrderById,
} from "./order-repository";
import { pool } from "./database-service";
import { OrderModel, AverageOrderSizeByDayOfWeekStatsRecord } from "./models";

describe("order-repository", () => {
  describe("CRUD", () => {
    after(async () => {
      await pool.query('DELETE FROM "order"');
    });

    const order: OrderModel = {
      id: uuid.v4(),
      createdAt: new Date(),
      amountCents: 1234,
      riskScore: 34,
    };

    it("should create order", async () => {
      await createOrder(order);
    });

    it("should be able to read the order created", async () => {
      const orderFromDb = await getOrderById(order.id);
      expect(orderFromDb).to.eql(order);
    });
  });

  describe("#getAllOrders", () => {
    before(async () => {
      await pool.query(`
        INSERT INTO "order"
        (id, amount_cents, created_at, risk_score)
        VALUES
        ('id-1', 1256, '2020-04-10', 22),
        ('id-2', 5489, '2020-04-02', 12),
        ('id-3', 625, '2020-04-03', 55),
        ('id-3', 1625, '2020-04-05', 66)
      `);
    });

    after(async () => {
      await pool.query('DELETE FROM "order"');
    });

    it("returns a list of all orders", async () => {
      const orders = await getAllOrders();
      expect(orders).to.have.lengthOf(4);
      const order = orders.find((x) => x.id === "id-1");
      expect(order.id).to.equal("id-1");
      expect(order.amountCents).to.equal(1256);
      expect(order.createdAt).to.be.instanceOf(Date);
      expect(order.createdAt.toISOString).to.eql(
        new Date("2020-04-10").toISOString
      );
      expect(order.riskScore).to.equal(22);
    });
  });

  describe("#getAvgOrderAmountByDay", () => {
    before(async () => {
      await pool.query(`
        INSERT INTO "order"
        (id, amount_cents, created_at, risk_score)
        VALUES
        ('id-1', 1256, '2020-04-10', 22),
        ('id-2', 5489, '2020-04-02', 12),
        ('id-3', 625, '2020-04-03', 55),
        ('id-3', 1625, '2020-04-05', 66)
      `);
    });

    after(async () => {
      await pool.query('DELETE FROM "order"');
    });

    it("returns the avg amount per weekly day", async () => {
      const expectedRecords: AverageOrderSizeByDayOfWeekStatsRecord[] = [
        { dayOfWeek: 0, averageOrderAmount: 1625 },
        { dayOfWeek: 4, averageOrderAmount: 5489 },
        { dayOfWeek: 5, averageOrderAmount: 941 },
      ];

      const actualRecords = await getAvgOrderAmountByDay();

      expect(actualRecords).to.eql(expectedRecords);
    });
  });
});

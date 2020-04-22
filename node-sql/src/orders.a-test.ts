import fetch, { Response } from "node-fetch";
import { expect } from "chai";
import { Order } from "./models";

describe("orders acceptance tests", () => {
  describe("GET /orders", () => {
    let response: Response;
    let data: any;

    before(async () => {
      response = await fetch("http://localhost:3000/orders");
      data = await response.text();
    });

    it("should return a 200 status", () => {
      expect(response.status).to.equal(200);
    });

    it("should return JSON encoded data", () => {
      expect(response.headers.get("content-type")).to.equal(
        "application/json; charset=utf-8"
      );
      expect(() => JSON.parse(data)).to.not.throw;
    });

    it("should return a list of orders", async () => {
      const orders = JSON.parse(data);
      expect(orders).to.be.instanceOf(Array);
      const firstOrder = orders[0] as Order;
      expect(typeof firstOrder.amountCents).to.equal("number");
      expect(typeof firstOrder.createdAt).to.equal("string");
      expect(typeof firstOrder.id).to.equal("string");
    });
  });

  describe("GET /order-stats", () => {
    let response: Response;
    let data: any;

    before(async () => {
      response = await fetch("http://localhost:3000/order-stats");
      data = await response.text();
    });

    it("should return a 200 status", () => {
      expect(response.status).to.equal(200);
    });

    it("should return JSON encoded data", () => {
      expect(response.headers.get("content-type")).to.equal(
        "application/json; charset=utf-8"
      );
      expect(() => JSON.parse(data)).to.not.throw;
    });

    it("should return an object with a key for each day and all the values are numbers", async () => {
      const stats = JSON.parse(data);
      const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      days.forEach((d: string) => expect(typeof stats[d]).to.equal("number"));
      expect(Object.keys(stats).length).to.equal(days.length);
    });
  });
});

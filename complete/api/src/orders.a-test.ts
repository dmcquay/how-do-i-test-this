import fetch, { Response } from "node-fetch";
import { expect } from "chai";
import { assertISODate } from "@elunic/is-iso-date";

import { OrderModel, CreateOrderRequest } from "./models";
import config from "./config";

describe("orders acceptance tests", () => {
  describe("CRUD", () => {
    let orderUri: string;

    it("should response succefully to a well-formed order create request", async () => {
      const createOrderRequest: CreateOrderRequest = {
        amountCents: 489,
      };

      const createResult = await fetch(`${config.test.baseUrl}/orders`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(createOrderRequest),
        redirect: "manual",
      });

      expect(createResult.status).to.equal(303);
      expect(createResult.headers.get("location")).to.match(/\/orders\/.+/);

      orderUri = createResult.headers.get("location");
    });

    it("should be able to subsequently fetch the created order", async () => {
      const response = await fetch(orderUri);
      const orderId = orderUri.split("/").reverse()[0];

      expect(response.status).to.equal(200);

      const data = await response.json();

      expect(data.amountCents).to.equal(489);
      expect(data.id).to.equal(orderId);
      assertISODate(data.createdAt);
      expect(typeof data.riskScore).to.equal("number");
    });
  });

  describe("POST /orders", () => {
    context("when body is malformed", () => {
      it("should return a 400", async () => {
        const createResult = await fetch(`${config.test.baseUrl}/orders`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: '{"foo": "bar"}',
          redirect: "manual",
        });

        expect(createResult.status).to.equal(400);
      });
    });
  });

  describe("GET /orders", () => {
    let response: Response;
    let data: any;

    before(async () => {
      response = await fetch(`${config.test.baseUrl}/orders`);
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
      const firstOrder = orders[0] as OrderModel;
      expect(typeof firstOrder.amountCents).to.equal("number");
      expect(typeof firstOrder.createdAt).to.equal("string");
      expect(typeof firstOrder.id).to.equal("string");
    });
  });

  describe("GET /order-stats", () => {
    let response: Response;
    let data: any;

    before(async () => {
      response = await fetch(`${config.test.baseUrl}/order-stats`);
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

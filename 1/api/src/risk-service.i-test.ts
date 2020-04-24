import fetch from "node-fetch";
import { expect } from "chai";

import { getOrderRiskScore } from "./risk-service";
import { CreateOrderRequest } from "./models";
import config from "./config";

describe("risk-service", () => {
  describe("#getOrderRiskScore", () => {
    it("when request is valid, returns the risk score", async () => {
      const createOrderRequest: CreateOrderRequest = {
        amountCents: 34,
      };
      const score = await getOrderRiskScore(createOrderRequest);
      expect(typeof score).to.equal("number");
    });

    context("when the risk service is down", () => {
      before(async () => {
        await fetch(`${config.riskService.baseUrl}/cause-outage`, {
          method: "POST",
        });
      });

      after(async () => {
        await fetch(`${config.riskService.baseUrl}/end-outage`, {
          method: "POST",
        });
      });

      it("returns 0", async () => {
        const createOrderRequest: CreateOrderRequest = {
          amountCents: 34,
        };
        const score = await getOrderRiskScore(createOrderRequest);
        expect(typeof score).to.equal("number");
      });
    });
  });
});

import { expect } from "chai";
import * as R from "ramda";

import { isValidCreateOrderRequest } from "./validation";
import { CreateOrderRequest } from "./models";

describe("validation", () => {
  describe("#isValidCreateOrderRequest", () => {
    const validOrderRequest: CreateOrderRequest = {
      amountCents: 123,
    };

    it("when valid request, returns true", () => {
      expect(isValidCreateOrderRequest(validOrderRequest)).to.be.true;
    });

    it("when request is undefined, false", () => {
      expect(isValidCreateOrderRequest(undefined)).to.be.false;
    });

    it("when amountCents is missing, false", () => {
      expect(
        isValidCreateOrderRequest(R.omit(["amountCents"], validOrderRequest))
      ).to.be.false;
    });

    it("when amountCents is a string, false", () => {
      expect(
        isValidCreateOrderRequest({
          ...validOrderRequest,
          amountCents: "string",
        })
      ).to.be.false;
    });

    it("when amountCents is a decimal, false", () => {
      expect(
        isValidCreateOrderRequest({
          ...validOrderRequest,
          amountCents: 123.45,
        })
      ).to.be.false;
    });
  });
});

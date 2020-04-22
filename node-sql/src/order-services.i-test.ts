import { expect } from "chai";

import { getAllOrders, getAvgOrderAmountByDay } from "./order-service";

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

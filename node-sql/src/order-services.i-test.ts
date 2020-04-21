import { expect } from "chai";

import { getAllOrders, getAvgOrderAmountByDay } from "./order-service";

describe("#getAllOrders", () => {
  it("returns a list of all orders", async () => {
    const orderList = await getAllOrders();
    expect(orderList).to.have.lengthOf(4);
  });
});

it("returns the avg amount per weekly day", async () => {
  const weeklyList = await getAvgOrderAmountByDay();

  expect(weeklyList).to.eql([
    { averageOrderAmount: 1625, dayOfWeek: 0 },
    { averageOrderAmount: 941, dayOfWeek: 5 },
    { averageOrderAmount: 5489, dayOfWeek: 4 },
  ]);
});

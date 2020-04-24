import { expect } from "chai";

import { AverageOrderSizeByDayOfWeekStatsRecord } from "./models";

import { averageOrderSizeByDayOfWeekRecordsToModel } from "./transforms";

describe("transforms", () => {
  describe("#averageOrderSizeByDayOfWeekRecordsToModel", () => {
    context("when out of order and missing some data", () => {
      it("should map all values correctly and default to 0", () => {});
      const records: AverageOrderSizeByDayOfWeekStatsRecord[] = [
        {
          dayOfWeek: 0,
          averageOrderAmount: 10,
        },
        {
          dayOfWeek: 1,
          averageOrderAmount: 11,
        },
        {
          dayOfWeek: 3,
          averageOrderAmount: 13,
        },
        {
          dayOfWeek: 2,
          averageOrderAmount: 12,
        },
        {
          dayOfWeek: 4,
          averageOrderAmount: 14,
        },
        {
          dayOfWeek: 6,
          averageOrderAmount: 16,
        },
      ];

      const expectedModel = {
        sunday: 10,
        monday: 11,
        tuesday: 12,
        wednesday: 13,
        thursday: 14,
        friday: 0,
        saturday: 16,
      };

      const actualModel = averageOrderSizeByDayOfWeekRecordsToModel(records);

      expect(actualModel).to.eql(expectedModel);
    });
  });
});

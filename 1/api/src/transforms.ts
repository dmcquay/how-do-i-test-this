import * as uuid from "uuid";

import {
  OrderModel,
  CreateOrderRequest,
  AverageOrderSizeByDayOfWeekStatsModel,
  AverageOrderSizeByDayOfWeekStatsRecord,
} from "./models";

export function dbRowToOrderModel(row: any): OrderModel {
  return {
    id: row.id,
    amountCents: row.amount_cents,
    createdAt: row.created_at,
    riskScore: row.risk_score,
  };
}

export function createOrderRequestToOrderModel(
  req: CreateOrderRequest,
  riskScore: number
): OrderModel {
  return {
    id: uuid.v4(),
    createdAt: new Date(),
    amountCents: req.amountCents,
    riskScore,
  };
}

function getAverageOrderAmountForDayOfWeekFromRows(
  dayOfWeek: number,
  rows: any[]
) {
  const row = rows.find((x) => x.dayOfWeek === dayOfWeek);
  return row ? (row.averageOrderAmount as number) : 0;
}

export function averageOrderSizeByDayOfWeekRecordsToModel(
  records: AverageOrderSizeByDayOfWeekStatsRecord[]
): AverageOrderSizeByDayOfWeekStatsModel {
  return {
    sunday: getAverageOrderAmountForDayOfWeekFromRows(0, records),
    monday: getAverageOrderAmountForDayOfWeekFromRows(1, records),
    tuesday: getAverageOrderAmountForDayOfWeekFromRows(2, records),
    wednesday: getAverageOrderAmountForDayOfWeekFromRows(3, records),
    thursday: getAverageOrderAmountForDayOfWeekFromRows(4, records),
    friday: getAverageOrderAmountForDayOfWeekFromRows(5, records),
    saturday: getAverageOrderAmountForDayOfWeekFromRows(6, records),
  };
}

import * as orderRepo from "./order-repository";
import { averageOrderSizeByDayOfWeekRecordsToModel } from "./transforms";

export async function getAvgOrderAmountByDay() {
  const records = await orderRepo.getAvgOrderAmountByDay();
  const model = averageOrderSizeByDayOfWeekRecordsToModel(records);
  return model;
}

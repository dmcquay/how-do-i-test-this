export interface CreateOrderRequest {
  amountCents: number;
}

export interface OrderModel {
  id: string;
  amountCents: number;
  createdAt: Date;
  riskScore: number;
}

export interface AverageOrderSizeByDayOfWeekStatsModel {
  sunday: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
}

export interface AverageOrderSizeByDayOfWeekStatsRecord {
  averageOrderAmount: number;
  dayOfWeek: number;
}

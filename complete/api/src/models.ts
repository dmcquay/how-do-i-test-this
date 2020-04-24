export interface CreateOrderRequest {
  amountCents: number;
}

export interface Order {
  id: string;
  amountCents: number;
  createdAt: Date;
  riskScore: number;
}

export interface AverageOrderSizeByDayOfWeekStats {
  sunday: number;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
}

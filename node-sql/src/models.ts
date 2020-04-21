export interface Order {
  id: string;
  amountCents: number;
  createdAt: Date;
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

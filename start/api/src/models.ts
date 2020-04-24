export interface CreateOrderRequest {
  amountCents: number;
}

export interface OrderModel {
  id: string;
  amountCents: number;
  createdAt: Date;
  riskScore: number;
}

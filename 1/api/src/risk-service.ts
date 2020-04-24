import fetch from "node-fetch";

import { CreateOrderRequest } from "./models";
import config from "./config";

export async function getOrderRiskScore(
  createOrderRequest: CreateOrderRequest
): Promise<number> {
  const response = await fetch(
    `${config.riskService.baseUrl}/calculate-order-risk`,
    {
      method: "POST",
      body: JSON.stringify(createOrderRequest),
      headers: {
        "content-type": "application/json",
      },
    }
  );

  if (response.status !== 200) {
    return 0;
  }

  const data = await response.json();

  return data.score;
}

const e = process.env;

export default {
  port: e.PORT ? parseInt(e.PORT) : 3000,
  postgres: {
    user: "app",
    host: "localhost",
    database: e.POSTGRES_DATABASE || "order_management",
    password: "password",
    port: 5432,
  },
  riskService: {
    baseUrl: e.RISK_SERVICE_BASE_URL || "http://localhost:3001/risk",
  },
  test: {
    baseUrl: e.BASE_URL || "http://localhost:3000",
  },
};

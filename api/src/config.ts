const e = process.env;

export default {
  postgres: {
    user: "app",
    host: "localhost",
    database: "test",
    password: "password",
    port: parseInt(e.POSTGRES_PORT) || 5432,
  },
  riskService: {
    baseUrl: e.RISK_SERVICE_BASE_URL || "http://localhost:3001/risk",
  },
};

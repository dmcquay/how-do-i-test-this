const e = process.env;

export default {
    port: e.PORT ? parseInt(e.PORT) : 3000,
    postgres: {
        user: undefined,
        host: "localhost",
        database: "order_management",
        password: undefined,
        port: parseInt(e.POSTGRES_PORT) || 5432,
    },
    riskService: {
        baseUrl: e.RISK_SERVICE_BASE_URL || "http://localhost:3001/risk",
    },
};

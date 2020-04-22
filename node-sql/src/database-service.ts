import { Pool } from "pg";

const e = process.env;

export const pool = new Pool({
  user: "app",
  host: "localhost",
  database: "test",
  password: "password",
  port: parseInt(e.POSTGRES_PORT) || 5432,
});

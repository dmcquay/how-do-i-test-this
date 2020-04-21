import { Pool } from "pg";

export const pool = new Pool({
  user: "app",
  host: "localhost",
  database: "test",
  password: "password",
  port: 5432,
});

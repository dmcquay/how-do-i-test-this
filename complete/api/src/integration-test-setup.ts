import { pool } from "./database-service";

after(() => {
  pool.end();
});

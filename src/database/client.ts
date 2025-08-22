import { drizzle } from "drizzle-orm/node-postgres";

const connectionString =
  process.env.DATABASE_URL ??
  (process.env.NODE_ENV === "test"
    ? "postgres://postgres:postgres@localhost:5432/desafio_test"
    : undefined);

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

export const db = drizzle(connectionString, {
  logger: process.env.NODE_ENV === "development",
});
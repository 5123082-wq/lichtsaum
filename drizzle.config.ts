import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL_UNPOOLED) {
  process.loadEnvFile(".env");
}

const databaseUrl = process.env.DATABASE_URL_UNPOOLED?.trim();

if (!databaseUrl) {
  throw new Error("DATABASE_URL_UNPOOLED is required for database migrations.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: databaseUrl
  },
  strict: true,
  verbose: true
});

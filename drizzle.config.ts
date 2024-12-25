import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  out: "./drizzle", // Folder where migration files will be output
  schema: "./src/db/schema.ts", // Path to your schema file
  dialect: "postgresql", // Use PostgreSQL dialect
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Use the database URL from the environment
    ssl: { rejectUnauthorized: false },
  },
});

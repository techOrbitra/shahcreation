import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { relations } from "drizzle-orm";
import * as schema from "./schema/index.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env");
}

const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString);

export const db = drizzle(client, { schema });

// Relations
export const clothesRelations = relations(schema.clothes, ({ many }) => ({
  clothesToCategories: many(schema.clothesToCategories),
}));

export const categoriesRelations = relations(schema.categories, ({ many }) => ({
  clothesToCategories: many(schema.clothesToCategories),
}));

export const clothesToCategoriesRelations = relations(
  schema.clothesToCategories,
  ({ one }) => ({
    cloth: one(schema.clothes, {
      fields: [schema.clothesToCategories.clothId],
      references: [schema.clothes.id],
    }),
    category: one(schema.categories, {
      fields: [schema.clothesToCategories.categoryId],
      references: [schema.categories.id],
    }),
  })
);

export * from "./schema/index.js";
export default db;

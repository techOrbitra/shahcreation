import {
  pgTable,
  serial,
  varchar,
  integer,
  text,
  timestamp,
  json,
  boolean,
} from "drizzle-orm/pg-core";
import { categories } from "./categories.schema.js";

export const clothes = pgTable("clothes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  oldPrice: integer("old_price"),
  images: json("images").default([]).notNull(),
  material: varchar("material", { length: 100 }),
  sizes: json("sizes").default(["S", "M", "L", "XL", "XXL"]),
  fitType: varchar("fit_type", { length: 50 }),
  careInstructions: text("care_instructions"),
  origin: varchar("origin", { length: 100 }).default("India"),
  warranty: varchar("warranty", { length: 100 }),
  stock: integer("stock").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const clothesToCategories = pgTable("clothes_to_categories", {
  id: serial("id").primaryKey(),
  clothId: integer("cloth_id")
    .notNull()
    .references(() => clothes.id, { onDelete: "cascade" }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
});

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

// Universal Products Table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  oldPrice: integer("old_price"),
  images: json("images").default([]).notNull(), // Array of Cloudinary URLs

  // Product Type (clothes, bedsheets, shoes, etc.)
  productType: varchar("product_type", { length: 50 })
    .notNull()
    .default("clothes"),

  // Dynamic attributes stored as JSON
  attributes: json("attributes").default({}).notNull(),
  // Example attributes structure:
  // For clothes: { material: "Cotton", sizes: ["S","M","L"], fitType: "Regular", careInstructions: "..." }
  // For bedsheets: { threadCount: 300, material: "Cotton", sizes: ["Single","Double","King"] }
  // For shoes: { sizes: [6,7,8,9], color: "Black", material: "Leather" }

  // Common fields
  brand: varchar("brand", { length: 100 }),
  origin: varchar("origin", { length: 100 }).default("India"),
  warranty: varchar("warranty", { length: 100 }),
  stock: integer("stock").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),

  // Metadata
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Product to Categories relationship
export const productsToCategories = pgTable("products_to_categories", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
});

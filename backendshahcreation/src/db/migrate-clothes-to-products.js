// /scripts/migrate-clothes-to-products.js
import { db } from "../db/index.js";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import {
  clothes,
  products,
  clothesToCategories,
  productsToCategories,
} from "../db/schema/index.js";

async function createProductsTableIfNotExists() {
  try {
    console.log("Checking if products table exists...");

    // Create products table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        old_price INTEGER,
        images JSON DEFAULT '[]'::json NOT NULL,
        product_type VARCHAR(50) NOT NULL DEFAULT 'clothes',
        attributes JSON DEFAULT '{}'::json NOT NULL,
        brand VARCHAR(100),
        origin VARCHAR(100) DEFAULT 'India',
        warranty VARCHAR(100),
        stock INTEGER DEFAULT 0 NOT NULL,
        is_active BOOLEAN DEFAULT true NOT NULL,
        is_featured BOOLEAN DEFAULT false NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log("Products table created/verified successfully");

    // Create products_to_categories table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS products_to_categories (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL,
        category_id INTEGER NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      );
    `);

    console.log("Products_to_categories table created/verified successfully");

    // Create indexes for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_products_to_categories_product ON products_to_categories(product_id);
    `);

    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_products_to_categories_category ON products_to_categories(category_id);
    `);

    console.log("Indexes created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
}

async function checkIfDataAlreadyMigrated() {
  try {
    const existingProducts = await db.select().from(products).limit(1);
    return existingProducts.length > 0;
  } catch (error) {
    return false;
  }
}

async function migrateClothesToProducts() {
  try {
    console.log("=== Starting Clothes to Products Migration ===\n");

    // Step 1: Create tables
    await createProductsTableIfNotExists();

    // Step 2: Check if already migrated
    const alreadyMigrated = await checkIfDataAlreadyMigrated();
    if (alreadyMigrated) {
      console.log("\n⚠️  Products table already contains data.");
      console.log(
        "Do you want to continue and migrate clothes data anyway? (This may create duplicates)"
      );
      console.log("To proceed, comment out this check in the script.\n");
      return;
    }

    // Step 3: Get all clothes
    console.log("\nFetching clothes data...");
    const allClothes = await db.select().from(clothes);

    if (allClothes.length === 0) {
      console.log("No clothes found to migrate.");
      return;
    }

    console.log(`Found ${allClothes.length} clothes to migrate.\n`);

    // Step 4: Migrate each cloth
    let successCount = 0;
    let errorCount = 0;

    for (const cloth of allClothes) {
      try {
        // Check if slug already exists
        const existingProduct = await db
          .select()
          .from(products)
          .where(eq(products.slug, cloth.slug))
          .limit(1);

        if (existingProduct.length > 0) {
          console.log(`⚠️  Skipping: ${cloth.name} (slug already exists)`);
          continue;
        }

        // Insert into products table
        const [newProduct] = await db
          .insert(products)
          .values({
            name: cloth.name,
            slug: cloth.slug,
            description: cloth.description,
            price: cloth.price,
            oldPrice: cloth.oldPrice,
            images: cloth.images,
            productType: "clothes",
            attributes: {
              material: cloth.material,
              sizes: cloth.sizes,
              fitType: cloth.fitType,
              careInstructions: cloth.careInstructions,
            },
            origin: cloth.origin,
            warranty: cloth.warranty,
            stock: cloth.stock,
            isActive: cloth.isActive,
            isFeatured: cloth.isFeatured,
            createdAt: cloth.createdAt,
            updatedAt: cloth.updatedAt,
          })
          .returning();

        // Get categories for this cloth
        const categories = await db
          .select()
          .from(clothesToCategories)
          .where(eq(clothesToCategories.clothId, cloth.id));

        // Insert into productsToCategories
        if (categories.length > 0) {
          await db.insert(productsToCategories).values(
            categories.map((cat) => ({
              productId: newProduct.id,
              categoryId: cat.categoryId,
            }))
          );
        }

        successCount++;
        console.log(
          `✅ Migrated: ${cloth.name} (${categories.length} categories)`
        );
      } catch (error) {
        errorCount++;
        console.error(`❌ Failed to migrate: ${cloth.name}`, error.message);
      }
    }

    // Summary
    console.log("\n=== Migration Summary ===");
    console.log(`Total clothes: ${allClothes.length}`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Failed: ${errorCount}`);
    console.log("=========================\n");

    if (successCount > 0) {
      console.log("✅ Migration completed successfully!");
      console.log("\nNext steps:");
      console.log("1. Verify the migrated data in the products table");
      console.log("2. Update your API routes to use products endpoints");
      console.log("3. Update frontend to use products store");
      console.log(
        "4. (Optional) Once verified, you can drop the clothes table\n"
      );
    }
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run migration
migrateClothesToProducts();

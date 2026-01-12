import { db } from "../db/index.js";
import {
  products,
  productsToCategories,
  categories,
} from "../db/schema/index.js";
import { eq, ilike, and, gte, lte, inArray, sql } from "drizzle-orm";
import {
  uploadMultipleImages,
  deleteImageFromCloudinary,
} from "../utils/uploadImage.js";

// Upload images to Cloudinary
// In /controllers/products.controller.js
export const uploadProductImages = async (req, res) => {
  try {
    console.log("Upload request received");
    console.log("Files:", req.files?.length);
    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? "Set" : "Not set",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Not set",
    });

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No images provided" });
    }

    const buffers = req.files.map((file) => file.buffer);
    const imageUrls = await uploadMultipleImages(buffers, "products");

    res.status(200).json({
      success: true,
      data: imageUrls,
      message: "Images uploaded successfully",
    });
  } catch (error) {
    console.error("Upload images error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload images",
    });
  }
};
// get all categories (Public)
// Get all categories (Public) - ADD THIS TO YOUR CONTROLLER
export const getCategories = async (req, res) => {
  try {
    const allCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      })
      .from(categories)
      .orderBy(categories.name);

    res.status(200).json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all products with pagination & filters (Public)
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = "",
      category = "",
      productType = "",
      minPrice = 0,
      maxPrice = 1000000,
      sort = "newest",
      featured = "",
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const conditions = [eq(products.isActive, true)];

    // Search filter
    if (search) {
      conditions.push(
        sql`(${products.name} ILIKE ${`%${search}%`} OR ${
          products.description
        } ILIKE ${`%${search}%`})`
      );
    }

    // Product type filter
    if (productType) {
      conditions.push(eq(products.productType, productType));
    }

    // Price filter
    if (minPrice) conditions.push(gte(products.price, Number(minPrice)));
    if (maxPrice) conditions.push(lte(products.price, Number(maxPrice)));

    // Featured filter
    if (featured === "true") {
      conditions.push(eq(products.isFeatured, true));
    }

    // Category filter
    // Category filter
    if (category && category !== "all") {
      const [cat] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, category))
        .limit(1);

      if (cat) {
        const productIds = await db
          .select({ productId: productsToCategories.productId })
          .from(productsToCategories)
          .where(eq(productsToCategories.categoryId, cat.id));

        const ids = productIds.map((p) => p.productId);
        if (ids.length > 0) {
          conditions.push(inArray(products.id, ids));
        } else {
          return res.status(200).json({
            success: true,
            data: [],
            pagination: { page: 1, limit: Number(limit), total: 0, pages: 0 },
          });
        }
      }
    }

    // Sorting
    let orderBy;
    switch (sort) {
      case "price-asc":
        orderBy = products.price;
        break;
      case "price-desc":
        orderBy = sql`${products.price} DESC`;
        break;
      case "name-asc":
        orderBy = products.name;
        break;
      case "name-desc":
        orderBy = sql`${products.name} DESC`;
        break;
      case "newest":
      default:
        orderBy = sql`${products.createdAt} DESC`;
        break;
    }

    // Get total count
    const [{ count }] = await db
      .select({ count: sql`count(*)` })
      .from(products)
      .where(and(...conditions));

    // Get paginated results
    const results = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(Number(limit))
      .offset(offset);

    // Get categories for each product
    const productsWithCategories = await Promise.all(
      results.map(async (product) => {
        const productCategories = await db
          .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
          })
          .from(productsToCategories)
          .innerJoin(
            categories,
            eq(productsToCategories.categoryId, categories.id)
          )
          .where(eq(productsToCategories.productId, product.id));

        return {
          ...product,
          categories: productCategories,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: productsWithCategories,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(count),
        pages: Math.ceil(Number(count) / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get single product by slug (Public)
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Get categories
    const productCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      })
      .from(productsToCategories)
      .innerJoin(categories, eq(productsToCategories.categoryId, categories.id))
      .where(eq(productsToCategories.productId, product.id));

    res.status(200).json({
      success: true,
      data: { ...product, categories: productCategories },
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get product by ID (Admin)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(id)))
      .limit(1);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Get categories
    const productCategories = await db
      .select({ categoryId: productsToCategories.categoryId })
      .from(productsToCategories)
      .where(eq(productsToCategories.productId, product.id));

    res.status(200).json({
      success: true,
      data: {
        ...product,
        categoryIds: productCategories.map((c) => c.categoryId),
      },
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Create product (Admin)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      oldPrice,
      images,
      productType,
      attributes,
      brand,
      origin,
      warranty,
      stock,
      isActive,
      isFeatured,
      categoryIds,
    } = req.body;

    // Validation
    if (!name || !slug || !description || !price || !productType) {
      return res.status(400).json({
        success: false,
        message:
          "Name, slug, description, price, and product type are required",
      });
    }

    // Create product
    const [newProduct] = await db
      .insert(products)
      .values({
        name,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        description,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        images: images || [],
        productType,
        attributes: attributes || {},
        brand,
        origin: origin || "India",
        warranty,
        stock: stock ? Number(stock) : 0,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
      })
      .returning();

    // Add categories
    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      const categoryValues = categoryIds.map((catId) => ({
        productId: newProduct.id,
        categoryId: Number(catId),
      }));
      await db.insert(productsToCategories).values(categoryValues);
    }

    res.status(201).json({
      success: true,
      data: newProduct,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Create product error:", error);
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ success: false, message: "Product slug already exists" });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      price,
      oldPrice,
      images,
      productType,
      attributes,
      brand,
      origin,
      warranty,
      stock,
      isActive,
      isFeatured,
      categoryIds,
    } = req.body;

    const updateData = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug.toLowerCase().replace(/\s+/g, "-");
    if (description) updateData.description = description;
    if (price) updateData.price = Number(price);
    if (oldPrice !== undefined)
      updateData.oldPrice = oldPrice ? Number(oldPrice) : null;
    if (images) updateData.images = images;
    if (productType) updateData.productType = productType;
    if (attributes) updateData.attributes = attributes;
    if (brand) updateData.brand = brand;
    if (origin) updateData.origin = origin;
    if (warranty) updateData.warranty = warranty;
    if (stock !== undefined) updateData.stock = Number(stock);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const [updatedProduct] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, Number(id)))
      .returning();

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update categories if provided
    if (categoryIds && Array.isArray(categoryIds)) {
      await db
        .delete(productsToCategories)
        .where(eq(productsToCategories.productId, Number(id)));

      if (categoryIds.length > 0) {
        const categoryValues = categoryIds.map((catId) => ({
          productId: Number(id),
          categoryId: Number(catId),
        }));
        await db.insert(productsToCategories).values(categoryValues);
      }
    }

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(id)))
      .limit(1);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Delete images from Cloudinary
    if (product.images && Array.isArray(product.images)) {
      for (const imageUrl of product.images) {
        try {
          await deleteImageFromCloudinary(imageUrl);
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }
    }

    await db.delete(products).where(eq(products.id, Number(id)));

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Bulk delete products (Admin)
export const bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Product IDs array required" });
    }

    for (const id of ids) {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, Number(id)))
        .limit(1);

      if (product && product.images) {
        for (const imageUrl of product.images) {
          try {
            await deleteImageFromCloudinary(imageUrl);
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        }
      }

      await db.delete(products).where(eq(products.id, Number(id)));
    }

    res.status(200).json({
      success: true,
      message: `${ids.length} products deleted successfully`,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Toggle featured status
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    const [updatedProduct] = await db
      .update(products)
      .set({ isFeatured, updatedAt: new Date() })
      .where(eq(products.id, Number(id)))
      .returning();

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Featured status updated",
    });
  } catch (error) {
    console.error("Toggle featured error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update stock
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Stock value required" });
    }

    const [updatedProduct] = await db
      .update(products)
      .set({ stock: Number(stock), updatedAt: new Date() })
      .where(eq(products.id, Number(id)))
      .returning();

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Stock updated successfully",
    });
  } catch (error) {
    console.error("Update stock error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get related products
export const getRelatedProducts = async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 4 } = req.query;

    const [currentProduct] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (!currentProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const currentCategories = await db
      .select({ categoryId: productsToCategories.categoryId })
      .from(productsToCategories)
      .where(eq(productsToCategories.productId, currentProduct.id));

    const categoryIds = currentCategories.map((c) => c.categoryId);

    if (categoryIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const relatedProductIds = await db
      .select({ productId: productsToCategories.productId })
      .from(productsToCategories)
      .where(inArray(productsToCategories.categoryId, categoryIds));

    const relatedIds = [
      ...new Set(relatedProductIds.map((p) => p.productId)),
    ].filter((id) => id !== currentProduct.id);

    if (relatedIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const relatedProducts = await db
      .select()
      .from(products)
      .where(and(inArray(products.id, relatedIds), eq(products.isActive, true)))
      .limit(Number(limit));

    res.status(200).json({ success: true, data: relatedProducts });
  } catch (error) {
    console.error("Get related products error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

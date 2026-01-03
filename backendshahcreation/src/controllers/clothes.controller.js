import { db } from '../db/index.js';
import { clothes, clothesToCategories, categories } from '../db/schema/index.js';
import { eq, ilike, and, gte, lte, inArray, sql } from 'drizzle-orm';

// Get all clothes with pagination & filters (Public)
export const getAllClothes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      category = '',
      minPrice = 0,
      maxPrice = 1000000,
      sort = 'newest',
      featured = '',
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const conditions = [eq(clothes.isActive, true)];

    // Search filter
    if (search) {
      conditions.push(
        sql`(${clothes.name} ILIKE ${`%${search}%`} OR ${clothes.description} ILIKE ${`%${search}%`})`
      );
    }

    // Price filter
    if (minPrice) conditions.push(gte(clothes.price, Number(minPrice)));
    if (maxPrice) conditions.push(lte(clothes.price, Number(maxPrice)));

    // Featured filter
    if (featured === 'true') {
      conditions.push(eq(clothes.isFeatured, true));
    }

    // Build base query
    let query = db
      .select({
        id: clothes.id,
        name: clothes.name,
        slug: clothes.slug,
        description: clothes.description,
        price: clothes.price,
        oldPrice: clothes.oldPrice,
        images: clothes.images,
        stock: clothes.stock,
        isFeatured: clothes.isFeatured,
        createdAt: clothes.createdAt,
      })
      .from(clothes)
      .where(and(...conditions));

    // Category filter (requires join)
    if (category) {
      const [cat] = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, category))
        .limit(1);

      if (cat) {
        const clothIds = await db
          .select({ clothId: clothesToCategories.clothId })
          .from(clothesToCategories)
          .where(eq(clothesToCategories.categoryId, cat.id));

        const ids = clothIds.map((c) => c.clothId);
        if (ids.length > 0) {
          conditions.push(inArray(clothes.id, ids));
        } else {
          // No clothes in this category
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
      case 'price-asc':
        orderBy = clothes.price;
        break;
      case 'price-desc':
        orderBy = sql`${clothes.price} DESC`;
        break;
      case 'name-asc':
        orderBy = clothes.name;
        break;
      case 'name-desc':
        orderBy = sql`${clothes.name} DESC`;
        break;
      case 'newest':
      default:
        orderBy = sql`${clothes.createdAt} DESC`;
        break;
    }

    // Get total count
    const [{ count }] = await db
      .select({ count: sql`count(*)` })
      .from(clothes)
      .where(and(...conditions));

    // Get paginated results
    const results = await db
      .select({
        id: clothes.id,
        name: clothes.name,
        slug: clothes.slug,
        description: clothes.description,
        price: clothes.price,
        oldPrice: clothes.oldPrice,
        images: clothes.images,
        stock: clothes.stock,
        isFeatured: clothes.isFeatured,
        createdAt: clothes.createdAt,
      })
      .from(clothes)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(Number(limit))
      .offset(offset);

    // Get categories for each cloth
    const clothesWithCategories = await Promise.all(
      results.map(async (cloth) => {
        const clothCategories = await db
          .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
          })
          .from(clothesToCategories)
          .innerJoin(categories, eq(clothesToCategories.categoryId, categories.id))
          .where(eq(clothesToCategories.clothId, cloth.id));

        return {
          ...cloth,
          categories: clothCategories,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: clothesWithCategories,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: Number(count),
        pages: Math.ceil(Number(count) / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get clothes error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single cloth by slug (Public)
export const getClothBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const [cloth] = await db
      .select()
      .from(clothes)
      .where(eq(clothes.slug, slug))
      .limit(1);

    if (!cloth) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get categories
    const clothCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      })
      .from(clothesToCategories)
      .innerJoin(categories, eq(clothesToCategories.categoryId, categories.id))
      .where(eq(clothesToCategories.clothId, cloth.id));

    res.status(200).json({
      success: true,
      data: { ...cloth, categories: clothCategories },
    });
  } catch (error) {
    console.error('Get cloth error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get cloth by ID (Admin)
export const getClothById = async (req, res) => {
  try {
    const { id } = req.params;

    const [cloth] = await db
      .select()
      .from(clothes)
      .where(eq(clothes.id, Number(id)))
      .limit(1);

    if (!cloth) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get categories
    const clothCategories = await db
      .select({ categoryId: clothesToCategories.categoryId })
      .from(clothesToCategories)
      .where(eq(clothesToCategories.clothId, cloth.id));

    res.status(200).json({
      success: true,
      data: { ...cloth, categoryIds: clothCategories.map((c) => c.categoryId) },
    });
  } catch (error) {
    console.error('Get cloth error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create cloth (Admin)
export const createCloth = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      oldPrice,
      images,
      material,
      sizes,
      fitType,
      careInstructions,
      origin,
      warranty,
      stock,
      isActive,
      isFeatured,
      categoryIds,
    } = req.body;

    // Validation
    if (!name || !slug || !description || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, slug, description, and price are required',
      });
    }

    // Create cloth
    const [newCloth] = await db
      .insert(clothes)
      .values({
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        description,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        images: images || [],
        material,
        sizes: sizes || ['S', 'M', 'L', 'XL', 'XXL'],
        fitType,
        careInstructions,
        origin: origin || 'India',
        warranty,
        stock: stock ? Number(stock) : 0,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
      })
      .returning();

    // Add categories
    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      const categoryValues = categoryIds.map((catId) => ({
        clothId: newCloth.id,
        categoryId: Number(catId),
      }));
      await db.insert(clothesToCategories).values(categoryValues);
    }

    res.status(201).json({
      success: true,
      data: newCloth,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Create cloth error:', error);
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Product slug already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update cloth (Admin)
export const updateCloth = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      price,
      oldPrice,
      images,
      material,
      sizes,
      fitType,
      careInstructions,
      origin,
      warranty,
      stock,
      isActive,
      isFeatured,
      categoryIds,
    } = req.body;

    const updateData = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug.toLowerCase().replace(/\s+/g, '-');
    if (description) updateData.description = description;
    if (price) updateData.price = Number(price);
    if (oldPrice !== undefined) updateData.oldPrice = oldPrice ? Number(oldPrice) : null;
    if (images) updateData.images = images;
    if (material) updateData.material = material;
    if (sizes) updateData.sizes = sizes;
    if (fitType) updateData.fitType = fitType;
    if (careInstructions) updateData.careInstructions = careInstructions;
    if (origin) updateData.origin = origin;
    if (warranty) updateData.warranty = warranty;
    if (stock !== undefined) updateData.stock = Number(stock);
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const [updatedCloth] = await db
      .update(clothes)
      .set(updateData)
      .where(eq(clothes.id, Number(id)))
      .returning();

    if (!updatedCloth) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Update categories if provided
    if (categoryIds && Array.isArray(categoryIds)) {
      // Remove old relations
      await db.delete(clothesToCategories).where(eq(clothesToCategories.clothId, Number(id)));

      // Add new relations
      if (categoryIds.length > 0) {
        const categoryValues = categoryIds.map((catId) => ({
          clothId: Number(id),
          categoryId: Number(catId),
        }));
        await db.insert(clothesToCategories).values(categoryValues);
      }
    }

    res.status(200).json({
      success: true,
      data: updatedCloth,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('Update cloth error:', error);
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Product slug already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete cloth (Admin)
export const deleteCloth = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if exists
    const [cloth] = await db
      .select()
      .from(clothes)
      .where(eq(clothes.id, Number(id)))
      .limit(1);

    if (!cloth) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Delete (cascade will remove relations)
    await db.delete(clothes).where(eq(clothes.id, Number(id)));

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Delete cloth error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Bulk delete clothes (Admin)
export const bulkDeleteClothes = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Product IDs array required' });
    }

    for (const id of ids) {
      await db.delete(clothes).where(eq(clothes.id, Number(id)));
    }

    res.status(200).json({
      success: true,
      message: `${ids.length} products deleted successfully`,
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Toggle featured status (Admin)
export const toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    const [updatedCloth] = await db
      .update(clothes)
      .set({ isFeatured, updatedAt: new Date() })
      .where(eq(clothes.id, Number(id)))
      .returning();

    if (!updatedCloth) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      data: updatedCloth,
      message: 'Featured status updated',
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update stock (Admin)
export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({ success: false, message: 'Stock value required' });
    }

    const [updatedCloth] = await db
      .update(clothes)
      .set({ stock: Number(stock), updatedAt: new Date() })
      .where(eq(clothes.id, Number(id)))
      .returning();

    if (!updatedCloth) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      data: updatedCloth,
      message: 'Stock updated successfully',
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get related products (Public)
export const getRelatedClothes = async (req, res) => {
  try {
    const { slug } = req.params;
    const { limit = 4 } = req.query;

    // Get current product
    const [currentCloth] = await db
      .select()
      .from(clothes)
      .where(eq(clothes.slug, slug))
      .limit(1);

    if (!currentCloth) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get its categories
    const currentCategories = await db
      .select({ categoryId: clothesToCategories.categoryId })
      .from(clothesToCategories)
      .where(eq(clothesToCategories.clothId, currentCloth.id));

    const categoryIds = currentCategories.map((c) => c.categoryId);

    if (categoryIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Find clothes with same categories
    const relatedClothIds = await db
      .select({ clothId: clothesToCategories.clothId })
      .from(clothesToCategories)
      .where(inArray(clothesToCategories.categoryId, categoryIds));

    const relatedIds = [...new Set(relatedClothIds.map((c) => c.clothId))].filter(
      (id) => id !== currentCloth.id
    );

    if (relatedIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Get related products
    const relatedClothes = await db
      .select({
        id: clothes.id,
        name: clothes.name,
        slug: clothes.slug,
        description: clothes.description,
        price: clothes.price,
        oldPrice: clothes.oldPrice,
        images: clothes.images,
      })
      .from(clothes)
      .where(and(inArray(clothes.id, relatedIds), eq(clothes.isActive, true)))
      .limit(Number(limit));

    res.status(200).json({ success: true, data: relatedClothes });
  } catch (error) {
    console.error('Get related clothes error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

import { db } from '../db/index.js';
import { categories } from '../db/schema/index.js';
import { eq, ilike } from 'drizzle-orm';

export const getAllCategories = async (req, res) => {
  try {
    const { search } = req.query;

    let query = db.select().from(categories);

    if (search) {
      query = query.where(ilike(categories.name, `%${search}%`));
    }

    const allCategories = await query;

    res.status(200).json({
      success: true,
      data: allCategories,
      count: allCategories.length,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, Number(id)))
      .limit(1);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Name and slug are required' });
    }

    const [newCategory] = await db
      .insert(categories)
      .values({
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        description,
      })
      .returning();

    res.status(201).json({
      success: true,
      data: newCategory,
      message: 'Category created successfully',
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Category already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    const updateData = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug.toLowerCase().replace(/\s+/g, '-');
    if (description !== undefined) updateData.description = description;

    const [updatedCategory] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, Number(id)))
      .returning();

    if (!updatedCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully',
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Category already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(categories).where(eq(categories.id, Number(id)));

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

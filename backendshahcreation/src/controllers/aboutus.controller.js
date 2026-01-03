import { db } from '../db/index.js';
import { aboutPageContent } from '../db/schema/index.js';
import { eq } from 'drizzle-orm';

// Get About Page Content (Public)
export const getAboutPageContent = async (req, res) => {
  try {
    // Always get the first (and only) row
    const [content] = await db
      .select()
      .from(aboutPageContent)
      .limit(1);

    if (!content) {
      // Return default content if not found
      return res.status(200).json({
        success: true,
        data: {
          heroTitle: 'Shah Creation',
          heroSubtitle: 'Crafting luxury fashion since 2025',
          heroDescription: 'Where elegance meets innovation, and every piece tells a story.',
          missionTitle: 'Our Mission',
          missionText: 'To deliver premium fashion that empowers individuals to express their unique style and confidence.',
          visionTitle: 'Our Vision',
          visionText: 'To become the most trusted luxury fashion brand known for innovation, quality, and timeless elegance.',
          valuesTitle: 'Our Values',
          valuesText: 'Quality, integrity, and sustainability guide every decision we make in crafting your perfect style.',
          storyTitle: 'Our Legacy of Excellence',
          storyParagraph1: 'Shah Creation was born from a passion for timeless elegance and superior craftsmanship. Founded with a vision to revolutionize the luxury fashion industry, we believe that every piece should tell a story.',
          storyParagraph2: 'Every garment is meticulously designed and crafted to make you feel extraordinary. We combine traditional artistry with modern innovation, ensuring that each collection reflects the essence of contemporary luxury.',
          storyImageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca6e97?w=800',
          stats: {
            clients: '500+',
            collections: '50+',
            quality: '100%',
          },
          features: [
            {
              icon: 'Award',
              title: 'Premium Quality',
              description: 'Carefully selected materials for durability and comfort',
            },
            {
              icon: 'Users',
              title: 'Expert Team',
              description: 'Experienced designers committed to your satisfaction',
            },
            {
              icon: 'Sparkles',
              title: 'Unique Designs',
              description: 'Exclusive collections that set you apart',
            },
            {
              icon: 'Heart',
              title: 'Customer First',
              description: 'Your happiness is our top priority',
            },
            {
              icon: 'Zap',
              title: 'Fast Delivery',
              description: 'Quick and reliable shipping to your door',
            },
            {
              icon: 'Target',
              title: 'Best Prices',
              description: 'Luxury fashion at competitive rates',
            },
          ],
        },
      });
    }

    res.status(200).json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error('Get about page error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update About Page Content (Admin)
export const updateAboutPageContent = async (req, res) => {
  try {
    const {
      heroTitle,
      heroSubtitle,
      heroDescription,
      missionTitle,
      missionText,
      visionTitle,
      visionText,
      valuesTitle,
      valuesText,
      storyTitle,
      storyParagraph1,
      storyParagraph2,
      storyImageUrl,
      stats,
      features,
    } = req.body;

    // Check if content exists
    const [existing] = await db.select().from(aboutPageContent).limit(1);

    const updateData = { updatedAt: new Date() };
    if (heroTitle) updateData.heroTitle = heroTitle;
    if (heroSubtitle) updateData.heroSubtitle = heroSubtitle;
    if (heroDescription !== undefined) updateData.heroDescription = heroDescription;
    if (missionTitle) updateData.missionTitle = missionTitle;
    if (missionText) updateData.missionText = missionText;
    if (visionTitle) updateData.visionTitle = visionTitle;
    if (visionText) updateData.visionText = visionText;
    if (valuesTitle) updateData.valuesTitle = valuesTitle;
    if (valuesText) updateData.valuesText = valuesText;
    if (storyTitle) updateData.storyTitle = storyTitle;
    if (storyParagraph1) updateData.storyParagraph1 = storyParagraph1;
    if (storyParagraph2) updateData.storyParagraph2 = storyParagraph2;
    if (storyImageUrl) updateData.storyImageUrl = storyImageUrl;
    if (stats) updateData.stats = stats;
    if (features) updateData.features = features;

    let updatedContent;

    if (existing) {
      // Update existing
      [updatedContent] = await db
        .update(aboutPageContent)
        .set(updateData)
        .where(eq(aboutPageContent.id, existing.id))
        .returning();
    } else {
      // Create new (first time)
      [updatedContent] = await db
        .insert(aboutPageContent)
        .values(updateData)
        .returning();
    }

    res.status(200).json({
      success: true,
      data: updatedContent,
      message: 'About page content updated successfully',
    });
  } catch (error) {
    console.error('Update about page error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Hero Section (Admin)
export const updateHeroSection = async (req, res) => {
  try {
    const { heroTitle, heroSubtitle, heroDescription } = req.body;

    const [existing] = await db.select().from(aboutPageContent).limit(1);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'About page not initialized' });
    }

    const [updatedContent] = await db
      .update(aboutPageContent)
      .set({
        heroTitle,
        heroSubtitle,
        heroDescription,
        updatedAt: new Date(),
      })
      .where(eq(aboutPageContent.id, existing.id))
      .returning();

    res.status(200).json({
      success: true,
      data: updatedContent,
      message: 'Hero section updated successfully',
    });
  } catch (error) {
    console.error('Update hero error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Mission/Vision/Values (Admin)
export const updateMVV = async (req, res) => {
  try {
    const {
      missionTitle,
      missionText,
      visionTitle,
      visionText,
      valuesTitle,
      valuesText,
    } = req.body;

    const [existing] = await db.select().from(aboutPageContent).limit(1);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'About page not initialized' });
    }

    const updateData = { updatedAt: new Date() };
    if (missionTitle) updateData.missionTitle = missionTitle;
    if (missionText) updateData.missionText = missionText;
    if (visionTitle) updateData.visionTitle = visionTitle;
    if (visionText) updateData.visionText = visionText;
    if (valuesTitle) updateData.valuesTitle = valuesTitle;
    if (valuesText) updateData.valuesText = valuesText;

    const [updatedContent] = await db
      .update(aboutPageContent)
      .set(updateData)
      .where(eq(aboutPageContent.id, existing.id))
      .returning();

    res.status(200).json({
      success: true,
      data: updatedContent,
      message: 'Mission, Vision, Values updated successfully',
    });
  } catch (error) {
    console.error('Update MVV error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Story Section (Admin)
export const updateStorySection = async (req, res) => {
  try {
    const { storyTitle, storyParagraph1, storyParagraph2, storyImageUrl } = req.body;

    const [existing] = await db.select().from(aboutPageContent).limit(1);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'About page not initialized' });
    }

    const updateData = { updatedAt: new Date() };
    if (storyTitle) updateData.storyTitle = storyTitle;
    if (storyParagraph1) updateData.storyParagraph1 = storyParagraph1;
    if (storyParagraph2) updateData.storyParagraph2 = storyParagraph2;
    if (storyImageUrl) updateData.storyImageUrl = storyImageUrl;

    const [updatedContent] = await db
      .update(aboutPageContent)
      .set(updateData)
      .where(eq(aboutPageContent.id, existing.id))
      .returning();

    res.status(200).json({
      success: true,
      data: updatedContent,
      message: 'Story section updated successfully',
    });
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Stats (Admin)
export const updateStats = async (req, res) => {
  try {
    const { stats } = req.body;

    if (!stats || !stats.clients || !stats.collections || !stats.quality) {
      return res.status(400).json({
        success: false,
        message: 'Stats must include clients, collections, and quality',
      });
    }

    const [existing] = await db.select().from(aboutPageContent).limit(1);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'About page not initialized' });
    }

    const [updatedContent] = await db
      .update(aboutPageContent)
      .set({
        stats,
        updatedAt: new Date(),
      })
      .where(eq(aboutPageContent.id, existing.id))
      .returning();

    res.status(200).json({
      success: true,
      data: updatedContent,
      message: 'Stats updated successfully',
    });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Features (Admin)
export const updateFeatures = async (req, res) => {
  try {
    const { features } = req.body;

    if (!features || !Array.isArray(features)) {
      return res.status(400).json({
        success: false,
        message: 'Features must be an array',
      });
    }

    // Validate features structure
    const validFeatures = features.every(
      (feature) => feature.icon && feature.title && feature.description
    );

    if (!validFeatures) {
      return res.status(400).json({
        success: false,
        message: 'Each feature must have icon, title, and description',
      });
    }

    const [existing] = await db.select().from(aboutPageContent).limit(1);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'About page not initialized' });
    }

    const [updatedContent] = await db
      .update(aboutPageContent)
      .set({
        features,
        updatedAt: new Date(),
      })
      .where(eq(aboutPageContent.id, existing.id))
      .returning();

    res.status(200).json({
      success: true,
      data: updatedContent,
      message: 'Features updated successfully',
    });
  } catch (error) {
    console.error('Update features error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Add Single Feature (Admin)
export const addFeature = async (req, res) => {
  try {
    const { icon, title, description } = req.body;

    if (!icon || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Icon, title, and description are required',
      });
    }

    const [existing] = await db.select().from(aboutPageContent).limit(1);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'About page not initialized' });
    }

    const currentFeatures = existing.features || [];
    const newFeatures = [...currentFeatures, { icon, title, description }];

    const [updatedContent] = await db
      .update(aboutPageContent)
      .set({
        features: newFeatures,
        updatedAt: new Date(),
      })
      .where(eq(aboutPageContent.id, existing.id))
      .returning();

    res.status(201).json({
      success: true,
      data: updatedContent,
      message: 'Feature added successfully',
    });
  } catch (error) {
    console.error('Add feature error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete Feature (Admin)
export const deleteFeature = async (req, res) => {
  try {
    const { index } = req.params;

    const [existing] = await db.select().from(aboutPageContent).limit(1);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'About page not initialized' });
    }

    const currentFeatures = existing.features || [];
    
    if (index < 0 || index >= currentFeatures.length) {
      return res.status(400).json({ success: false, message: 'Invalid feature index' });
    }

    const newFeatures = currentFeatures.filter((_, i) => i !== Number(index));

    const [updatedContent] = await db
      .update(aboutPageContent)
      .set({
        features: newFeatures,
        updatedAt: new Date(),
      })
      .where(eq(aboutPageContent.id, existing.id))
      .returning();

    res.status(200).json({
      success: true,
      data: updatedContent,
      message: 'Feature deleted successfully',
    });
  } catch (error) {
    console.error('Delete feature error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Reset to Default (Admin)
export const resetToDefault = async (req, res) => {
  try {
    const defaultContent = {
      heroTitle: 'Shah Creation',
      heroSubtitle: 'Crafting luxury fashion since 2025',
      heroDescription: 'Where elegance meets innovation, and every piece tells a story.',
      missionTitle: 'Our Mission',
      missionText: 'To deliver premium fashion that empowers individuals to express their unique style and confidence.',
      visionTitle: 'Our Vision',
      visionText: 'To become the most trusted luxury fashion brand known for innovation, quality, and timeless elegance.',
      valuesTitle: 'Our Values',
      valuesText: 'Quality, integrity, and sustainability guide every decision we make in crafting your perfect style.',
      storyTitle: 'Our Legacy of Excellence',
      storyParagraph1: 'Shah Creation was born from a passion for timeless elegance and superior craftsmanship. Founded with a vision to revolutionize the luxury fashion industry, we believe that every piece should tell a story.',
      storyParagraph2: 'Every garment is meticulously designed and crafted to make you feel extraordinary. We combine traditional artistry with modern innovation, ensuring that each collection reflects the essence of contemporary luxury.',
      storyImageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca6e97?w=800',
      stats: {
        clients: '500+',
        collections: '50+',
        quality: '100%',
      },
      features: [
        {
          icon: 'Award',
          title: 'Premium Quality',
          description: 'Carefully selected materials for durability and comfort',
        },
        {
          icon: 'Users',
          title: 'Expert Team',
          description: 'Experienced designers committed to your satisfaction',
        },
        {
          icon: 'Sparkles',
          title: 'Unique Designs',
          description: 'Exclusive collections that set you apart',
        },
        {
          icon: 'Heart',
          title: 'Customer First',
          description: 'Your happiness is our top priority',
        },
        {
          icon: 'Zap',
          title: 'Fast Delivery',
          description: 'Quick and reliable shipping to your door',
        },
        {
          icon: 'Target',
          title: 'Best Prices',
          description: 'Luxury fashion at competitive rates',
        },
      ],
      updatedAt: new Date(),
    };

    const [existing] = await db.select().from(aboutPageContent).limit(1);

    let resetContent;

    if (existing) {
      [resetContent] = await db
        .update(aboutPageContent)
        .set(defaultContent)
        .where(eq(aboutPageContent.id, existing.id))
        .returning();
    } else {
      [resetContent] = await db
        .insert(aboutPageContent)
        .values(defaultContent)
        .returning();
    }

    res.status(200).json({
      success: true,
      data: resetContent,
      message: 'About page reset to default successfully',
    });
  } catch (error) {
    console.error('Reset about page error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

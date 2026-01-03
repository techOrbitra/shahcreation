import { pgTable, serial, text, varchar, timestamp, json } from 'drizzle-orm/pg-core';

export const aboutPageContent = pgTable('about_page_content', {
  id: serial('id').primaryKey(),
  heroTitle: varchar('hero_title', { length: 255 }).default('Shah Creation').notNull(),
  heroSubtitle: text('hero_subtitle').default('Crafting luxury fashion since 2025'),
  heroDescription: text('hero_description'),
  missionTitle: varchar('mission_title', { length: 100 }).default('Our Mission'),
  missionText: text('mission_text'),
  visionTitle: varchar('vision_title', { length: 100 }).default('Our Vision'),
  visionText: text('vision_text'),
  valuesTitle: varchar('values_title', { length: 100 }).default('Our Values'),
  valuesText: text('values_text'),
  storyTitle: varchar('story_title', { length: 255 }).default('Our Legacy of Excellence'),
  storyParagraph1: text('story_paragraph1'),
  storyParagraph2: text('story_paragraph2'),
  storyImageUrl: varchar('story_image_url', { length: 500 }),
  stats: json('stats').default({ clients: '500+', collections: '50+', quality: '100%' }),
  features: json('features').default([]),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

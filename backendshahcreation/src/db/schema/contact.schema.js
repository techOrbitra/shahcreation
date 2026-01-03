import { pgTable, serial, varchar, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const contactInquiries = pgTable('contact_inquiries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contactPageSettings = pgTable('contact_page_settings', {
  id: serial('id').primaryKey(),
  phone: varchar('phone', { length: 20 }).default('+91 98765 43210').notNull(),
  phoneHours: varchar('phone_hours', { length: 100 }).default('Mon-Sat 9AM-8PM'),
  email: varchar('email', { length: 255 }).default('hello@shahcreation.com').notNull(),
  address: text('address').default('123 Fashion Street, Siddhapur, Gujarat'),
  workingHours: text('working_hours').default('Mon-Sat: 9AM - 8PM\nSunday: 10AM - 6PM'),
  mapImageUrl: varchar('map_image_url', { length: 500 }),
  googleMapsLink: varchar('google_maps_link', { length: 500 }),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

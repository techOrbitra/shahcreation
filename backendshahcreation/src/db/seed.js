import 'dotenv/config';
import { db } from './index.js';
import { admins, categories, contactPageSettings, aboutPageContent } from './schema/index.js';
import { hashPassword } from '../utils/password.utils.js';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Super admin
    const hashedPassword = await hashPassword('admin123');
    await db.insert(admins).values({
      email: 'admin@shahcreation.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'super_admin',
    });
    console.log('✅ Super admin created!');

    // Categories
    await db.insert(categories).values([
      { name: 'Men', slug: 'men', description: "Men's premium clothing" },
      { name: 'Women', slug: 'women', description: "Women's luxury fashion" },
      { name: 'Kids', slug: 'kids', description: "Kids' comfortable wear" },
      { name: 'Sale', slug: 'sale', description: 'Special discounts' },
      { name: 'New Arrivals', slug: 'new-arrivals', description: 'Latest collections' },
    ]);
    console.log('✅ Categories created!');

    // Contact settings
    await db.insert(contactPageSettings).values({
      phone: '+91 98765 43210',
      email: 'hello@shahcreation.com',
      address: '123 Fashion Street, Siddhapur, Gujarat',
    });
    console.log('✅ Contact settings created!');

    // About page
    await db.insert(aboutPageContent).values({
      heroTitle: 'Shah Creation',
      heroSubtitle: 'Crafting luxury fashion since 2025',
    });
    console.log('✅ About page created!');

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();

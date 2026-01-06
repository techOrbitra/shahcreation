import "dotenv/config";
import { db } from "./index.js";
import {
  admins,
  categories,
  clothes,
  clothesToCategories,
  orders,
  contactInquiries,
  contactPageSettings,
  aboutPageContent,
} from "./schema/index.js";
import { hashPassword } from "../utils/password.utils.js";

// ==================== DUMMY DATA ====================

const dummyCategories = [
  { name: "Men", slug: "men", description: "Premium men's fashion collection" },
  { name: "Women", slug: "women", description: "Elegant women's clothing" },
  {
    name: "Kids",
    slug: "kids",
    description: "Comfortable and stylish kids wear",
  },
  {
    name: "Ethnic Wear",
    slug: "ethnic-wear",
    description: "Traditional ethnic clothing",
  },
  {
    name: "Western Wear",
    slug: "western-wear",
    description: "Modern western outfits",
  },
  {
    name: "Winter Collection",
    slug: "winter-collection",
    description: "Warm winter clothing",
  },
  {
    name: "Summer Collection",
    slug: "summer-collection",
    description: "Light summer wear",
  },
  {
    name: "Party Wear",
    slug: "party-wear",
    description: "Special occasion outfits",
  },
  {
    name: "Casual Wear",
    slug: "casual-wear",
    description: "Everyday comfortable clothing",
  },
  { name: "Sale", slug: "sale", description: "Special discounts and offers" },
];

const dummyClothes = [
  // Men's Collection
  {
    name: "Premium Cotton Shirt",
    slug: "premium-cotton-shirt",
    description:
      "High-quality 100% cotton shirt with perfect fit. Ideal for both formal and casual occasions.",
    price: 1299,
    oldPrice: 1999,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500",
    ],
    material: "100% Premium Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    fitType: "Slim Fit",
    careInstructions: "Machine wash cold, tumble dry low",
    origin: "India",
    warranty: "30 Days",
    stock: 50,
    isActive: true,
    isFeatured: true,
    categoryIds: [1, 9],
  },
  {
    name: "Denim Jeans Blue",
    slug: "denim-jeans-blue",
    description:
      "Classic blue denim jeans with comfortable stretch fabric. Perfect for everyday wear.",
    price: 2499,
    oldPrice: 3499,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
    ],
    material: "98% Cotton, 2% Elastane",
    sizes: ["28", "30", "32", "34", "36", "38"],
    fitType: "Regular Fit",
    careInstructions: "Machine wash cold, do not bleach",
    origin: "India",
    warranty: "60 Days",
    stock: 75,
    isActive: true,
    isFeatured: true,
    categoryIds: [1, 5, 9],
  },
  {
    name: "Formal Black Blazer",
    slug: "formal-black-blazer",
    description:
      "Elegant black blazer for formal occasions. Premium quality fabric with perfect tailoring.",
    price: 3999,
    oldPrice: 5999,
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500",
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500",
    ],
    material: "70% Polyester, 30% Viscose",
    sizes: ["S", "M", "L", "XL", "XXL"],
    fitType: "Regular Fit",
    careInstructions: "Dry clean only",
    origin: "India",
    warranty: "90 Days",
    stock: 30,
    isActive: true,
    isFeatured: false,
    categoryIds: [1, 5],
  },
  {
    name: "Floral Kurti",
    slug: "floral-kurti",
    description:
      "Beautiful floral printed kurti with comfortable cotton fabric. Perfect for daily wear.",
    price: 899,
    oldPrice: 1499,
    images: [
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500",
      "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=500",
    ],
    material: "100% Cotton",
    sizes: ["S", "M", "L", "XL", "XXL"],
    fitType: "Regular Fit",
    careInstructions: "Machine wash cold",
    origin: "India",
    warranty: "30 Days",
    stock: 100,
    isActive: true,
    isFeatured: true,
    categoryIds: [2, 4, 9],
  },
  {
    name: "Silk Saree Red",
    slug: "silk-saree-red",
    description:
      "Luxurious silk saree in vibrant red color. Perfect for weddings and special occasions.",
    price: 4999,
    oldPrice: 7999,
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500",
    ],
    material: "Pure Silk",
    sizes: ["Free Size"],
    fitType: "Traditional",
    careInstructions: "Dry clean only",
    origin: "India",
    warranty: "90 Days",
    stock: 20,
    isActive: true,
    isFeatured: true,
    categoryIds: [2, 4, 8],
  },
  {
    name: "Designer Top",
    slug: "designer-top",
    description:
      "Trendy designer top with modern prints. Comfortable and stylish for everyday wear.",
    price: 799,
    oldPrice: 1299,
    images: [
      "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=500",
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=500",
    ],
    material: "95% Cotton, 5% Spandex",
    sizes: ["XS", "S", "M", "L", "XL"],
    fitType: "Regular Fit",
    careInstructions: "Machine wash cold",
    origin: "India",
    warranty: "30 Days",
    stock: 80,
    isActive: true,
    isFeatured: false,
    categoryIds: [2, 5, 9],
  },
  {
    name: "Kids Cotton T-Shirt",
    slug: "kids-cotton-tshirt",
    description:
      "Soft and comfortable cotton t-shirt for kids. Available in multiple colors.",
    price: 399,
    oldPrice: 599,
    images: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500",
      "https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=500",
    ],
    material: "100% Cotton",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
    fitType: "Regular Fit",
    careInstructions: "Machine wash cold",
    origin: "India",
    warranty: "30 Days",
    stock: 120,
    isActive: true,
    isFeatured: true,
    categoryIds: [3, 9],
  },
  {
    name: "Kids Denim Shorts",
    slug: "kids-denim-shorts",
    description:
      "Comfortable denim shorts for kids. Perfect for summer and outdoor activities.",
    price: 599,
    oldPrice: 899,
    images: [
      "https://images.unsplash.com/photo-1566142571355-02a22d3a5c0b?w=500",
      "https://images.unsplash.com/photo-1519430099906-c7e82831a706?w=500",
    ],
    material: "100% Cotton Denim",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
    fitType: "Regular Fit",
    careInstructions: "Machine wash cold",
    origin: "India",
    warranty: "30 Days",
    stock: 90,
    isActive: true,
    isFeatured: false,
    categoryIds: [3, 7, 9],
  },
  {
    name: "Woolen Sweater",
    slug: "woolen-sweater",
    description:
      "Warm and cozy woolen sweater for cold weather. Available in multiple colors.",
    price: 1499,
    oldPrice: 2499,
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500",
    ],
    material: "80% Wool, 20% Acrylic",
    sizes: ["S", "M", "L", "XL", "XXL"],
    fitType: "Regular Fit",
    careInstructions: "Hand wash only, dry flat",
    origin: "India",
    warranty: "60 Days",
    stock: 60,
    isActive: true,
    isFeatured: true,
    categoryIds: [1, 6],
  },
  {
    name: "Leather Jacket",
    slug: "leather-jacket",
    description:
      "Premium leather jacket with modern design. Perfect for winter and style.",
    price: 5999,
    oldPrice: 8999,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
    ],
    material: "Genuine Leather",
    sizes: ["S", "M", "L", "XL"],
    fitType: "Slim Fit",
    careInstructions: "Professional leather cleaning only",
    origin: "India",
    warranty: "1 Year",
    stock: 25,
    isActive: true,
    isFeatured: true,
    categoryIds: [1, 6, 8],
  },
  {
    name: "Evening Gown",
    slug: "evening-gown",
    description:
      "Elegant evening gown for special occasions. Luxurious fabric with beautiful design.",
    price: 6999,
    oldPrice: 9999,
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    ],
    material: "Silk Blend with Embroidery",
    sizes: ["XS", "S", "M", "L", "XL"],
    fitType: "Fitted",
    careInstructions: "Dry clean only",
    origin: "India",
    warranty: "90 Days",
    stock: 15,
    isActive: true,
    isFeatured: true,
    categoryIds: [2, 5, 8],
  },
  {
    name: "Wedding Sherwani",
    slug: "wedding-sherwani",
    description:
      "Royal wedding sherwani with intricate embroidery. Perfect for grooms and special occasions.",
    price: 12999,
    oldPrice: 17999,
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
      "https://images.unsplash.com/photo-1622122201714-77da0ca8e5d2?w=500",
    ],
    material: "Silk with Zari Work",
    sizes: ["38", "40", "42", "44", "46"],
    fitType: "Traditional",
    careInstructions: "Dry clean only",
    origin: "India",
    warranty: "1 Year",
    stock: 10,
    isActive: true,
    isFeatured: true,
    categoryIds: [1, 4, 8],
  },
  {
    name: "Casual Polo T-Shirt",
    slug: "casual-polo-tshirt",
    description:
      "Classic polo t-shirt for casual wear. Comfortable and stylish.",
    price: 499,
    oldPrice: 999,
    images: [
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500",
      "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=500",
    ],
    material: "100% Cotton Pique",
    sizes: ["S", "M", "L", "XL", "XXL"],
    fitType: "Regular Fit",
    careInstructions: "Machine wash cold",
    origin: "India",
    warranty: "30 Days",
    stock: 150,
    isActive: true,
    isFeatured: false,
    categoryIds: [1, 9, 10],
  },
  {
    name: "Printed Palazzo Pants",
    slug: "printed-palazzo-pants",
    description:
      "Comfortable palazzo pants with beautiful prints. Perfect for summer.",
    price: 699,
    oldPrice: 1299,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
      "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=500",
    ],
    material: "Rayon",
    sizes: ["S", "M", "L", "XL", "XXL"],
    fitType: "Loose Fit",
    careInstructions: "Machine wash cold",
    origin: "India",
    warranty: "30 Days",
    stock: 110,
    isActive: true,
    isFeatured: false,
    categoryIds: [2, 7, 9, 10],
  },
  {
    name: "Sports Track Pants",
    slug: "sports-track-pants",
    description:
      "Comfortable track pants for sports and gym. Breathable fabric with good stretch.",
    price: 799,
    oldPrice: 1499,
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500",
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500",
    ],
    material: "90% Polyester, 10% Spandex",
    sizes: ["S", "M", "L", "XL", "XXL"],
    fitType: "Athletic Fit",
    careInstructions: "Machine wash cold",
    origin: "India",
    warranty: "60 Days",
    stock: 95,
    isActive: true,
    isFeatured: false,
    categoryIds: [1, 9, 10],
  },
];

const dummyOrders = [
  {
    customerName: "Rajesh Kumar",
    customerPhone: "9876543210",
    customerWhatsapp: "9876543210",
    customerAddress: "123 MG Road, Siddhapur, Gujarat 384151",
    items: [
      {
        id: 1,
        name: "Premium Cotton Shirt",
        quantity: 2,
        price: 1299,
        image:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
      },
      {
        id: 2,
        name: "Denim Jeans Blue",
        quantity: 1,
        price: 2499,
        image:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
      },
    ],
    totalAmount: 5097,
    status: "delivered",
    notes: "Delivered successfully. Customer very happy.",
  },
  {
    customerName: "Priya Sharma",
    customerPhone: "9123456789",
    customerWhatsapp: "9123456789",
    customerAddress: "456 Park Street, Ahmedabad, Gujarat 380001",
    items: [
      {
        id: 4,
        name: "Floral Kurti",
        quantity: 3,
        price: 899,
        image:
          "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500",
      },
      {
        id: 5,
        name: "Silk Saree Red",
        quantity: 1,
        price: 4999,
        image:
          "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500",
      },
    ],
    totalAmount: 7696,
    status: "shipped",
    notes: "Shipped via courier. Expected delivery in 2 days.",
  },
  {
    customerName: "Amit Patel",
    customerPhone: "9988776655",
    customerWhatsapp: "9988776655",
    customerAddress: "789 Lake View, Rajkot, Gujarat 360001",
    items: [
      {
        id: 9,
        name: "Woolen Sweater",
        quantity: 2,
        price: 1499,
        image:
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
      },
    ],
    totalAmount: 2998,
    status: "confirmed",
    notes: "Payment confirmed. Preparing for shipment.",
  },
  {
    customerName: "Sneha Desai",
    customerPhone: "9445566778",
    customerAddress: "321 Green Avenue, Surat, Gujarat 395001",
    items: [
      {
        id: 11,
        name: "Evening Gown",
        quantity: 1,
        price: 6999,
        image:
          "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
      },
    ],
    totalAmount: 6999,
    status: "processing",
  },
  {
    customerName: "Vikram Singh",
    customerPhone: "9667788990",
    customerWhatsapp: "9667788990",
    customerAddress: "567 Mall Road, Vadodara, Gujarat 390001",
    items: [
      {
        id: 3,
        name: "Formal Black Blazer",
        quantity: 1,
        price: 3999,
        image:
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500",
      },
      {
        id: 13,
        name: "Casual Polo T-Shirt",
        quantity: 3,
        price: 499,
        image:
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=500",
      },
    ],
    totalAmount: 5496,
    status: "pending",
  },
  {
    customerName: "Kavita Mehta",
    customerPhone: "9556677889",
    customerAddress: "890 Station Road, Gandhinagar, Gujarat 382010",
    items: [
      {
        id: 7,
        name: "Kids Cotton T-Shirt",
        quantity: 4,
        price: 399,
        image:
          "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500",
      },
      {
        id: 8,
        name: "Kids Denim Shorts",
        quantity: 2,
        price: 599,
        image:
          "https://images.unsplash.com/photo-1566142571355-02a22d3a5c0b?w=500",
      },
    ],
    totalAmount: 2794,
    status: "delivered",
    notes: "Delivered. Products in good condition.",
  },
  {
    customerName: "Ramesh Joshi",
    customerPhone: "9334455667",
    customerWhatsapp: "9334455667",
    customerAddress: "234 Temple Street, Bhavnagar, Gujarat 364001",
    items: [
      {
        id: 12,
        name: "Wedding Sherwani",
        quantity: 1,
        price: 12999,
        image:
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
      },
    ],
    totalAmount: 12999,
    status: "confirmed",
    notes: "Custom fitting done. Ready for delivery.",
  },
  {
    customerName: "Neha Kapoor",
    customerPhone: "9223344556",
    customerAddress: "678 Beach Road, Jamnagar, Gujarat 361001",
    items: [
      {
        id: 6,
        name: "Designer Top",
        quantity: 2,
        price: 799,
        image:
          "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=500",
      },
      {
        id: 14,
        name: "Printed Palazzo Pants",
        quantity: 2,
        price: 699,
        image:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
      },
    ],
    totalAmount: 2996,
    status: "shipped",
  },
  {
    customerName: "Karan Shah",
    customerPhone: "9112233445",
    customerWhatsapp: "9112233445",
    customerAddress: "901 Hill View, Anand, Gujarat 388001",
    items: [
      {
        id: 10,
        name: "Leather Jacket",
        quantity: 1,
        price: 5999,
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
      },
    ],
    totalAmount: 5999,
    status: "cancelled",
    notes: "Customer requested cancellation. Refund processed.",
  },
  {
    customerName: "Anjali Trivedi",
    customerPhone: "9001122334",
    customerAddress: "345 Market Street, Mehsana, Gujarat 384001",
    items: [
      {
        id: 15,
        name: "Sports Track Pants",
        quantity: 3,
        price: 799,
        image:
          "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500",
      },
    ],
    totalAmount: 2397,
    status: "pending",
  },
];

const dummyContactInquiries = [
  {
    name: "Rohit Verma",
    email: "rohit.verma@example.com",
    phone: "9876543210",
    message:
      "I want to inquire about bulk orders for my retail store. Can you provide wholesale pricing?",
    isRead: false,
  },
  {
    name: "Sakshi Agarwal",
    email: "sakshi.agarwal@example.com",
    phone: "9123456789",
    message:
      "Do you have a store in Mumbai? I would like to visit and check the products.",
    isRead: true,
  },
  {
    name: "Manish Gupta",
    phone: "9988776655",
    message:
      "I received damaged product. Please help me with return and replacement.",
    isRead: false,
  },
  {
    name: "Pooja Reddy",
    email: "pooja.reddy@example.com",
    phone: "9445566778",
    message: "Can you customize designs for wedding party? Need 50 pieces.",
    isRead: true,
  },
  {
    name: "Arjun Malhotra",
    email: "arjun.m@example.com",
    phone: "9667788990",
    message:
      "What are your payment options? Do you accept COD for orders above ₹10,000?",
    isRead: false,
  },
  {
    name: "Divya Iyer",
    phone: "9556677889",
    message: "Interested in franchise opportunity. Please share details.",
    isRead: false,
  },
  {
    name: "Sanjay Jain",
    email: "sanjay.jain@example.com",
    phone: "9334455667",
    message:
      "Excellent quality products! Very satisfied with my purchase. Thank you!",
    isRead: true,
  },
  {
    name: "Ritu Singh",
    email: "ritu.singh@example.com",
    phone: "9223344556",
    message: "Do you ship internationally? I am based in USA.",
    isRead: false,
  },
];

// ==================== SEED FUNCTION ====================

async function seedDummyData() {
  console.log("🌱 Starting dummy data seeding...\n");

  try {
    // 1. Seed Super Admin
    console.log("👤 Seeding Super Admin...");
    const hashedPassword = await hashPassword("admin123");
    const [superAdmin] = await db
      .insert(admins)
      .values({
        email: "admin@shahcreation.com",
        password: hashedPassword,
        name: "Super Admin",
        role: "super_admin",
      })
      .returning();
    console.log("✅ Super Admin created!\n");

    // 2. Seed Additional Admins (FIX: Use superAdmin.id)
    console.log("👥 Seeding Additional Admins...");
    const hashedPassword2 = await hashPassword("manager123");
    await db.insert(admins).values({
      email: "manager@shahcreation.com",
      password: hashedPassword2,
      name: "Store Manager",
      role: "admin",
      createdBy: superAdmin.id, // ✅ FIX: Use returned ID
    });
    console.log("✅ Additional Admins created!\n");

    // 3. Seed Categories
    console.log("📁 Seeding Categories...");
    const insertedCategories = await db
      .insert(categories)
      .values(dummyCategories)
      .returning();
    console.log(`✅ ${insertedCategories.length} Categories created!\n`);

    // 4. Seed Clothes
    console.log("👔 Seeding Clothes...");
    for (const cloth of dummyClothes) {
      const { categoryIds, ...clothData } = cloth;

      const [insertedCloth] = await db
        .insert(clothes)
        .values(clothData)
        .returning();

      if (categoryIds && categoryIds.length > 0) {
        const relations = categoryIds.map((catId) => ({
          clothId: insertedCloth.id,
          categoryId: catId,
        }));
        await db.insert(clothesToCategories).values(relations);
      }
    }
    console.log(
      `✅ ${dummyClothes.length} Clothes created with category relations!\n`
    );

    // 5. Seed Orders
    console.log("📦 Seeding Orders...");
    await db.insert(orders).values(dummyOrders);
    console.log(`✅ ${dummyOrders.length} Orders created!\n`);

    // 6. Seed Contact Inquiries
    console.log("✉️ Seeding Contact Inquiries...");
    await db.insert(contactInquiries).values(dummyContactInquiries);
    console.log(
      `✅ ${dummyContactInquiries.length} Contact Inquiries created!\n`
    );

    // 7. Seed Contact Page Settings
    console.log("⚙️ Seeding Contact Page Settings...");
    await db.insert(contactPageSettings).values({
      phone: "+91 98765 43210",
      phoneHours: "Mon-Sat 9AM-8PM",
      email: "hello@shahcreation.com",
      address: "123 Fashion Street, Siddhapur, Gujarat 384151",
      workingHours: "Mon-Sat: 9AM - 8PM\nSunday: 10AM - 6PM",
      mapImageUrl:
        "https://images.unsplash.com/photo-1551632811-561732a7d5e0?w=1200&fit=crop",
      googleMapsLink: "https://maps.google.com",
    });
    console.log("✅ Contact Page Settings created!\n");

    // 8. Seed About Page Content
    console.log("📄 Seeding About Page Content...");
    await db.insert(aboutPageContent).values({
      heroTitle: "Shah Creation",
      heroSubtitle: "Crafting luxury fashion since 2025",
      heroDescription:
        "Where elegance meets innovation, and every piece tells a story.",
      missionTitle: "Our Mission",
      missionText:
        "To deliver premium fashion that empowers individuals to express their unique style and confidence.",
      visionTitle: "Our Vision",
      visionText:
        "To become the most trusted luxury fashion brand known for innovation, quality, and timeless elegance.",
      valuesTitle: "Our Values",
      valuesText:
        "Quality, integrity, and sustainability guide every decision we make in crafting your perfect style.",
      storyTitle: "Our Legacy of Excellence",
      storyParagraph1:
        "Shah Creation was born from a passion for timeless elegance and superior craftsmanship. Founded with a vision to revolutionize the luxury fashion industry, we believe that every piece should tell a story.",
      storyParagraph2:
        "Every garment is meticulously designed and crafted to make you feel extraordinary. We combine traditional artistry with modern innovation, ensuring that each collection reflects the essence of contemporary luxury.",
      storyImageUrl:
        "https://images.unsplash.com/photo-1558618047-3c8c76ca6e97?w=800",
      stats: {
        clients: "500+",
        collections: "50+",
        quality: "100%",
      },
      features: [
        {
          icon: "Award",
          title: "Premium Quality",
          description:
            "Carefully selected materials for durability and comfort",
        },
        {
          icon: "Users",
          title: "Expert Team",
          description: "Experienced designers committed to your satisfaction",
        },
        {
          icon: "Sparkles",
          title: "Unique Designs",
          description: "Exclusive collections that set you apart",
        },
        {
          icon: "Heart",
          title: "Customer First",
          description: "Your happiness is our top priority",
        },
        {
          icon: "Zap",
          title: "Fast Delivery",
          description: "Quick and reliable shipping to your door",
        },
        {
          icon: "Target",
          title: "Best Prices",
          description: "Luxury fashion at competitive rates",
        },
      ],
    });
    console.log("✅ About Page Content created!\n");

    // Summary
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 DUMMY DATA SEEDING COMPLETED!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 Summary:");
    console.log(`   ✅ 2 Admins`);
    console.log(`   ✅ ${insertedCategories.length} Categories`);
    console.log(`   ✅ ${dummyClothes.length} Clothes with Images`);
    console.log(`   ✅ ${dummyOrders.length} Orders`);
    console.log(`   ✅ ${dummyContactInquiries.length} Contact Inquiries`);
    console.log(`   ✅ 1 Contact Page Settings`);
    console.log(`   ✅ 1 About Page Content`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("🚀 Your backend is now ready with dummy data!");
    console.log("📝 Login credentials:");
    console.log("   Email: admin@shahcreation.com");
    console.log("   Password: admin123\n");
    console.log("   Email: manager@shahcreation.com");
    console.log("   Password: manager123\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seedDummyData();

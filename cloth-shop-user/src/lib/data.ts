export const categories = [
  { id: 1, name: "Men", slug: "men", color: "#0ea5e9" },
  { id: 2, name: "Women", slug: "women", color: "#ec4899" },
  { id: 3, name: "Kids", slug: "kids", color: "#f59e0b" },
  { id: 4, name: "Sale", slug: "sale", color: "#ef4444" },
  { id: 5, name: "New", slug: "new", color: "#10b981" },
];

export const clothes = [
  {
    id: 1,
    slug: "premium-cotton-shirt",
    name: "Premium Cotton Shirt",
    price: 1999,
    oldPrice: 2999,
    categoryIds: [1, 5],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&fit=crop",
    description: "100% cotton, slim fit",
  },
  {
    id: 2,
    slug: "summer-floral-dress",
    name: "Summer Floral Dress",
    price: 2499,
    categoryIds: [2, 4],
    image:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&fit=crop",
    description: "Lightweight chiffon floral print",
  },
  // Add 18 more similar...
  {
    id: 20,
    slug: "kids-denim-jacket",
    name: "Kids Denim Jacket",
    price: 1299,
    categoryIds: [3],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop",
    description: "Classic denim jacket",
  },
];

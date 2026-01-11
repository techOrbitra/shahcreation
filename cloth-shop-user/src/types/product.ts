import { Category } from "./category";

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  productType: ProductType;
  attributes: ProductAttributes;
  brand?: string;
  origin: string;
  warranty?: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  categories?: Category[];
  categoryIds?: number[];
  createdAt: string;
  updatedAt: string;
}

export type ProductType =
  | "clothes"
  | "bedsheets"
  | "shoes"
  | "accessories"
  | "home-decor";

export interface ProductAttributes {
  // For clothes
  material?: string;
  sizes?: string[];
  fitType?: string;
  careInstructions?: string;
  color?: string;
  pattern?: string;

  // For bedsheets
  threadCount?: number;
  fabricType?: string;

  // For shoes
  sizeSystem?: string;
  closureType?: string;

  // Common
  weight?: string;
  dimensions?: string;
  [key: string]: any;
}

export interface CreateProductData {
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  productType: ProductType;
  attributes: ProductAttributes;
  brand?: string;
  origin: string;
  warranty?: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryIds: number[];
}

export interface ProductFilters {
  page: number;
  limit: number;
  search: string;
  category: string;
  productType: string;
  minPrice: number;
  maxPrice: number;
  sort: "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";
  featured: string;
}

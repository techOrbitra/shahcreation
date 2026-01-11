export interface Cloth {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  material: string | null;
  sizes: string[];
  fitType: string | null;
  careInstructions: string | null;
  origin: string;
  warranty: string | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  categories?: {
    id: number;
    name: string;
    slug: string;
  }[];
  categoryIds?: number[];
}

export interface CreateClothData {
  name: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  images?: string[];
  material?: string;
  sizes?: string[];
  fitType?: string;
  careInstructions?: string;
  origin?: string;
  warranty?: string;
  stock?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  categoryIds?: number[];
}

export interface UpdateClothData extends Partial<CreateClothData> {}

export interface ClothesFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
  featured?: 'true' | 'false';
}

export interface ClothesResponse {
  success: boolean;
  data: Cloth[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

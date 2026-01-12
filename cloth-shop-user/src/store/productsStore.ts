import { create } from "zustand";
import axiosInstance from "@/lib/axios";

/* ================= TYPES ================= */

interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string; // thumbnail
  images: string[]; // gallery
  categoryIds: number[];
  isActive: boolean;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  page: number;
  limit: number;
}
interface FilterState {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  page: number;
  limit: number;
  featured?: boolean; // ✅ ADD THIS
}

interface ProductsState {
  products: Product[];
  categories: Category[];
  total: number;
  isLoading: boolean;
  error: string | null;
  filters: FilterState;

  fetchProducts: (filters?: Partial<FilterState>) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<Product | null>;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
}

/* ================= STORE ================= */

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  categories: [],
  total: 0,
  isLoading: false,
  error: null,

  filters: {
    search: "",
    category: "all",
    minPrice: 0,
    maxPrice: 10000,
    page: 1,
    limit: 12,
  },

  /* -------- Filters -------- */

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  clearFilters: () => {
    set({
      filters: {
        search: "",
        category: "all",
        minPrice: 0,
        maxPrice: 10000,
        page: 1,
        limit: 12,
      },
    });
  },

  /* -------- Categories -------- */

  fetchCategories: async () => {
    try {
      const res = await axiosInstance.get("/products/categories");
      set({ categories: res.data.data || [] });
    } catch (err) {
      console.error("Fetch categories failed:", err);
      set({ categories: [] });
    }
  },

  /* -------- Products -------- */

  fetchProducts: async (customFilters = {}) => {
    set({ isLoading: true, error: null });

    try {
      const filters = {
        ...get().filters,
        ...customFilters,
        page: 1,
      };

      set({ filters });

      const params = new URLSearchParams({
        page: String(filters.page),
        limit: String(filters.limit),
      });

      if (filters.search) params.append("search", filters.search);
      if (filters.category && filters.category !== "all")
        params.append("category", filters.category);
      if (filters.minPrice > 0)
        params.append("minPrice", String(filters.minPrice));
      if (filters.maxPrice < 10000)
        params.append("maxPrice", String(filters.maxPrice));

      const res = await axiosInstance.get(`/products?${params}`);

      const products: Product[] = res.data.data.map((p: any) => ({
        ...p,
        categoryIds: p.categories?.map((c: any) => c.id) || [],
        images: Array.isArray(p.images) ? p.images : [],
        image: p.images?.[0] || "", // thumbnail
      }));

      set({
        products,
        total: res.data.pagination?.total || 0,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to fetch products",
        isLoading: false,
      });
    }
  },

  /* -------- Single Product -------- */

  fetchProductBySlug: async (slug: string) => {
    try {
      const response = await axiosInstance.get(
        `/products/slug/${slug}` // ✅ CORRECT
      );

      const product = response.data.data;

      return {
        ...product,
        categoryIds: product.categories?.map((c: any) => c.id) || [],
        images: Array.isArray(product.images) ? product.images : [],
        image: product.images?.[0] || "",
      };
    } catch (error: any) {
      console.error("Failed to fetch product:", error);
      return null;
    }
  },
}));

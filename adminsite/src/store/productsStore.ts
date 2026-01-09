import { create } from "zustand";
import type { Product, CreateProductData, ProductFilters } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: ProductFilters;

  // Actions
  fetchProducts: (filters?: Partial<ProductFilters>) => Promise<void>;
  createProduct: (data: CreateProductData) => Promise<void>;
  updateProduct: (
    id: number,
    data: Partial<CreateProductData>
  ) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  toggleFeatured: (id: number, isFeatured: boolean) => Promise<void>;
  uploadImages: (files: File[]) => Promise<string[]>;
  setFilters: (filters: Partial<ProductFilters>) => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  },
  filters: {
    page: 1,
    limit: 12,
    search: "",
    category: "",
    productType: "",
    minPrice: 0,
    maxPrice: 1000000,
    sort: "newest",
    featured: "",
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  fetchProducts: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const params = new URLSearchParams();

      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/products?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      set({
        products: data.data,
        pagination: data.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  uploadImages: async (files: File[]) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/products/upload-images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload images");

      const data = await response.json();
      return data.data; // Returns array of Cloudinary URLs
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Failed to create product");

      await get().fetchProducts();
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Failed to update product");

      await get().fetchProducts();
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete product");

      await get().fetchProducts();
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  toggleFeatured: async (id, isFeatured) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/products/${id}/featured`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isFeatured }),
      });

      if (!response.ok) throw new Error("Failed to update featured status");

      await get().fetchProducts();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));

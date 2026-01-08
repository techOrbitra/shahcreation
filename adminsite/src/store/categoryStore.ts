'use client';

import { create } from 'zustand';
import { apiClient } from '@/lib/axios';
import type { Category, CreateCategoryData, UpdateCategoryData, ApiResponse } from '@/types';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  
  fetchCategories: (search?: string) => Promise<void>;
  createCategory: (data: CreateCategoryData) => Promise<void>;
  updateCategory: (id: number, data: UpdateCategoryData) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  setSearchQuery: (query: string) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  searchQuery: '',

  fetchCategories: async (search) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<ApiResponse<Category[]>>('/categories', {
        params: search ? { search } : undefined,
      });
      set({ categories: response.data.data || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch categories',
        isLoading: false,
      });
    }
  },

  createCategory: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post<ApiResponse<Category>>('/categories', data);
      await get().fetchCategories(get().searchQuery);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create category',
        isLoading: false,
      });
      throw error;
    }
  },

  updateCategory: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, data);
      await get().fetchCategories(get().searchQuery);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update category',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/categories/${id}`);
      await get().fetchCategories(get().searchQuery);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete category',
        isLoading: false,
      });
      throw error;
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
}));

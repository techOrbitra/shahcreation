'use client';

import { create } from 'zustand';
import { apiClient } from '@/lib/axios';
import type { Cloth, CreateClothData, UpdateClothData, ClothesFilters, ClothesResponse, ApiResponse } from '@/types';

interface ClothesState {
  clothes: Cloth[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: ClothesFilters;
  
  fetchClothes: (filters?: ClothesFilters) => Promise<void>;
  getClothById: (id: number) => Promise<Cloth | null>;
  createCloth: (data: CreateClothData) => Promise<void>;
  updateCloth: (id: number, data: UpdateClothData) => Promise<void>;
  deleteCloth: (id: number) => Promise<void>;
  bulkDeleteClothes: (ids: number[]) => Promise<void>;
  toggleFeatured: (id: number, isFeatured: boolean) => Promise<void>;
  updateStock: (id: number, stock: number) => Promise<void>;
  setFilters: (filters: ClothesFilters) => void;
}

export const useClothesStore = create<ClothesState>((set, get) => ({
  clothes: [],
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
    search: '',
    sort: 'newest',
  },

  fetchClothes: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const queryFilters = filters || get().filters;
      const response = await apiClient.get<ClothesResponse>('/clothes', {
        params: queryFilters,
      });
      
      set({
        clothes: response.data.data || [],
        pagination: response.data.pagination,
        filters: queryFilters,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch products',
        isLoading: false,
      });
    }
  },

  getClothById: async (id) => {
    try {
      const response = await apiClient.get<ApiResponse<Cloth>>(`/clothes/admin/${id}`);
      return response.data.data || null;
    } catch (error: any) {
      console.error('Get cloth error:', error);
      return null;
    }
  },

  createCloth: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post<ApiResponse<Cloth>>('/clothes', data);
      await get().fetchClothes(get().filters);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create product',
        isLoading: false,
      });
      throw error;
    }
  },

  updateCloth: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.put<ApiResponse<Cloth>>(`/clothes/${id}`, data);
      await get().fetchClothes(get().filters);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update product',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCloth: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/clothes/${id}`);
      await get().fetchClothes(get().filters);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete product',
        isLoading: false,
      });
      throw error;
    }
  },

  bulkDeleteClothes: async (ids) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post('/clothes/bulk-delete', { ids });
      await get().fetchClothes(get().filters);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete products',
        isLoading: false,
      });
      throw error;
    }
  },

  toggleFeatured: async (id, isFeatured) => {
    try {
      await apiClient.patch(`/clothes/${id}/featured`, { isFeatured });
      await get().fetchClothes(get().filters);
    } catch (error: any) {
      console.error('Toggle featured error:', error);
      throw error;
    }
  },

  updateStock: async (id, stock) => {
    try {
      await apiClient.patch(`/clothes/${id}/stock`, { stock });
      await get().fetchClothes(get().filters);
    } catch (error: any) {
      console.error('Update stock error:', error);
      throw error;
    }
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },
}));

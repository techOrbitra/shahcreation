'use client';

import { create } from 'zustand';
import { apiClient } from '@/lib/axios';
import type { Admin, ApiResponse } from '@/types';

interface AdminState {
  admins: Admin[];
  isLoading: boolean;
  error: string | null;
  
  fetchAdmins: () => Promise<void>;
  createAdmin: (data: { email: string; password: string; name: string; role?: string }) => Promise<void>;
  deleteAdmin: (id: number) => Promise<void>;
  toggleAdminStatus: (id: number, isActive: boolean) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  admins: [],
  isLoading: false,
  error: null,

  fetchAdmins: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<ApiResponse<Admin[]>>('/admins');
      set({ admins: response.data.data || [], isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch admins',
        isLoading: false,
      });
    }
  },

  createAdmin: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post<ApiResponse<Admin>>('/admins', data);
      await get().fetchAdmins();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create admin',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteAdmin: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/admins/${id}`);
      await get().fetchAdmins();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete admin',
        isLoading: false,
      });
      throw error;
    }
  },

  toggleAdminStatus: async (id, isActive) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.patch(`/admins/${id}/status`, { isActive });
      await get().fetchAdmins();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update admin status',
        isLoading: false,
      });
      throw error;
    }
  },
}));

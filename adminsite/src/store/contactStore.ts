import { create } from 'zustand';
import type { ContactInquiry, CreateInquiryData, ContactSettings, InquiryStats, InquiryFilters } from '@/types/contact';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface ContactState {
  // Settings
  settings: ContactSettings | null;
  
  // Inquiries
  inquiries: ContactInquiry[];
  stats: InquiryStats | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  unreadCount: number;
  filters: InquiryFilters;
  
  // Actions - Settings
  fetchSettings: () => Promise<void>;
  updateSettings: (data: Partial<ContactSettings>) => Promise<void>;
  updatePhoneDetails: (phone: string, phoneHours?: string) => Promise<void>;
  updateAddress: (address: string, workingHours?: string) => Promise<void>;
  resetSettings: () => Promise<void>;
  uploadMapImage: (file: File) => Promise<string>;
  
  // Actions - Inquiries
  fetchInquiries: (filters?: Partial<InquiryFilters>) => Promise<void>;
  fetchStats: () => Promise<void>;
  createInquiry: (data: CreateInquiryData) => Promise<void>;
  toggleReadStatus: (id: number, isRead: boolean) => Promise<void>;
  bulkMarkAsRead: (ids: number[]) => Promise<void>;
  deleteInquiry: (id: number) => Promise<void>;
  bulkDeleteInquiries: (ids: number[]) => Promise<void>;
  exportInquiries: () => Promise<any[]>;
  setFilters: (filters: Partial<InquiryFilters>) => void;
}

export const useContactStore = create<ContactState>((set, get) => ({
  settings: null,
  inquiries: [],
  stats: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
  unreadCount: 0,
  filters: {
    page: 1,
    limit: 20,
    search: '',
    isRead: '',
    startDate: '',
    endDate: '',
    sort: 'newest',
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  // Fetch settings (public)
  fetchSettings: async () => {
    try {
      const response = await fetch(`${API_URL}/contact/settings`);
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      set({ settings: data.data });
    } catch (error: any) {
      console.error('Fetch settings error:', error);
      set({ error: error.message });
    }
  },

  // Update settings (admin)
  updateSettings: async (settingsData) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/contact/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(settingsData),
      });

      if (!response.ok) throw new Error('Failed to update settings');
      const data = await response.json();
      set({ settings: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update phone details
  updatePhoneDetails: async (phone, phoneHours) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/contact/settings/phone`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ phone, phoneHours }),
      });

      if (!response.ok) throw new Error('Failed to update phone');
      const data = await response.json();
      set({ settings: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update address
  updateAddress: async (address, workingHours) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/contact/settings/address`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ address, workingHours }),
      });

      if (!response.ok) throw new Error('Failed to update address');
      const data = await response.json();
      set({ settings: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Reset settings
  resetSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/contact/settings/reset`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to reset settings');
      const data = await response.json();
      set({ settings: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Upload map image
  uploadMapImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('images', file);

      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/products/upload-images`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');
      const data = await response.json();
      return data.data[0]; // Return first image URL
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  // Fetch inquiries
  fetchInquiries: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const params = new URLSearchParams();
      
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/contact/inquiries/all?${params}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch inquiries');
      const data = await response.json();
      
      set({
        inquiries: data.data,
        pagination: data.pagination,
        unreadCount: data.unreadCount,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch stats
  fetchStats: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/contact/inquiries/stats`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      set({ stats: data.data });
    } catch (error: any) {
      console.error('Fetch stats error:', error);
    }
  },

  // Create inquiry (public)
  createInquiry: async (inquiryData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/contact/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData),
      });

      if (!response.ok) throw new Error('Failed to submit inquiry');
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Toggle read status
  toggleReadStatus: async (id, isRead) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/contact/inquiries/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ isRead }),
      });

      if (!response.ok) throw new Error('Failed to update status');
      await get().fetchInquiries();
    } catch (error: any) {
      throw error;
    }
  },

  // Bulk mark as read
  bulkMarkAsRead: async (ids) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/contact/inquiries/bulk-mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) throw new Error('Failed to mark as read');
      await get().fetchInquiries();
    } catch (error: any) {
      throw error;
    }
  },

  // Delete inquiry
  deleteInquiry: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/contact/inquiries/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete inquiry');
      await get().fetchInquiries();
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Bulk delete
  bulkDeleteInquiries: async (ids) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/contact/inquiries/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) throw new Error('Failed to delete inquiries');
      await get().fetchInquiries();
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Export inquiries
  exportInquiries: async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/contact/inquiries/export`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to export');
      const data = await response.json();
      return data.data;
    } catch (error: any) {
      throw error;
    }
  },
}));

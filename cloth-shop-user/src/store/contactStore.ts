import { create } from "zustand";
import axiosInstance from "@/lib/axios";
import type {
  ContactInquiry,
  CreateInquiryData,
  ContactSettings,
  InquiryStats,
  InquiryFilters,
} from "@/types/contact";

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
    search: "",
    isRead: "",
    startDate: "",
    endDate: "",
    sort: "newest",
  },

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  // Fetch settings (public)
  fetchSettings: async () => {
    try {
      const response = await axiosInstance.get("/contact/settings");
      set({ settings: response.data.data });
    } catch (error: any) {
      console.error("Fetch settings error:", error);
      set({ error: error.response?.data?.message || error.message });
    }
  },

  // Update settings (admin)
  updateSettings: async (settingsData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(
        "/contact/settings",
        settingsData
      );
      set({ settings: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update settings",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update phone details
  updatePhoneDetails: async (phone, phoneHours) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch("/contact/settings/phone", {
        phone,
        phoneHours,
      });
      set({ settings: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update phone",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update address
  updateAddress: async (address, workingHours) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch("/contact/settings/address", {
        address,
        workingHours,
      });
      set({ settings: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update address",
        isLoading: false,
      });
      throw error;
    }
  },

  // Reset settings
  resetSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/contact/settings/reset");
      set({ settings: response.data.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to reset settings",
        isLoading: false,
      });
      throw error;
    }
  },

  // Upload map image
  uploadMapImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("images", file);

      const response = await axiosInstance.post(
        "/products/upload-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.data[0];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to upload image"
      );
    }
  },

  // Fetch inquiries
  fetchInquiries: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const params = new URLSearchParams();

      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const response = await axiosInstance.get(
        `/contact/inquiries/all?${params}`
      );

      set({
        inquiries: response.data.data,
        pagination: response.data.pagination,
        unreadCount: response.data.unreadCount,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch inquiries",
        isLoading: false,
      });
    }
  },

  // Fetch stats
  fetchStats: async () => {
    try {
      const response = await axiosInstance.get("/contact/inquiries/stats");
      set({ stats: response.data.data });
    } catch (error: any) {
      console.error("Fetch stats error:", error);
    }
  },

  // Create inquiry (public)
  createInquiry: async (inquiryData) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/contact/inquiries", inquiryData);
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to submit inquiry",
        isLoading: false,
      });
      throw error;
    }
  },

  // Toggle read status
  toggleReadStatus: async (id, isRead) => {
    try {
      await axiosInstance.patch(`/contact/inquiries/${id}/read`, { isRead });
      await get().fetchInquiries();
    } catch (error: any) {
      throw error;
    }
  },

  // Bulk mark as read
  bulkMarkAsRead: async (ids) => {
    try {
      await axiosInstance.post("/contact/inquiries/bulk-mark-read", { ids });
      await get().fetchInquiries();
    } catch (error: any) {
      throw error;
    }
  },

  // Delete inquiry
  deleteInquiry: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/contact/inquiries/${id}`);
      await get().fetchInquiries();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete inquiry",
        isLoading: false,
      });
      throw error;
    }
  },

  // Bulk delete
  bulkDeleteInquiries: async (ids) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/contact/inquiries/bulk-delete", { ids });
      await get().fetchInquiries();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete inquiries",
        isLoading: false,
      });
      throw error;
    }
  },

  // Export inquiries
  exportInquiries: async () => {
    try {
      const response = await axiosInstance.get("/contact/inquiries/export");
      return response.data.data;
    } catch (error: any) {
      throw error;
    }
  },
}));

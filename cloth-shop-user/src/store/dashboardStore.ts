"use client";

import { create } from "zustand";
import { apiClient } from "@/lib/axios";
import type { DashboardStats, ApiResponse } from "@/types";

interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;

  fetchDashboardStats: (dateRange?: {
    startDate?: string;
    endDate?: string;
  }) => Promise<void>;
  refreshStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchDashboardStats: async (dateRange) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch order stats
      const orderStatsResponse = await apiClient.get<ApiResponse<any>>(
        "/orders/stats",
        {
          params: dateRange,
        }
      );

      // Fetch inquiry stats
      const inquiryStatsResponse = await apiClient.get<ApiResponse<any>>(
        "/contact/inquiries/stats",
        {
          params: dateRange,
        }
      );

      // Fetch all clothes with limit to get total count from pagination
      const clothesResponse = await apiClient.get<any>("/clothes", {
        params: { limit: 1, page: 1 },
      });

      // Fetch all categories
      const categoriesResponse = await apiClient.get<any>("/categories");

      const orderStats = orderStatsResponse.data.data;
      const inquiryStats = inquiryStatsResponse.data.data;

      // Get counts from appropriate response structures
      const totalProducts = clothesResponse.data.pagination?.total || 0;
      const totalCategories = categoriesResponse.data.data?.length || 0;

      const dashboardStats: DashboardStats = {
        totalOrders: orderStats.totalOrders || 0,
        totalRevenue: orderStats.totalRevenue || 0,
        totalProducts: totalProducts,
        totalCategories: totalCategories,
        totalInquiries: inquiryStats.totalInquiries || 0,
        unreadInquiries: inquiryStats.unreadInquiries || 0,
        ordersByStatus: orderStats.ordersByStatus || [],
        recentOrders: orderStats.recentOrders || [],
        recentInquiries: inquiryStats.recentInquiries || [],
      };

      set({ stats: dashboardStats, isLoading: false });
    } catch (error: any) {
      console.error("Dashboard stats error:", error);
      set({
        error:
          error.response?.data?.message || "Failed to fetch dashboard stats",
        isLoading: false,
      });
    }
  },

  refreshStats: async () => {
    await get().fetchDashboardStats();
  },
}));

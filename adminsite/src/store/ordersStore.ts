import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Order, OrderStatus } from "@/types";

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: {
    search?: string;
    status?: OrderStatus;
    sort?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
  };
  stats: {
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
  } | null;

  // Actions
  fetchOrders: (params?: any) => Promise<void>;
  fetchOrderById: (id: number) => Promise<Order | null>;
  fetchOrderStats: (params?: any) => Promise<void>;
  createOrder: (data: Partial<Order>) => Promise<void>; // ADD THIS
  updateOrder: (id: number, data: Partial<Order>) => Promise<void>;
  updateOrderStatus: (id: number, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
  bulkDeleteOrders: (ids: number[]) => Promise<void>;
  bulkUpdateStatus: (ids: number[], status: OrderStatus) => Promise<void>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const useOrdersStore = create<OrdersState>()(
  devtools((set, get) => ({
    orders: [],
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0,
    },
    filters: {},
    stats: null,

 createOrder: async (orderData: Partial<Order>) => {
  set({ isLoading: true, error: null });
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create order");
    }

    const data = await response.json();

    // Refresh orders list with current filters
    const currentFilters = get().filters;
    await get().fetchOrders(currentFilters);

    // Refresh stats
    get().fetchOrderStats();

    set({ isLoading: false });
  } catch (error: any) {
    set({ error: error.message, isLoading: false });
    throw error;
  }
},


    // Fetch orders with all backend filters
    fetchOrders: async (params = {}) => {
      set({ isLoading: true, error: null });
      try {
        // Build query parameters using backend API structure
        const queryParams = new URLSearchParams();

        // Pagination
        queryParams.append("page", (params.page || 1).toString());
        queryParams.append("limit", (params.limit || 20).toString());

        // Search filter
        if (params.search) {
          queryParams.append("search", params.search);
        }

        // Status filter
        if (params.status) {
          queryParams.append("status", params.status);
        }

        // Sort filter
        if (params.sort) {
          queryParams.append("sort", params.sort);
        }

        // Date range filters
        if (params.startDate) {
          queryParams.append("startDate", params.startDate);
        }
        if (params.endDate) {
          queryParams.append("endDate", params.endDate);
        }

        // Amount range filters
        if (params.minAmount) {
          queryParams.append("minAmount", params.minAmount.toString());
        }
        if (params.maxAmount) {
          queryParams.append("maxAmount", params.maxAmount.toString());
        }

        const response = await fetch(`${API_URL}/orders?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch orders");

        const data = await response.json();

        set({
          orders: data.data,
          pagination: data.pagination,
          isLoading: false,
          filters: params, // Store current filters
        });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
      }
    },

    fetchOrderById: async (id: number) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(`${API_URL}/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch order");

        const data = await response.json();
        set({ isLoading: false });
        return data.data;
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
        return null;
      }
    },

    fetchOrderStats: async (params = {}) => {
      try {
        const queryParams = new URLSearchParams();

        if (params.startDate) {
          queryParams.append("startDate", params.startDate);
        }
        if (params.endDate) {
          queryParams.append("endDate", params.endDate);
        }

        const response = await fetch(`${API_URL}/orders/stats?${queryParams}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch stats");

        const data = await response.json();
        set({ stats: data.data });
      } catch (error: any) {
        console.error("Stats fetch error:", error);
      }
    },

    updateOrder: async (id: number, orderData: Partial<Order>) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(`${API_URL}/orders/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) throw new Error("Failed to update order");

        const data = await response.json();

        // Re-fetch orders with current filters to get updated data from backend
        const currentFilters = get().filters;
        await get().fetchOrders(currentFilters);

        // Refresh stats
        get().fetchOrderStats();

        set({ isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    updateOrderStatus: async (id: number, status: OrderStatus) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(`${API_URL}/orders/${id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) throw new Error("Failed to update status");

        // Re-fetch with current filters
        const currentFilters = get().filters;
        await get().fetchOrders(currentFilters);

        get().fetchOrderStats();
        set({ isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    deleteOrder: async (id: number) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(`${API_URL}/orders/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to delete order");

        // Re-fetch orders with current filters
        const currentFilters = get().filters;
        await get().fetchOrders(currentFilters);

        get().fetchOrderStats();
        set({ isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    bulkDeleteOrders: async (ids: number[]) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(`${API_URL}/orders/bulk-delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ ids }),
        });

        if (!response.ok) throw new Error("Failed to delete orders");

        // Re-fetch orders with current filters
        const currentFilters = get().filters;
        await get().fetchOrders(currentFilters);

        get().fetchOrderStats();
        set({ isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },

    bulkUpdateStatus: async (ids: number[], status: OrderStatus) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(`${API_URL}/orders/bulk-update-status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ ids, status }),
        });

        if (!response.ok) throw new Error("Failed to update orders");

        // Re-fetch orders with current filters
        const currentFilters = get().filters;
        await get().fetchOrders(currentFilters);

        get().fetchOrderStats();
        set({ isLoading: false });
      } catch (error: any) {
        set({ error: error.message, isLoading: false });
        throw error;
      }
    },
  }))
);

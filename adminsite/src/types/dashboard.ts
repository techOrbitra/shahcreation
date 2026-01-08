export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCategories: number;
  totalInquiries: number;
  unreadInquiries: number;
  ordersByStatus: OrdersByStatus[];
  recentOrders: RecentOrder[];
  recentInquiries: RecentInquiry[];
}

export interface OrdersByStatus {
  status: string;
  count: string;
  total: string;
}

export interface RecentOrder {
  id: number;
  customerName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface RecentInquiry {
  id: number;
  name: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

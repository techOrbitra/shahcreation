// export type OrderStatus =
//   | "pending"
//   | "confirmed"
//   | "processing"
//   | "shipped"
//   | "delivered"
//   | "cancelled";

// export interface OrderItem {
//   id: number;
//   name: string;
//   slug: string;
//   quantity: number;
//   price: number;
//   image: string;
// }

// export interface Order {
//   id: number;
//   customerName: string;
//   customerPhone: string;
//   customerEmail?: string;
//   customerWhatsapp?: string;
//   customerAddress: string;
//   items: OrderItem[];
//   totalAmount: number;
//   status: OrderStatus;
//   notes?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface OrderFilters {
//   page?: number;
//   limit?: number;
//   search?: string;
//   status?: OrderStatus;
//   startDate?: string;
//   endDate?: string;
//   minAmount?: number;
//   maxAmount?: number;
//   sort?:
//     | "newest"
//     | "oldest"
//     | "amount-asc"
//     | "amount-desc"
//     | "name-asc"
//     | "name-desc";
// }

// export interface OrdersResponse {
//   success: boolean;
//   data: Order[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     pages: number;
//   };
// }

// export interface OrderStats {
//   totalOrders: number;
//   totalRevenue: number;
//   pendingOrders: number;
//   completedOrders: number;
//   cancelledOrders: number;
//   averageOrderValue: number;
//   ordersByStatus: Record<OrderStatus, number>;
// }

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
  size?: string;
  color?: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerWhatsapp?: string | null;
  customerAddress?: string | null;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

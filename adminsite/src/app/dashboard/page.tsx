"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useDashboardStore } from "@/store/dashboardStore";

export default function DashboardPage() {
  const { admin } = useAuthStore();
  const { stats, isLoading, fetchDashboardStats } = useDashboardStore();
  const [dateRange, setDateRange] = useState<
    "today" | "week" | "month" | "all"
  >("all");

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      processing: "bg-purple-100 text-purple-700",
      shipped: "bg-indigo-100 text-indigo-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, {admin?.name}! 👋
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-2xl">
              🛒
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              Total
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {stats?.totalOrders || 0}
          </p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-2xl">
              💰
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              Revenue
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {formatCurrency(stats?.totalRevenue || 0)}
          </p>
        </div>

        {/* Total Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-2xl">
              👕
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
              Products
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Products</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {stats?.totalProducts || 0}
          </p>
        </div>

        {/* Unread Inquiries */}
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-2xl">
              📧
            </div>
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
              New
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Unread Messages</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900">
            {stats?.unreadInquiries || 0}
          </p>
        </div>
      </div>

      {/* Orders by Status */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span>📊</span>
          Orders by Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats?.ordersByStatus.map((statusData, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(
                  statusData.status
                )}`}
              >
                {statusData.status}
              </span>
              <p className="text-2xl font-bold text-gray-900">
                {statusData.count}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(Number(statusData.total))}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>📦</span>
            Recent Orders
          </h2>
          <div className="space-y-4">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">
                        #{order.id}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No recent orders</p>
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>💬</span>
            Recent Inquiries
          </h2>
          <div className="space-y-4">
            {stats?.recentInquiries && stats.recentInquiries.length > 0 ? (
              stats.recentInquiries.slice(0, 5).map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      inquiry.isRead ? "bg-gray-300" : "bg-primary"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {inquiry.name}
                      </p>
                      {!inquiry.isRead && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {inquiry.phone}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {inquiry.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                No recent inquiries
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Categories</span>
              <span className="text-lg font-semibold text-gray-900">
                {stats?.totalCategories || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Inquiries</span>
              <span className="text-lg font-semibold text-gray-900">
                {stats?.totalInquiries || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Order Value</span>
              <span className="text-lg font-semibold text-gray-900">
                {stats?.totalOrders
                  ? formatCurrency(
                      (stats.totalRevenue || 0) / stats.totalOrders
                    )
                  : formatCurrency(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/dashboard/clothes"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-center group"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                ➕
              </span>
              <p className="text-sm font-medium text-gray-900">Add Product</p>
            </a>
            <a
              href="/dashboard/categories"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-center group"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                📁
              </span>
              <p className="text-sm font-medium text-gray-900">Categories</p>
            </a>
            <a
              href="/dashboard/orders"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-center group"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                🛒
              </span>
              <p className="text-sm font-medium text-gray-900">View Orders</p>
            </a>
            <a
              href="/dashboard/contact"
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-center group"
            >
              <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">
                📧
              </span>
              <p className="text-sm font-medium text-gray-900">Messages</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

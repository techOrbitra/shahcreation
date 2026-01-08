"use client";

import { useEffect, useState } from "react";
import { useOrdersStore } from "@/store/ordersStore";
import type { Order, OrderStatus } from "@/types";
import { useRouter } from "next/navigation";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "yellow",
    bg: "bg-yellow-100 text-yellow-800",
  },
  confirmed: {
    label: "Confirmed",
    color: "blue",
    bg: "bg-blue-100 text-blue-800",
  },
  processing: {
    label: "Processing",
    color: "purple",
    bg: "bg-purple-100 text-purple-800",
  },
  shipped: {
    label: "Shipped",
    color: "indigo",
    bg: "bg-indigo-100 text-indigo-800",
  },
  delivered: {
    label: "Delivered",
    color: "green",
    bg: "bg-green-100 text-green-800",
  },
  cancelled: {
    label: "Cancelled",
    color: "red",
    bg: "bg-red-100 text-red-800",
  },
} as const;

export default function OrdersPage() {
  const router = useRouter();
  const {
    orders,
    isLoading,
    error,
    pagination,
    filters,
    stats,
    fetchOrders,
    fetchOrderStats,
    // setEditingOrder,
  } = useOrdersStore();
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchOrders({ search, page: 1 });
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStatusFilter = (status: OrderStatus | "") => {
    setStatusFilter(status);
    fetchOrders({ status: status || undefined, page: 1 });
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order.id));
    }
  };

  const toggleOrder = (id: number) => {
    setSelectedOrders((prev) =>
      prev.includes(id)
        ? prev.filter((orderId) => orderId !== id)
        : [...prev, id]
    );
  };
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    fetchOrders({
      sort: sort as any,
      page: 1,
      search,
      status: statusFilter || undefined,
    });
  };
  return (
    <div className="space-y-6">
      {/* Header - UPDATED */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Orders
          </h1>
          <p className="text-gray-600 mt-1">
            Manage customer orders and track deliveries
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">Total: {pagination.total}</div>
          <button
            onClick={() => router.push("/dashboard/orders/create")}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-lg">+</span>
            Create Order
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders.toLocaleString() || "0"}
          change="+12%"
          icon="🧾"
          color="bg-primary"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          change="+28%"
          icon="💰"
          color="bg-green-500"
        />
        <StatCard
          title="Pending"
          value={stats?.pendingOrders.toLocaleString() || "0"}
          change="+5%"
          icon="⏳"
          color="bg-yellow-500"
        />
        <StatCard
          title="Delivered"
          value={stats?.completedOrders.toLocaleString() || "0"}
          change="+15%"
          icon="✅"
          color="bg-green-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4 space-y-3 lg:space-y-0">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="  Search by customer name, phone or order #..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm"
            >
              Filters {showFilters ? "▲" : "▼"}
            </button>
            <select
              value={sortBy}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="amount-desc">High to Low</option>
              <option value="amount-asc">Low to High</option>
            </select>
          </div>
        </div>

        {/* Status Filters */}
        {showFilters && (
          <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t">
            <StatusFilterButton
              label="All"
              active={statusFilter === ""}
              onClick={() => handleStatusFilter("")}
            />
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <StatusFilterButton
                key={key}
                label={config.label}
                active={statusFilter === key}
                onClick={() => handleStatusFilter(key as OrderStatus)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-gray-600">Loading orders...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-4">🧾</div>
            <p className="text-lg mb-2">{error}</p>
            <button
              onClick={() => fetchOrders()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-5xl mb-4">🧾</div>
            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedOrders.length === orders.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Order #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <OrderTableRow
                      key={order.id}
                      order={order}
                      selected={selectedOrders.includes(order.id)}
                      onSelect={toggleOrder}
                      // REMOVE: onEdit={() => setEditingOrder(order)}
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <PaginationControls
              pagination={pagination}
              onPageChange={(page) =>
                fetchOrders({
                  page,
                  search,
                  status: statusFilter || undefined,
                  sort: sortBy,
                })
              }
            />
          </>
        )}
      </div>
    </div>
  );
}

// Individual components
function StatCard({
  title,
  value,
  change,
  icon,
  color,
}: {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="group hover:shadow-md transition-all rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p
            className={`text-xs font-medium mt-1 ${
              color === "bg-green-500" ? "text-green-600" : "text-gray-500"
            }`}
          >
            {change}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-lg`}
        >
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function StatusFilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
        active
          ? "bg-primary text-white shadow-md"
          : "bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-sm"
      }`}
    >
      {label}
    </button>
  );
}

function OrderTableRow({
  order,
  selected,
  onSelect,
  formatCurrency,
  formatDate,
}: {
  order: Order;
  selected: boolean;
  onSelect: (id: number) => void;
  formatCurrency: (n: number) => string;
  formatDate: (d: string) => string;
}) {
  const router = useRouter(); // Add router here in child component
  const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(order.id)}
          className="w-4 h-4 rounded border-gray-300"
        />
      </td>
      <td className="px-6 py-4">
        <div className="font-semibold text-gray-900">#{order.id}</div>
      </td>
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900">{order.customerName}</div>
        <div className="text-sm text-gray-500">{order.customerPhone}</div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 rounded-full">
          {order.items.length} items
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="font-bold text-gray-900">
          {formatCurrency(order.totalAmount)}
        </div>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg}`}
        >
          {config.label}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {formatDate(order.createdAt)}
      </td>
      <td className="px-6 py-4 text-right space-x-2">
        <button
          onClick={() => router.push(`/dashboard/orders/edit/${order.id}`)} // Navigate to edit page
          className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => {
            if (
              confirm(`Are you sure you want to delete order #${order.id}?`)
            ) {
              // Call delete function
            }
          }}
          className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

function PaginationControls({
  pagination,
  onPageChange,
}: {
  pagination: { page: number; pages: number; total: number; limit: number };
  onPageChange: (page: number) => void;
}) {
  const pages = Math.min(5, pagination.pages);
  const startPage = Math.max(1, pagination.page - 2);
  const endPage = Math.min(pagination.pages, startPage + pages - 1);

  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">
          Showing{" "}
          {((pagination.page - 1) * pagination.limit + 1).toLocaleString()} to{" "}
          {Math.min(
            pagination.page * pagination.limit,
            pagination.total
          ).toLocaleString()}{" "}
          of {pagination.total.toLocaleString()} results
        </div>
        <div className="flex items-center gap-1">
          <button
            disabled={pagination.page === 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                page === pagination.page
                  ? "bg-primary text-white"
                  : "border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={pagination.page === pagination.pages}
            onClick={() => onPageChange(pagination.page + 1)}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useOrdersStore } from "@/store/ordersStore";
import type { Order, OrderStatus } from "@/types";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "yellow" },
  confirmed: { label: "Confirmed", color: "blue" },
  processing: { label: "Processing", color: "purple" },
  shipped: { label: "Shipped", color: "indigo" },
  delivered: { label: "Delivered", color: "green" },
  cancelled: { label: "Cancelled", color: "red" },
} as const;

export default function OrderEditModal() {
  const { editingOrder, updateOrderStatus, updateOrder, setEditingOrder } =
    useOrdersStore();

  const [notes, setNotes] = useState(editingOrder?.notes || "");
  const [customerName, setCustomerName] = useState(
    editingOrder?.customerName || ""
  );
  const [customerPhone, setCustomerPhone] = useState(
    editingOrder?.customerPhone || ""
  );
  const [customerAddress, setCustomerAddress] = useState(
    editingOrder?.customerAddress || ""
  );
  const [status, setStatus] = useState<OrderStatus>(
    (editingOrder?.status as OrderStatus) || "pending"
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    setStatus(newStatus);
    if (editingOrder) {
      updateOrderStatus(editingOrder.id, newStatus);
    }
  };

  const handleSave = async () => {
    if (!editingOrder) return;

    await updateOrder(editingOrder.id, {
      customerName,
      customerPhone,
      customerAddress,
      notes,
    });
    setEditingOrder(null);
  };

  if (!editingOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Edit Order #{editingOrder.id}
            </h2>
            <button
              onClick={() => setEditingOrder(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Status
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleStatusChange(key as OrderStatus)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    status === key
                      ? `bg-${config.color}-500 text-white shadow-md`
                      : `bg-${config.color}-100 text-${config.color}-800 hover:bg-${config.color}-200`
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <textarea
                rows={3}
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                placeholder="Enter complete delivery address..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                placeholder="Special instructions, gift notes, etc..."
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>{editingOrder.items.length}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(editingOrder.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingOrder(null)}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

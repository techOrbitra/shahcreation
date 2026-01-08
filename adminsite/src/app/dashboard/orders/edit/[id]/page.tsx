"use client";

import { use, useEffect, useState } from "react"; // ADD 'use' here
import { useRouter } from "next/navigation";
import { useOrdersStore } from "@/store/ordersStore";
import { z } from "zod";
import type { Order, OrderStatus, OrderItem } from "@/types";

// Validation schemas
const OrderItemSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
  image: z.string().url("Invalid image URL"),
  size: z.string().optional(),
  color: z.string().optional(),
});

const EditOrderSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  customerWhatsapp: z
    .string()
    .regex(/^[0-9]{10}$/, "WhatsApp must be 10 digits")
    .optional()
    .or(z.literal("")),
  customerAddress: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .optional()
    .or(z.literal("")),
  items: z.array(OrderItemSchema).min(1, "At least one item required"),
  totalAmount: z.number().positive("Total amount must be positive"),
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
  notes: z.string().optional().or(z.literal("")),
});

type EditOrderFormData = z.infer<typeof EditOrderSchema>;

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "confirmed",
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "shipped",
    label: "Shipped",
    color: "bg-indigo-100 text-indigo-800",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-800",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
];

export default function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // FIXED: Unwrap params using React.use()
  const { id } = use(params);

  const router = useRouter();
  const { updateOrder, fetchOrderById, isLoading } = useOrdersStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState<EditOrderFormData>({
    customerName: "",
    customerPhone: "",
    customerWhatsapp: "",
    customerAddress: "",
    items: [],
    totalAmount: 0,
    status: "pending",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch order data
  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoadingData(true);
        const orderData = await fetchOrderById(Number(id)); // Use unwrapped id

        if (orderData) {
          setOrder(orderData);
          setFormData({
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
            customerWhatsapp: orderData.customerWhatsapp || "",
            customerAddress: orderData.customerAddress || "",
            items: orderData.items,
            totalAmount: orderData.totalAmount,
            status: orderData.status as OrderStatus,
            notes: orderData.notes || "",
          });
        }
      } catch (error) {
        console.error("Failed to load order:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadOrder();
  }, [id, fetchOrderById]); // Use unwrapped id

  // Calculate total amount from items
  const calculateTotal = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle item quantity change
  const handleItemQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = formData.items.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    const newTotal = calculateTotal(updatedItems);

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      totalAmount: newTotal,
    }));
  };

  // Remove item from order
  const handleRemoveItem = (itemId: number) => {
    if (formData.items.length <= 1) {
      setErrors({ items: "Order must have at least one item" });
      return;
    }

    const updatedItems = formData.items.filter((item) => item.id !== itemId);
    const newTotal = calculateTotal(updatedItems);

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      totalAmount: newTotal,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = EditOrderSchema.parse(formData);

      // Update order
      await updateOrder(Number(id), validatedData);

      // Show success message
      alert("Order updated successfully!");

      // Navigate back to orders page
      router.push("/dashboard/orders");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ submit: "Failed to update order. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The order you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/orders")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push("/dashboard/orders")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
          >
            ← Back to Orders
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Edit Order #{id}
          </h1>
          <p className="text-gray-600 mt-1">Update order details and status</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Customer Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.customerName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter customer name"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customerName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="text"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                maxLength={10}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.customerPhone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="10 digit phone number"
              />
              {errors.customerPhone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customerPhone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <input
                type="text"
                name="customerWhatsapp"
                value={formData.customerWhatsapp}
                onChange={handleChange}
                maxLength={10}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.customerWhatsapp ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="10 digit WhatsApp number"
              />
              {errors.customerWhatsapp && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customerWhatsapp}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <textarea
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.customerAddress ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter delivery address"
              />
              {errors.customerAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customerAddress}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Add any notes or special instructions"
              />
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
          {errors.items && (
            <p className="text-red-500 text-sm mb-4">{errors.items}</p>
          )}
          <div className="space-y-4">
            {formData.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                  {item.size && (
                    <p className="text-xs text-gray-500">Size: {item.size}</p>
                  )}
                  {item.color && (
                    <p className="text-xs text-gray-500">Color: {item.color}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleItemQuantityChange(item.id, item.quantity - 1)
                    }
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleItemQuantityChange(item.id, item.quantity + 1)
                    }
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={formData.items.length <= 1}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-xl font-bold">
              <span>Total Amount:</span>
              <span className="text-primary">
                {formatCurrency(formData.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push("/orders")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              "Update Order"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

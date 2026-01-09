"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useOrdersStore } from "@/store/ordersStore";
import { useClothesStore } from "@/store/clothesStore";
import { z } from "zod";
import type { OrderItem, OrderStatus, Cloth } from "@/types";

const STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const OrderItemSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
  image: z.string().min(1, "Image is required"),
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
  notes: z.string().optional(),
});

type EditOrderFormData = z.infer<typeof EditOrderSchema>;

export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    fetchOrderById,
    updateOrder,
    isLoading: orderLoading,
  } = useOrdersStore();
  const {
    clothes,
    fetchClothes,
    isLoading: clothesLoading,
  } = useClothesStore();

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
  const [loading, setLoading] = useState(true);

  // Product selection modal state
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchCloth, setSearchCloth] = useState("");
  const [selectedCloth, setSelectedCloth] = useState<Cloth | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemSize, setItemSize] = useState("");

  // Fetch order and clothes on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [order] = await Promise.all([
          fetchOrderById(Number(id)),
          fetchClothes({ limit: 100, page: 1 }),
        ]);

        if (order) {
          setFormData({
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            customerWhatsapp: order.customerWhatsapp || "",
            customerAddress: order.customerAddress || "",
            items: order.items,
            totalAmount: order.totalAmount,
            status: order.status,
            notes: order.notes || "",
          });
        }
      } catch (error) {
        console.error("Failed to load order:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, fetchOrderById, fetchClothes]);

  // Filter clothes based on search
  const filteredClothes = clothes.filter(
    (cloth) =>
      cloth.name.toLowerCase().includes(searchCloth.toLowerCase()) ||
      cloth.description.toLowerCase().includes(searchCloth.toLowerCase())
  );

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
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Select cloth from modal
  const handleSelectClothFromModal = (cloth: Cloth) => {
    setSelectedCloth(cloth);
    if (cloth.sizes && cloth.sizes.length > 0) {
      setItemSize(cloth.sizes[0]);
    }
  };

  // Add item to order
  // Add item to order (UPDATED - Check for duplicates)
  const handleAddItem = () => {
    if (!selectedCloth) {
      alert("Please select a product");
      return;
    }

    if (itemQuantity < 1) {
      alert("Quantity must be at least 1");
      return;
    }

    if (selectedCloth.stock < itemQuantity) {
      alert(`Only ${selectedCloth.stock} items available in stock`);
      return;
    }

    // Check if item with same ID and size already exists
    const existingItemIndex = formData.items.findIndex(
      (item) =>
        item.id === selectedCloth.id && item.size === (itemSize || undefined)
    );

    let updatedItems;

    if (existingItemIndex !== -1) {
      // Item exists - update quantity
      const existingItem = formData.items[existingItemIndex];
      const newQuantity = existingItem.quantity + itemQuantity;

      if (selectedCloth.stock < newQuantity) {
        alert(
          `Cannot add ${itemQuantity} more. Only ${
            selectedCloth.stock - existingItem.quantity
          } items left in stock`
        );
        return;
      }

      updatedItems = formData.items.map((item, index) =>
        index === existingItemIndex ? { ...item, quantity: newQuantity } : item
      );

      alert(`Updated quantity for ${selectedCloth.name}`);
    } else {
      // New item - add to list
      const newItem: OrderItem = {
        id: selectedCloth.id,
        name: selectedCloth.name,
        quantity: itemQuantity,
        price: selectedCloth.price,
        image: selectedCloth.images[0] || "https://via.placeholder.com/80",
        size: itemSize || undefined,
      };

      updatedItems = [...formData.items, newItem];
    }

    const newTotal = calculateTotal(updatedItems);

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      totalAmount: newTotal,
    }));

    // Reset and close modal
    setSelectedCloth(null);
    setSearchCloth("");
    setItemQuantity(1);
    setItemSize("");
    setShowProductModal(false);

    if (errors.items) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.items;
        return newErrors;
      });
    }
  };

  // Remove item from order
  const handleRemoveItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const newTotal = calculateTotal(updatedItems);

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      totalAmount: newTotal,
    }));
  };

  // Update item quantity
  const handleItemQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = formData.items.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    );
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
      await updateOrder(Number(id), validatedData);
      alert("Order updated successfully!");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-gray-600">Loading order...</span>
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
          <p className="text-gray-600 mt-1">Update order details and items</p>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.status ? "border-red-500" : "border-gray-300"
                }`}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
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
                placeholder="Add any notes about this order..."
              />
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
            <button
              type="button"
              onClick={() => setShowProductModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Product
            </button>
          </div>

          {errors.items && (
            <p className="text-red-500 text-sm mb-4">{errors.items}</p>
          )}

          {formData.items.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-5xl mb-4">📦</div>
              <p className="font-medium">No items in order</p>
              <p className="text-sm">Click "Add Product" to add items</p>
            </div>
          ) : (
            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/80";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                    {item.size && (
                      <p className="text-xs text-gray-500">Size: {item.size}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleItemQuantityChange(index, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleItemQuantityChange(index, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          {formData.items.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-xl font-bold">
                <span>Total Amount:</span>
                <span className="text-primary">
                  {formatCurrency(formData.totalAmount)}
                </span>
              </div>
            </div>
          )}
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
            onClick={() => router.push("/dashboard/orders")}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || formData.items.length === 0}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <span>✓</span>
                Update Order
              </>
            )}
          </button>
        </div>
      </form>

      {/* Product Selection Modal - SAME AS CREATE PAGE */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Select Product
                </h2>
                <button
                  onClick={() => {
                    setShowProductModal(false);
                    setSelectedCloth(null);
                    setSearchCloth("");
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="mt-4">
                <input
                  type="text"
                  value={searchCloth}
                  onChange={(e) => setSearchCloth(e.target.value)}
                  placeholder="Search products by name..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>

            {/* Modal Body - Product List */}
            <div className="flex-1 overflow-y-auto p-6">
              {clothesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="ml-3 text-gray-600">
                    Loading products...
                  </span>
                </div>
              ) : filteredClothes.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="text-5xl mb-4">🔍</div>
                  <p>No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredClothes.map((cloth) => (
                    <button
                      key={cloth.id}
                      type="button"
                      onClick={() => handleSelectClothFromModal(cloth)}
                      className={`flex items-start gap-4 p-4 border-2 rounded-lg hover:border-primary transition-all text-left ${
                        selectedCloth?.id === cloth.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={
                          cloth.images[0] || "https://via.placeholder.com/80"
                        }
                        alt={cloth.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/80";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {cloth.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatCurrency(cloth.price)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Stock: {cloth.stock}
                        </p>
                      </div>
                      {selectedCloth?.id === cloth.id && (
                        <div className="text-primary text-xl">✓</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer - Selected Product Details */}
            {selectedCloth && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        selectedCloth.images[0] ||
                        "https://via.placeholder.com/60"
                      }
                      alt={selectedCloth.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {selectedCloth.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formatCurrency(selectedCloth.price)} • Stock:{" "}
                        {selectedCloth.stock}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        value={itemQuantity}
                        onChange={(e) =>
                          setItemQuantity(Number(e.target.value))
                        }
                        min="1"
                        max={selectedCloth.stock}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    {selectedCloth.sizes && selectedCloth.sizes.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Size
                        </label>
                        <select
                          value={itemSize}
                          onChange={(e) => setItemSize(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          {selectedCloth.sizes.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductModal(false);
                        setSelectedCloth(null);
                        setSearchCloth("");
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Add to Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

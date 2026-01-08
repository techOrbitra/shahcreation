// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useOrdersStore } from "@/store/ordersStore";
// import { z } from "zod";
// import type { OrderItem, OrderStatus } from "@/types";

// // Validation schemas
// const OrderItemSchema = z.object({
//   id: z.number().positive(),
//   name: z.string().min(1, "Item name is required"),
//   quantity: z.number().int().positive("Quantity must be positive"),
//   price: z.number().positive("Price must be positive"),
//   image: z.string().url("Invalid image URL"),
//   size: z.string().optional(),
//   color: z.string().optional(),
// });

// const CreateOrderSchema = z.object({
//   customerName: z.string().min(2, "Name must be at least 2 characters"),
//   customerPhone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
//   customerWhatsapp: z
//     .string()
//     .regex(/^[0-9]{10}$/, "WhatsApp must be 10 digits")
//     .optional()
//     .or(z.literal("")),
//   customerAddress: z
//     .string()
//     .min(10, "Address must be at least 10 characters")
//     .optional()
//     .or(z.literal("")),
//   items: z.array(OrderItemSchema).min(1, "At least one item required"),
//   totalAmount: z.number().positive("Total amount must be positive"),
// });

// type CreateOrderFormData = z.infer<typeof CreateOrderSchema>;

// export default function CreateOrderPage() {
//   const router = useRouter();
//   const { createOrder, isLoading } = useOrdersStore();

//   const [formData, setFormData] = useState<CreateOrderFormData>({
//     customerName: "",
//     customerPhone: "",
//     customerWhatsapp: "",
//     customerAddress: "",
//     items: [],
//     totalAmount: 0,
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Item form state
//   const [itemForm, setItemForm] = useState({
//     id: Date.now(),
//     name: "",
//     quantity: 1,
//     price: 0,
//     image: "",
//     size: "",
//     color: "",
//   });

//   // Calculate total amount from items
//   const calculateTotal = (items: OrderItem[]) => {
//     return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   };

//   // Handle form field changes
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   // Handle item form changes
//   const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setItemForm((prev) => ({
//       ...prev,
//       [name]: name === "quantity" || name === "price" ? Number(value) : value,
//     }));
//   };

//   // Add item to order
//   const handleAddItem = () => {
//     if (!itemForm.name || !itemForm.price || !itemForm.image) {
//       alert("Please fill all required item fields (Name, Price, Image)");
//       return;
//     }

//     const newItem: OrderItem = {
//       id: Date.now(),
//       name: itemForm.name,
//       quantity: itemForm.quantity,
//       price: itemForm.price,
//       image: itemForm.image,
//       size: itemForm.size || undefined,
//       color: itemForm.color || undefined,
//     };

//     const updatedItems = [...formData.items, newItem];
//     const newTotal = calculateTotal(updatedItems);

//     setFormData((prev) => ({
//       ...prev,
//       items: updatedItems,
//       totalAmount: newTotal,
//     }));

//     // Reset item form
//     setItemForm({
//       id: Date.now(),
//       name: "",
//       quantity: 1,
//       price: 0,
//       image: "",
//       size: "",
//       color: "",
//     });

//     // Clear items error
//     if (errors.items) {
//       setErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors.items;
//         return newErrors;
//       });
//     }
//   };

//   // Remove item from order
//   const handleRemoveItem = (itemId: number) => {
//     const updatedItems = formData.items.filter((item) => item.id !== itemId);
//     const newTotal = calculateTotal(updatedItems);

//     setFormData((prev) => ({
//       ...prev,
//       items: updatedItems,
//       totalAmount: newTotal,
//     }));
//   };

//   // Update item quantity
//   const handleItemQuantityChange = (itemId: number, newQuantity: number) => {
//     if (newQuantity < 1) return;

//     const updatedItems = formData.items.map((item) =>
//       item.id === itemId ? { ...item, quantity: newQuantity } : item
//     );
//     const newTotal = calculateTotal(updatedItems);

//     setFormData((prev) => ({
//       ...prev,
//       items: updatedItems,
//       totalAmount: newTotal,
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});
//     setIsSubmitting(true);

//     try {
//       // Validate with Zod
//       const validatedData = CreateOrderSchema.parse(formData);

//       // Create order
//       await createOrder(validatedData);

//       // Show success message
//       alert("Order created successfully!");
//       router.push("/dashboard/orders");
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         // Handle Zod validation errors
//         const fieldErrors: Record<string, string> = {};
//         error.issues.forEach((issue) => {
//           if (issue.path.length > 0) {
//             fieldErrors[issue.path[0] as string] = issue.message;
//           }
//         });
//         setErrors(fieldErrors);
//       } else {
//         setErrors({ submit: "Failed to create order. Please try again." });
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//     }).format(amount);
//   };

//   return (
//     <div className="max-w-5xl mx-auto space-y-6 pb-8">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <button
//             onClick={() => router.push("/dashboard/orders")}
//             className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
//           >
//             ← Back to Orders
//           </button>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//             Create New Order
//           </h1>
//           <p className="text-gray-600 mt-1">Add order details and items</p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Customer Information */}
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">
//             Customer Information
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Customer Name *
//               </label>
//               <input
//                 type="text"
//                 name="customerName"
//                 value={formData.customerName}
//                 onChange={handleChange}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
//                   errors.customerName ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter customer name"
//               />
//               {errors.customerName && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.customerName}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number *
//               </label>
//               <input
//                 type="text"
//                 name="customerPhone"
//                 value={formData.customerPhone}
//                 onChange={handleChange}
//                 maxLength={10}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
//                   errors.customerPhone ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="10 digit phone number"
//               />
//               {errors.customerPhone && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.customerPhone}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 WhatsApp Number
//               </label>
//               <input
//                 type="text"
//                 name="customerWhatsapp"
//                 value={formData.customerWhatsapp}
//                 onChange={handleChange}
//                 maxLength={10}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
//                   errors.customerWhatsapp ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="10 digit WhatsApp number"
//               />
//               {errors.customerWhatsapp && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.customerWhatsapp}
//                 </p>
//               )}
//             </div>

//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Delivery Address
//               </label>
//               <textarea
//                 name="customerAddress"
//                 value={formData.customerAddress}
//                 onChange={handleChange}
//                 rows={3}
//                 className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
//                   errors.customerAddress ? "border-red-500" : "border-gray-300"
//                 }`}
//                 placeholder="Enter delivery address"
//               />
//               {errors.customerAddress && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.customerAddress}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Add Items Section */}
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">Add Items</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Item Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={itemForm.name}
//                 onChange={handleItemChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//                 placeholder="e.g., T-Shirt"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Quantity *
//               </label>
//               <input
//                 type="number"
//                 name="quantity"
//                 value={itemForm.quantity}
//                 onChange={handleItemChange}
//                 min="1"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Price (₹) *
//               </label>
//               <input
//                 type="number"
//                 name="price"
//                 value={itemForm.price}
//                 onChange={handleItemChange}
//                 min="0"
//                 step="0.01"
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//                 placeholder="0.00"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Image URL *
//               </label>
//               <input
//                 type="url"
//                 name="image"
//                 value={itemForm.image}
//                 onChange={handleItemChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//                 placeholder="https://example.com/image.jpg"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Size (Optional)
//               </label>
//               <input
//                 type="text"
//                 name="size"
//                 value={itemForm.size}
//                 onChange={handleItemChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//                 placeholder="e.g., M, L, XL"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Color (Optional)
//               </label>
//               <input
//                 type="text"
//                 name="color"
//                 value={itemForm.color}
//                 onChange={handleItemChange}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
//                 placeholder="e.g., Red, Blue"
//               />
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={handleAddItem}
//             className="w-full px-4 py-3 border-2 border-dashed border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
//           >
//             <span className="text-xl">+</span>
//             Add Item to Order
//           </button>
//         </div>

//         {/* Order Items List */}
//         <div className="bg-white rounded-xl shadow-sm p-6">
//           <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
//           {errors.items && (
//             <p className="text-red-500 text-sm mb-4">{errors.items}</p>
//           )}

//           {formData.items.length === 0 ? (
//             <div className="text-center py-12 text-gray-500">
//               <div className="text-5xl mb-4">📦</div>
//               <p>No items added yet</p>
//               <p className="text-sm">Add items using the form above</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {formData.items.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
//                 >
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-20 h-20 object-cover rounded-lg"
//                     onError={(e) => {
//                       e.currentTarget.src =
//                         "https://via.placeholder.com/80?text=No+Image";
//                     }}
//                   />
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-gray-900">{item.name}</h3>
//                     <p className="text-sm text-gray-600">
//                       {formatCurrency(item.price)} × {item.quantity}
//                     </p>
//                     {item.size && (
//                       <p className="text-xs text-gray-500">Size: {item.size}</p>
//                     )}
//                     {item.color && (
//                       <p className="text-xs text-gray-500">
//                         Color: {item.color}
//                       </p>
//                     )}
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       type="button"
//                       onClick={() =>
//                         handleItemQuantityChange(item.id, item.quantity - 1)
//                       }
//                       className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
//                     >
//                       −
//                     </button>
//                     <span className="w-12 text-center font-medium">
//                       {item.quantity}
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() =>
//                         handleItemQuantityChange(item.id, item.quantity + 1)
//                       }
//                       className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
//                     >
//                       +
//                     </button>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-bold text-gray-900">
//                       {formatCurrency(item.price * item.quantity)}
//                     </p>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveItem(item.id)}
//                     className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                   >
//                     🗑️
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Total */}
//           {formData.items.length > 0 && (
//             <div className="mt-6 pt-6 border-t border-gray-200">
//               <div className="flex items-center justify-between text-xl font-bold">
//                 <span>Total Amount:</span>
//                 <span className="text-primary">
//                   {formatCurrency(formData.totalAmount)}
//                 </span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Error Message */}
//         {errors.submit && (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//             <p className="text-red-600">{errors.submit}</p>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="flex items-center justify-end gap-4">
//           <button
//             type="button"
//             onClick={() => router.push("/dashboard/orders")}
//             className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting || formData.items.length === 0}
//             className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//           >
//             {isSubmitting ? (
//               <>
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 Creating...
//               </>
//             ) : (
//               <>
//                 <span>✓</span>
//                 Create Order
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrdersStore } from "@/store/ordersStore";
import { useClothesStore } from "@/store/clothesStore";
import { z } from "zod";
import type { OrderItem, Cloth } from "@/types";

// Validation schemas
const OrderItemSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
  price: z.number().positive("Price must be positive"),
  image: z.string().min(1, "Image is required"),
  size: z.string().optional(),
  color: z.string().optional(),
});

const CreateOrderSchema = z.object({
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
});

type CreateOrderFormData = z.infer<typeof CreateOrderSchema>;

export default function CreateOrderPage() {
  const router = useRouter();
  const { createOrder, isLoading: orderLoading } = useOrdersStore();
  const {
    clothes,
    fetchClothes,
    isLoading: clothesLoading,
  } = useClothesStore();

  const [formData, setFormData] = useState<CreateOrderFormData>({
    customerName: "",
    customerPhone: "",
    customerWhatsapp: "",
    customerAddress: "",
    items: [],
    totalAmount: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Item selection state
  const [selectedClothId, setSelectedClothId] = useState<number | null>(null);
  const [selectedCloth, setSelectedCloth] = useState<Cloth | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemSize, setItemSize] = useState("");
  const [searchCloth, setSearchCloth] = useState("");
  const [showClothDropdown, setShowClothDropdown] = useState(false);

  // Fetch clothes on mount
  useEffect(() => {
    fetchClothes({ limit: 100, page: 1 });
  }, [fetchClothes]);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  // Select cloth
  const handleSelectCloth = (cloth: Cloth) => {
    setSelectedCloth(cloth);
    setSelectedClothId(cloth.id);
    setSearchCloth(cloth.name);
    setShowClothDropdown(false);
    if (cloth.sizes && cloth.sizes.length > 0) {
      setItemSize(cloth.sizes[0]);
    }
  };

  // Add item to order
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

    const newItem: OrderItem = {
      id: selectedCloth.id,
      name: selectedCloth.name,
      quantity: itemQuantity,
      price: selectedCloth.price,
      image: selectedCloth.images[0] || "https://via.placeholder.com/80",
      size: itemSize || undefined,
    };

    const updatedItems = [...formData.items, newItem];
    const newTotal = calculateTotal(updatedItems);

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      totalAmount: newTotal,
    }));

    // Reset selection
    setSelectedCloth(null);
    setSelectedClothId(null);
    setSearchCloth("");
    setItemQuantity(1);
    setItemSize("");

    // Clear items error
    if (errors.items) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.items;
        return newErrors;
      });
    }
  };

  // Remove item from order
  const handleRemoveItem = (itemId: number) => {
    const updatedItems = formData.items.filter((item) => item.id !== itemId);
    const newTotal = calculateTotal(updatedItems);

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
      totalAmount: newTotal,
    }));
  };

  // Update item quantity
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate with Zod
      const validatedData = CreateOrderSchema.parse(formData);

      // Create order
      await createOrder(validatedData);

      // Show success message
      alert("Order created successfully!");
      router.push("/dashboard/orders");
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path.length > 0) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ submit: "Failed to create order. Please try again." });
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
            Create New Order
          </h1>
          <p className="text-gray-600 mt-1">Add order details and items</p>
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
          </div>
        </div>

        {/* Add Items Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add Items</h2>

          {/* Product Search/Select */}
          <div className="space-y-4 mb-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Product *
              </label>
              <input
                type="text"
                value={searchCloth}
                onChange={(e) => {
                  setSearchCloth(e.target.value);
                  setShowClothDropdown(true);
                }}
                onFocus={() => setShowClothDropdown(true)}
                placeholder="Search products..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />

              {/* Dropdown */}
              {showClothDropdown && filteredClothes.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {clothesLoading ? (
                    <div className="p-4 text-center text-gray-500">
                      Loading...
                    </div>
                  ) : (
                    filteredClothes.map((cloth) => (
                      <button
                        key={cloth.id}
                        type="button"
                        onClick={() => handleSelectCloth(cloth)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <img
                          src={
                            cloth.images[0] || "https://via.placeholder.com/50"
                          }
                          alt={cloth.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/50";
                          }}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {cloth.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(cloth.price)} • Stock: {cloth.stock}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Selected Product Details */}
            {selectedCloth && (
              <div className="border border-primary/30 bg-primary/5 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      selectedCloth.images[0] ||
                      "https://via.placeholder.com/80"
                    }
                    alt={selectedCloth.name}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/80";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {selectedCloth.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(selectedCloth.price)} • Available:{" "}
                      {selectedCloth.stock}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(Number(e.target.value))}
                      min="1"
                      max={selectedCloth.stock}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Size */}
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

                  {/* Add Button */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      Add to Order
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Items List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
          {errors.items && (
            <p className="text-red-500 text-sm mb-4">{errors.items}</p>
          )}

          {formData.items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-5xl mb-4">📦</div>
              <p>No items added yet</p>
              <p className="text-sm">Select products to add to this order</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
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
                Creating...
              </>
            ) : (
              <>
                <span>✓</span>
                Create Order
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

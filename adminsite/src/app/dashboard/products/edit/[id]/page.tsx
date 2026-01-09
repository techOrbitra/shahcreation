"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useProductsStore } from "@/store/productsStore";
import { useCategoryStore } from "@/store/categoryStore";
import ImageUpload from "@/components/ImageUpload";
import DynamicAttributes from "@/components/DynamicAttributes";
import { PRODUCT_TYPE_CONFIG } from "@/config/productTypes";
import type { CreateProductData, Product, ProductType } from "@/types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { updateProduct, isLoading } = useProductsStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    oldPrice: null,
    images: [],
    productType: "clothes",
    attributes: {},
    brand: "",
    origin: "India",
    warranty: "",
    stock: 0,
    isActive: true,
    isFeatured: false,
    categoryIds: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch product");

      const data = await response.json();
      const product = data.data;

      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        oldPrice: product.oldPrice,
        images: product.images || [],
        productType: product.productType,
        attributes: product.attributes || {},
        brand: product.brand || "",
        origin: product.origin || "India",
        warranty: product.warranty || "",
        stock: product.stock,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        categoryIds: product.categoryIds || [],
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to load product");
      router.push("/dashboard/products");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleProductTypeChange = (productType: ProductType) => {
    if (
      confirm(
        "Changing product type will reset product-specific attributes. Continue?"
      )
    ) {
      setFormData({
        ...formData,
        productType,
        attributes: {},
      });
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    const currentCategories = formData.categoryIds || [];
    if (currentCategories.includes(categoryId)) {
      setFormData({
        ...formData,
        categoryIds: currentCategories.filter((id) => id !== categoryId),
      });
    } else {
      setFormData({
        ...formData,
        categoryIds: [...currentCategories, categoryId],
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Price must be greater than 0";
    if (formData.oldPrice && formData.oldPrice <= formData.price) {
      newErrors.oldPrice = "Old price must be greater than current price";
    }
    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateProduct(id, formData);
      router.push("/dashboard/products");
    } catch (error) {
      console.error("Failed to update product");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Edit Product
          </h1>
          <p className="text-gray-600 mt-1">
            Update product details and information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Type Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Product Type *
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(PRODUCT_TYPE_CONFIG).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleProductTypeChange(key as ProductType)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.productType === key
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-3xl mb-2">{config.icon}</div>
                <div className="text-sm font-medium">{config.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                className={`w-full px-4 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none`}
                placeholder="e.g., Premium Cotton T-Shirt"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Slug */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className={`w-full px-4 py-2 border ${
                  errors.slug ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none`}
                placeholder="premium-cotton-t-shirt"
              />
              {errors.slug && (
                <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                className={`w-full px-4 py-2 border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none`}
                placeholder="Detailed product description..."
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className={`w-full px-4 py-2 border ${
                  errors.price ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none`}
                placeholder="999"
              />
              {errors.price && (
                <p className="text-sm text-red-600 mt-1">{errors.price}</p>
              )}
            </div>

            {/* Old Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Old Price (₹)
              </label>
              <input
                type="number"
                min="0"
                value={formData.oldPrice || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    oldPrice: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className={`w-full px-4 py-2 border ${
                  errors.oldPrice ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none`}
                placeholder="1499"
              />
              {errors.oldPrice && (
                <p className="text-sm text-red-600 mt-1">{errors.oldPrice}</p>
              )}
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <input
                type="text"
                value={formData.brand || ""}
                onChange={(e) =>
                  setFormData({ ...formData, brand: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="e.g., Nike, Adidas"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stock || ""}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="100"
              />
            </div>

            {/* Origin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origin
              </label>
              <input
                type="text"
                value={formData.origin}
                onChange={(e) =>
                  setFormData({ ...formData, origin: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="India"
              />
            </div>

            {/* Warranty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warranty
              </label>
              <input
                type="text"
                value={formData.warranty || ""}
                onChange={(e) =>
                  setFormData({ ...formData, warranty: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="e.g., 1 Year"
              />
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Product Images *
          </h2>
          {errors.images && (
            <p className="text-sm text-red-600 mb-4">{errors.images}</p>
          )}
          <ImageUpload
            images={formData.images}
            onImagesChange={(images) => setFormData({ ...formData, images })}
            maxImages={10}
          />
        </div>

        {/* Dynamic Attributes */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <DynamicAttributes
            productType={formData.productType}
            attributes={formData.attributes}
            onChange={(attributes) => setFormData({ ...formData, attributes })}
          />
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryToggle(category.id)}
                className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                  formData.categoryIds.includes(category.id)
                    ? "border-primary bg-primary text-white"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Status Toggles */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <div>
                <div className="font-medium text-gray-900">Active</div>
                <div className="text-sm text-gray-500">
                  Product will be visible in store
                </div>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <div>
                <div className="font-medium text-gray-900">Featured</div>
                <div className="text-sm text-gray-500">
                  Show in featured products section
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              "Update Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

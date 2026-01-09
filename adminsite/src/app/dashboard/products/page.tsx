"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductsStore } from "@/store/productsStore";
import { useCategoryStore } from "@/store/categoryStore";
import { PRODUCT_TYPE_CONFIG } from "@/config/productTypes";
import type { Product, ProductType } from "@/types";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

export default function ProductsPage() {
  const router = useRouter();
  const {
    products,
    isLoading,
    error,
    pagination,
    filters,
    fetchProducts,
    deleteProduct,
    toggleFeatured,
    setFilters,
  } = useProductsStore();

  const { categories, fetchCategories } = useCategoryStore();

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery, page: 1 });
    fetchProducts({ ...filters, search: searchQuery, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    fetchProducts({ ...filters, page });
  };

  const handleSortChange = (sort: string) => {
    setFilters({ ...filters, sort: sort as any, page: 1 });
    fetchProducts({ ...filters, sort: sort as any, page: 1 });
  };

  const handleProductTypeFilter = (productType: string) => {
    setFilters({ ...filters, productType, page: 1 });
    fetchProducts({ ...filters, productType, page: 1 });
  };

  const handleCategoryFilter = (categorySlug: string) => {
    setFilters({ ...filters, category: categorySlug, page: 1 });
    fetchProducts({ ...filters, category: categorySlug, page: 1 });
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      alert("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleToggleFeatured = async (id: number, currentStatus: boolean) => {
    try {
      await toggleFeatured(id, !currentStatus);
    } catch (error) {
      alert("Failed to update featured status");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      page: 1,
      limit: 12,
      search: "",
      category: "",
      productType: "",
      minPrice: 0,
      maxPrice: 1000000,
      sort: "newest",
      featured: "",
    });
    fetchProducts({
      page: 1,
      limit: 12,
      search: "",
      category: "",
      productType: "",
      minPrice: 0,
      maxPrice: 1000000,
      sort: "newest",
      featured: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Products
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your product inventory ({pagination.total} products)
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/products/create")}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors flex items-center gap-2 justify-center"
        >
          <span className="text-lg">+</span>
          <span>Add Product</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <span>Filters</span>
            {(filters.productType || filters.category || filters.featured) && (
              <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-4">
            {/* Product Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleProductTypeFilter("")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filters.productType === ""
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                {Object.entries(PRODUCT_TYPE_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => handleProductTypeFilter(key)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                      filters.productType === key
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCategoryFilter("")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filters.category === ""
                      ? "bg-primary text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.slug)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filters.category === category.slug
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Filter */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.featured === "true"}
                  onChange={(e) => {
                    const featured = e.target.checked ? "true" : "";
                    setFilters({ ...filters, featured, page: 1 });
                    fetchProducts({ ...filters, featured, page: 1 });
                  }}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">
                  Show Featured Only
                </span>
              </label>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <span className="text-red-600 text-xl">⚠️</span>
          <p className="text-sm text-red-800 flex-1">{error}</p>
        </div>
      )}

      {/* Products Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-6xl mb-4 block">📦</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filters.productType || filters.category
                ? "Try adjusting your search or filters"
                : "Get started by adding your first product"}
            </p>
            {!searchQuery && !filters.productType && !filters.category && (
              <button
                onClick={() => router.push("/dashboard/products/create")}
                className="inline-block px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
              >
                Add Product
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDeleteClick}
                  onToggleFeatured={handleToggleFeatured}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} products
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Previous
                    </button>
                    {Array.from(
                      { length: Math.min(5, pagination.pages) },
                      (_, i) => {
                        const startPage = Math.max(1, pagination.page - 2);
                        const page = startPage + i;
                        if (page > pagination.pages) return null;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              pagination.page === page
                                ? "bg-primary text-white"
                                : "border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      }
                    )}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={
          productToDelete
            ? `Are you sure you want to delete "${productToDelete.name}"? This will permanently remove the product and all its images from the system.`
            : ""
        }
        isDeleting={isDeleting}
      />
    </div>
  );
}

// Product Card Component
function ProductCard({
  product,
  onDelete,
  onToggleFeatured,
  formatCurrency,
}: {
  product: Product;
  onDelete: (product: Product) => void;
  onToggleFeatured: (id: number, currentStatus: boolean) => void;
  formatCurrency: (amount: number) => string;
}) {
  const router = useRouter();
  const productTypeConfig = PRODUCT_TYPE_CONFIG[product.productType];

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all group">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {productTypeConfig?.icon || "📦"}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded shadow-sm">
              ⭐ Featured
            </span>
          )}
          {product.stock === 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded shadow-sm">
              Out of Stock
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded shadow-sm">
              Low Stock
            </span>
          )}
        </div>

        {/* Product Type Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded shadow-sm flex items-center gap-1">
            <span>{productTypeConfig?.icon}</span>
            <span>{productTypeConfig?.label}</span>
          </span>
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleFeatured(product.id, product.isFeatured)}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
            title={
              product.isFeatured ? "Remove from featured" : "Mark as featured"
            }
          >
            <span className="text-xl">{product.isFeatured ? "⭐" : "☆"}</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Categories */}
        {product.categories && product.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {cat.name}
              </span>
            ))}
            {product.categories.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                +{product.categories.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 mb-2">Brand: {product.brand}</p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(product.oldPrice)}
            </span>
          )}
          {product.oldPrice && (
            <span className="text-xs text-green-600 font-medium">
              {Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100
              )}
              % OFF
            </span>
          )}
        </div>

        {/* Stock */}
        <div className="flex items-center justify-between mb-3 text-sm">
          <span className="text-gray-600">Stock:</span>
          <span
            className={`font-medium ${
              product.stock === 0
                ? "text-red-600"
                : product.stock <= 5
                ? "text-orange-600"
                : "text-green-600"
            }`}
          >
            {product.stock} units
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() =>
              router.push(`/dashboard/products/edit/${product.id}`)
            }
            className="flex-1 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors text-center"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

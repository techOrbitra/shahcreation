'use client';

import { useEffect, useState } from 'react';
import { useClothesStore } from '@/store/clothesStore';
import { useCategoryStore } from '@/store/categoryStore';
import type { Cloth, CreateClothData } from '@/types';

export default function ClothesPage() {
  const {
    clothes,
    isLoading,
    error,
    pagination,
    filters,
    fetchClothes,
    deleteCloth,
    toggleFeatured,
    setFilters,
  } = useClothesStore();

  const { categories, fetchCategories } = useCategoryStore();

  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedClothes, setSelectedClothes] = useState<number[]>([]);

  useEffect(() => {
    fetchClothes();
    fetchCategories();
  }, [fetchClothes, fetchCategories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery, page: 1 });
    fetchClothes({ ...filters, search: searchQuery, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    fetchClothes({ ...filters, page });
  };

  const handleSortChange = (sort: string) => {
    setFilters({ ...filters, sort: sort as any, page: 1 });
    fetchClothes({ ...filters, sort: sort as any, page: 1 });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await deleteCloth(id);
    }
  };

  const handleToggleFeatured = async (id: number, currentStatus: boolean) => {
    await toggleFeatured(id, !currentStatus);
  };

  const handleSelectAll = () => {
    if (selectedClothes.length === clothes.length) {
      setSelectedClothes([]);
    } else {
      setSelectedClothes(clothes.map((c) => c.id));
    }
  };

  const handleSelectOne = (id: number) => {
    if (selectedClothes.includes(id)) {
      setSelectedClothes(selectedClothes.filter((cid) => cid !== id));
    } else {
      setSelectedClothes([...selectedClothes, id]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your clothing inventory ({pagination.total} products)
          </p>
        </div>
        <a
          href="/dashboard/clothes/create"
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors flex items-center gap-2 justify-center"
        >
          <span className="text-lg">+</span>
          <span>Add Product</span>
        </a>
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
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="flex items-center gap-2">
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
              Filters
            </span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg flex items-start gap-3">
          <span className="text-danger text-xl">⚠️</span>
          <p className="text-sm text-danger flex-1">{error}</p>
        </div>
      )}

      {/* Products Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : clothes.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-6xl mb-4 block">👕</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first product'}
            </p>
            {!searchQuery && (
              <a
                href="/dashboard/clothes/create"
                className="inline-block px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
              >
                Add Product
              </a>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {clothes.map((cloth) => (
                <div
                  key={cloth.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100">
                    {cloth.images && cloth.images.length > 0 ? (
                      <img
                        src={cloth.images[0]}
                        alt={cloth.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        👕
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-2">
                      {cloth.isFeatured && (
                        <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                          Featured
                        </span>
                      )}
                      {cloth.stock === 0 && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                          Out of Stock
                        </span>
                      )}
                      {cloth.stock > 0 && cloth.stock <= 5 && (
                        <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded">
                          Low Stock
                        </span>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleToggleFeatured(cloth.id, cloth.isFeatured)}
                        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 mb-2"
                        title={cloth.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <span className="text-xl">{cloth.isFeatured ? '⭐' : '☆'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {cloth.name}
                    </h3>
                    
                    {/* Categories */}
                    {cloth.categories && cloth.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {cloth.categories.slice(0, 2).map((cat) => (
                          <span
                            key={cat.id}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                          >
                            {cat.name}
                          </span>
                        ))}
                        {cloth.categories.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            +{cloth.categories.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(cloth.price)}
                      </span>
                      {cloth.oldPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(cloth.oldPrice)}
                        </span>
                      )}
                    </div>

                    {/* Stock */}
                    <div className="flex items-center justify-between mb-3 text-sm">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-medium ${cloth.stock === 0 ? 'text-red-600' : cloth.stock <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                        {cloth.stock} units
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <a
                        href={`/dashboard/clothes/edit/${cloth.id}`}
                        className="flex-1 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors text-center"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleDelete(cloth.id)}
                        className="flex-1 px-3 py-1.5 text-sm font-medium text-danger hover:bg-danger/10 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} products
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-lg ${
                            pagination.page === page
                              ? 'bg-primary text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                      className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useContactStore } from "@/store/contactStore";
import type { ContactInquiry } from "@/types/contact";
import InquiryDetailModal from "@/components/InquiryDetailModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

export default function InquiriesPage() {
  const router = useRouter();
  const {
    inquiries,
    pagination,
    unreadCount,
    filters,
    isLoading,
    fetchInquiries,
    toggleReadStatus,
    bulkMarkAsRead,
    deleteInquiry,
    bulkDeleteInquiries,
    exportInquiries,
    setFilters,
  } = useContactStore();

  const [selectedInquiries, setSelectedInquiries] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState(filters.search || "");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<ContactInquiry | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery, page: 1 });
    fetchInquiries({ ...filters, search: searchQuery, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    fetchInquiries({ ...filters, page });
  };

  const handleSortChange = (sort: string) => {
    setFilters({ ...filters, sort: sort as any, page: 1 });
    fetchInquiries({ ...filters, sort: sort as any, page: 1 });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value, page: 1 });
    fetchInquiries({ ...filters, [key]: value, page: 1 });
  };

  const handleSelectAll = () => {
    if (selectedInquiries.length === inquiries.length) {
      setSelectedInquiries([]);
    } else {
      setSelectedInquiries(inquiries.map((i) => i.id));
    }
  };

  const handleSelectInquiry = (id: number) => {
    if (selectedInquiries.includes(id)) {
      setSelectedInquiries(selectedInquiries.filter((i) => i !== id));
    } else {
      setSelectedInquiries([...selectedInquiries, id]);
    }
  };

  const handleViewInquiry = async (inquiry: ContactInquiry) => {
    setSelectedInquiry(inquiry);
    setShowDetailModal(true);
    if (!inquiry.isRead) {
      await toggleReadStatus(inquiry.id, true);
    }
  };

  const handleToggleRead = async (inquiry: ContactInquiry) => {
    await toggleReadStatus(inquiry.id, !inquiry.isRead);
  };

  const handleBulkMarkAsRead = async () => {
    if (selectedInquiries.length === 0) {
      alert("Please select inquiries to mark as read");
      return;
    }
    await bulkMarkAsRead(selectedInquiries);
    setSelectedInquiries([]);
  };

  const handleDeleteClick = (inquiry: ContactInquiry) => {
    setInquiryToDelete(inquiry);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!inquiryToDelete) return;
    setIsDeleting(true);
    try {
      await deleteInquiry(inquiryToDelete.id);
      setShowDeleteModal(false);
      setInquiryToDelete(null);
    } catch (error) {
      alert("Failed to delete inquiry");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedInquiries.length === 0) {
      alert("Please select inquiries to delete");
      return;
    }
    if (
      !confirm(
        `Are you sure you want to delete ${selectedInquiries.length} inquiries?`
      )
    ) {
      return;
    }
    try {
      await bulkDeleteInquiries(selectedInquiries);
      setSelectedInquiries([]);
    } catch (error) {
      alert("Failed to delete inquiries");
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await exportInquiries();

      // Convert to CSV
      const headers = [
        "ID",
        "Name",
        "Email",
        "Phone",
        "Message",
        "Read Status",
        "Date",
      ];
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          [
            row.id,
            `"${row.name}"`,
            `"${row.email}"`,
            `"${row.phone}"`,
            `"${row.message.replace(/"/g, '""')}"`,
            row.isRead,
            row.createdAt,
          ].join(",")
        ),
      ].join("\n");

      // Download
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `inquiries_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to export inquiries");
    } finally {
      setIsExporting(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      page: 1,
      limit: 20,
      search: "",
      isRead: "",
      startDate: "",
      endDate: "",
      sort: "newest",
    });
    fetchInquiries({
      page: 1,
      limit: 20,
      search: "",
      isRead: "",
      startDate: "",
      endDate: "",
      sort: "newest",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Customer Inquiries
          </h1>
          <p className="text-gray-600 mt-1">
            Manage customer messages and inquiries ({pagination.total} total,{" "}
            {unreadCount} unread)
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={isExporting || inquiries.length === 0}
          className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isExporting ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Export CSV</span>
            </>
          )}
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, email, phone, or message..."
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
            <option value="oldest">Oldest First</option>
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
            {(filters.isRead || filters.startDate || filters.endDate) && (
              <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Read Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read Status
                </label>
                <select
                  value={filters.isRead}
                  onChange={(e) => handleFilterChange("isRead", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option value="">All Inquiries</option>
                  <option value="false">Unread Only</option>
                  <option value="true">Read Only</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>

            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:text-primary-dark font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedInquiries.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">{selectedInquiries.length}</span>{" "}
            inquiries selected
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleBulkMarkAsRead}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Mark as Read</span>
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Delete</span>
            </button>
            <button
              onClick={() => setSelectedInquiries([])}
              className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Inquiries List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Loading inquiries...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-6xl mb-4 block">📭</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No inquiries found
            </h3>
            <p className="text-gray-600">
              {searchQuery || filters.isRead || filters.startDate
                ? "Try adjusting your search or filters"
                : "No customer inquiries yet"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedInquiries.length === inquiries.length &&
                          inquiries.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        !inquiry.isRead ? "bg-blue-50/30" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedInquiries.includes(inquiry.id)}
                          onChange={() => handleSelectInquiry(inquiry.id)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {inquiry.isRead ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Read
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                            Unread
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {inquiry.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {inquiry.phone}
                        </div>
                        {inquiry.email && (
                          <div className="text-xs text-gray-500">
                            {inquiry.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <div className="text-sm text-gray-700 line-clamp-2">
                          {inquiry.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(inquiry.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewInquiry(inquiry)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleToggleRead(inquiry)}
                            className={`p-2 rounded-lg transition-colors ${
                              inquiry.isRead
                                ? "text-gray-600 hover:bg-gray-100"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                            title={
                              inquiry.isRead ? "Mark as Unread" : "Mark as Read"
                            }
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
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(inquiry)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                    of {pagination.total} inquiries
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

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <InquiryDetailModal
          inquiry={selectedInquiry}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedInquiry(null);
          }}
          onToggleRead={() => handleToggleRead(selectedInquiry)}
          onDelete={() => {
            setShowDetailModal(false);
            handleDeleteClick(selectedInquiry);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setInquiryToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Inquiry"
        message={
          inquiryToDelete
            ? `Are you sure you want to delete the inquiry from "${inquiryToDelete.name}"? This action cannot be undone.`
            : ""
        }
        isDeleting={isDeleting}
      />
    </div>
  );
}

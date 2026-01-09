"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useContactStore } from "@/store/contactStore";

export default function AdminContactPage() {
  const router = useRouter();
  const { settings, stats, fetchSettings, fetchStats, isLoading } =
    useContactStore();

  useEffect(() => {
    fetchSettings();
    fetchStats();
  }, [fetchSettings, fetchStats]);

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
            Contact Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage contact page settings and customer inquiries
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => window.open("/contact", "_blank")}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
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
            <span>View Public Page</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Inquiries</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats?.totalInquiries || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Unread</p>
              <p className="text-3xl font-bold text-orange-600">
                {stats?.unreadInquiries || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Read</p>
              <p className="text-3xl font-bold text-green-600">
                {stats?.readInquiries || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
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
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Page Views</p>
              <p className="text-3xl font-bold text-purple-600">-</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Settings Card */}
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Contact Page Settings</h3>
              <p className="text-white/80 text-sm">
                Update phone, email, address, and map information
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚙️</span>
            </div>
          </div>

          {settings && (
            <div className="space-y-2 mb-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white/70 text-xs mb-1">Last Updated</p>
                <p className="font-medium">{formatDate(settings.updatedAt)}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => router.push("/dashboard/contact/settings")}
            className="w-full px-4 py-3 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Edit Contact Settings</span>
          </button>
        </div>

        {/* Inquiries Management Card */}
        <div className="bg-blue-800  rounded-xl shadow-sm p-6 text-black">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Customer Inquiries</h3>
              <p className="text-white/80 text-sm">
                View and manage customer messages and inquiries
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
          </div>

          {stats && stats.unreadInquiries > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
              <p className="text-sm">
                <span className="font-bold text-lg">
                  {stats.unreadInquiries}
                </span>{" "}
                unread message{stats.unreadInquiries !== 1 ? "s" : ""} waiting
                for your response
              </p>
            </div>
          )}

          <button
            onClick={() => router.push("/dashboard/contact/inquiries")}
            className="w-full px-4 py-3 bg-blue-700 text-blue-600 font-medium rounded-lgtransition-colors flex items-center justify-center gap-2"
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
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span>Manage Inquiries</span>
            {stats && stats.unreadInquiries > 0 && (
              <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                {stats.unreadInquiries}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Current Contact Information Table */}
      {/* Current Contact Information - Card Layout */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Current Contact Information
          </h2>
          <button
            onClick={() => router.push("/dashboard/contact/settings")}
            className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
          >
            <span>Edit</span>
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Loading contact information...</p>
          </div>
        ) : settings ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Card */}
              <div className="border border-gray-200 rounded-lg p-5 hover:border-primary/50 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Phone Number
                      </h3>
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full mt-1">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-lg font-bold text-gray-900">
                    {settings.phone}
                  </p>
                  {settings.phoneHours && (
                    <p className="text-sm text-gray-600 mt-1">
                      {settings.phoneHours}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Card */}
              <div className="border border-gray-200 rounded-lg p-5 hover:border-primary/50 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">✉️</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Email Address
                      </h3>
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full mt-1">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-lg font-bold text-primary hover:underline break-all"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              {/* Address Card - Full Width */}
              <div className="border border-gray-200 rounded-lg p-5 hover:border-primary/50 hover:shadow-md transition-all md:col-span-2">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Business Address
                      </h3>
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full mt-1">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="text-base text-gray-900 leading-relaxed">
                      {settings.address}
                    </p>
                  </div>
                  {settings.workingHours && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Working Hours
                      </p>
                      <p className="text-base text-gray-900 leading-relaxed whitespace-pre-line">
                        {settings.workingHours}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Image Card */}
              <div className="border border-gray-200 rounded-lg p-5 hover:border-primary/50 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🗺️</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Map Image
                      </h3>
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${
                          settings.mapImageUrl
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {settings.mapImageUrl ? "Active" : "Not Set"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  {settings.mapImageUrl ? (
                    <div className="space-y-2">
                      <img
                        src={settings.mapImageUrl}
                        alt="Location Map"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <a
                        href={settings.mapImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <span>View Full Image</span>
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
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No map image uploaded
                    </p>
                  )}
                </div>
              </div>

              {/* Google Maps Link Card */}
              <div className="border border-gray-200 rounded-lg p-5 hover:border-primary/50 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🔗</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        Google Maps Link
                      </h3>
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${
                          settings.googleMapsLink
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {settings.googleMapsLink ? "Active" : "Not Set"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  {settings.googleMapsLink ? (
                    <a
                      href={settings.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline break-all flex items-center gap-1"
                    >
                      <span className="line-clamp-2">
                        {settings.googleMapsLink}
                      </span>
                      <svg
                        className="w-4 h-4 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No Google Maps link set
                    </p>
                  )}
                </div>
              </div>

              {/* Last Updated Card - Full Width */}
              <div className="border border-blue-200 bg-blue-50/30 rounded-lg p-5 md:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🕒</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Last Updated
                    </h3>
                    <p className="text-base text-gray-900 mt-1">
                      {formatDate(settings.updatedAt)}
                    </p>
                  </div>
                  <span className="inline-flex px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Info
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <span className="text-6xl mb-4 block">📋</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Contact Information Found
            </h3>
            <p className="text-gray-600 mb-4">
              Set up your contact page information to get started
            </p>
            <button
              onClick={() => router.push("/dashboard/contact/settings")}
              className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
            >
              Setup Contact Info
            </button>
          </div>
        )}
      </div>

      {/* Recent Inquiries Preview */}
      {stats && stats.recentInquiries && stats.recentInquiries.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Inquiries
            </h2>
            <button
              onClick={() => router.push("/dashboard/contact/inquiries")}
              className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
            >
              <span>View All</span>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentInquiries.slice(0, 5).map((inquiry) => (
              <div
                key={inquiry.id}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() =>
                  router.push(`/dashboard/contact/inquiries?id=${inquiry.id}`)
                }
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">
                        {inquiry.name}
                      </h3>
                      {!inquiry.isRead && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {inquiry.phone}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {inquiry.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 ml-4">
                    {formatDate(inquiry.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

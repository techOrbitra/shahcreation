"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAboutStore } from "@/store/aboutStore";
import { Award, Users, Sparkles, Heart, Zap, Target } from "lucide-react";

const iconMap: Record<string, any> = {
  Award,
  Users,
  Sparkles,
  Heart,
  Zap,
  Target,
};

export default function AdminAboutPage() {
  const router = useRouter();
  const { content, fetchContent, isLoading } = useAboutStore();

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

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
            About Page Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your about page content and information
          </p>
        </div>
        <button
          type="button"
          onClick={() => window.open("/about", "_blank")}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Edit Content Card */}
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">About Page Content</h3>
              <p className="text-white/80 text-sm">
                Update hero, mission, vision, values, story, and features
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✏️</span>
            </div>
          </div>

          {content && (
            <div className="space-y-2 mb-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white/70 text-xs mb-1">Last Updated</p>
                <p className="font-medium">{formatDate(content.updatedAt)}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => router.push("/dashboard/about/settings")}
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
            <span>Edit About Page</span>
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Page Statistics</h3>
              <p className="text-white/80 text-sm">
                Current stats displayed on the about page
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>

          {content && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{content.stats.clients}</p>
                <p className="text-xs text-white/70 mt-1">Clients</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">
                  {content.stats.collections}
                </p>
                <p className="text-xs text-white/70 mt-1">Collections</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                <p className="text-2xl font-bold">{content.stats.quality}</p>
                <p className="text-xs text-white/70 mt-1">Quality</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Content Overview */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600">Loading content...</p>
        </div>
      ) : content ? (
        <div className="space-y-6">
          {/* Hero Section Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Hero Section
              </h2>
              <button
                onClick={() =>
                  router.push("/dashboard/about/settings?section=hero")
                }
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
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Title</p>
                  <p className="text-xl font-bold text-gray-900">
                    {content.heroTitle}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Subtitle</p>
                  <p className="text-gray-900">{content.heroSubtitle}</p>
                </div>
                {content.heroDescription && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-gray-900">{content.heroDescription}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mission, Vision, Values */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Mission, Vision & Values
              </h2>
              <button
                onClick={() =>
                  router.push("/dashboard/about/settings?section=mvv")
                }
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
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {content.missionTitle}
                  </h3>
                  <p className="text-sm text-gray-700">{content.missionText}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {content.visionTitle}
                  </h3>
                  <p className="text-sm text-gray-700">{content.visionText}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {content.valuesTitle}
                  </h3>
                  <p className="text-sm text-gray-700">{content.valuesText}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Our Story</h2>
              <button
                onClick={() =>
                  router.push("/dashboard/about/settings?section=story")
                }
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
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Title</p>
                    <p className="text-lg font-bold text-gray-900">
                      {content.storyTitle}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Paragraph 1</p>
                    <p className="text-gray-700">{content.storyParagraph1}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Paragraph 2</p>
                    <p className="text-gray-700">{content.storyParagraph2}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Story Image</p>
                  {content.storyImageUrl ? (
                    <img
                      src={content.storyImageUrl}
                      alt="Story"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-4xl">🎨</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Features ({content.features?.length || 0})
              </h2>
              <button
                onClick={() =>
                  router.push("/dashboard/about/settings?section=features")
                }
                className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
              >
                <span>Manage</span>
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
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {content.features?.map((feature, index) => {
                  const Icon = iconMap[feature.icon] || Award;
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1 truncate">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <span className="text-6xl mb-4 block">📄</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Content Found
          </h3>
          <p className="text-gray-600 mb-4">
            Set up your about page content to get started
          </p>
          <button
            onClick={() => router.push("/dashboard/about/settings")}
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
          >
            Setup About Page
          </button>
        </div>
      )}
    </div>
  );
}

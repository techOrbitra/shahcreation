"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAboutStore } from "@/store/aboutStore";
import { Award, Users, Sparkles, Heart, Zap, Target, X } from "lucide-react";
import type { AboutFeature } from "@/types/about";

const iconOptions = [
  { value: "Award", label: "Award", icon: Award },
  { value: "Users", label: "Users", icon: Users },
  { value: "Sparkles", label: "Sparkles", icon: Sparkles },
  { value: "Heart", label: "Heart", icon: Heart },
  { value: "Zap", label: "Zap", icon: Zap },
  { value: "Target", label: "Target", icon: Target },
];

export default function AboutSettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSection = searchParams.get("section") || "hero";

  const {
    content,
    fetchContent,
    updateHeroSection,
    updateMVV,
    updateStorySection,
    updateStats,
    updateFeatures,
    addFeature,
    deleteFeature,
    resetToDefault,
    uploadImage,
    isLoading,
  } = useAboutStore();

  const [activeTab, setActiveTab] = useState<string>(initialSection);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states
  const [heroData, setHeroData] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroDescription: "",
  });

  const [mvvData, setMvvData] = useState({
    missionTitle: "",
    missionText: "",
    visionTitle: "",
    visionText: "",
    valuesTitle: "",
    valuesText: "",
  });

  const [storyData, setStoryData] = useState({
    storyTitle: "",
    storyParagraph1: "",
    storyParagraph2: "",
    storyImageUrl: "",
  });

  const [statsData, setStatsData] = useState({
    clients: "",
    collections: "",
    quality: "",
  });

  const [featuresData, setFeaturesData] = useState<AboutFeature[]>([]);
  const [newFeature, setNewFeature] = useState<AboutFeature>({
    icon: "Award",
    title: "",
    description: "",
  });
  const [showAddFeature, setShowAddFeature] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  useEffect(() => {
    if (content) {
      setHeroData({
        heroTitle: content.heroTitle,
        heroSubtitle: content.heroSubtitle,
        heroDescription: content.heroDescription || "",
      });
      setMvvData({
        missionTitle: content.missionTitle,
        missionText: content.missionText || "",
        visionTitle: content.visionTitle,
        visionText: content.visionText || "",
        valuesTitle: content.valuesTitle,
        valuesText: content.valuesText || "",
      });
      setStoryData({
        storyTitle: content.storyTitle,
        storyParagraph1: content.storyParagraph1 || "",
        storyParagraph2: content.storyParagraph2 || "",
        storyImageUrl: content.storyImageUrl || "",
      });
      setStatsData(content.stats);
      setFeaturesData(content.features || []);
    }
  }, [content]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await uploadImage(file);
      setStoryData({ ...storyData, storyImageUrl: imageUrl });
      setHasChanges(true);
    } catch (error) {
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveHero = async () => {
    try {
      await updateHeroSection(heroData);
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Failed to update hero section");
    }
  };

  const handleSaveMVV = async () => {
    try {
      await updateMVV(mvvData);
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Failed to update MVV");
    }
  };

  const handleSaveStory = async () => {
    try {
      await updateStorySection(storyData);
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Failed to update story");
    }
  };

  const handleSaveStats = async () => {
    try {
      await updateStats(statsData);
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Failed to update stats");
    }
  };

  const handleSaveFeatures = async () => {
    try {
      await updateFeatures(featuresData);
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Failed to update features");
    }
  };

  const handleAddFeature = async () => {
    if (!newFeature.title || !newFeature.description) {
      alert("Please fill in all feature fields");
      return;
    }

    try {
      await addFeature(newFeature);
      setNewFeature({ icon: "Award", title: "", description: "" });
      setShowAddFeature(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Failed to add feature");
    }
  };

  const handleDeleteFeature = async (index: number) => {
    if (!confirm("Are you sure you want to delete this feature?")) return;

    try {
      await deleteFeature(index);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Failed to delete feature");
    }
  };

  const handleReset = async () => {
    if (
      !confirm(
        "⚠️ This will reset all about page content to default values. All your custom data will be lost. Are you sure?"
      )
    ) {
      return;
    }

    try {
      await resetToDefault();
      setHasChanges(false);
      alert("✅ About page reset to default successfully!");
    } catch (error) {
      alert("❌ Failed to reset about page");
    }
  };

  const tabs = [
    { id: "hero", label: "Hero", icon: "🎯" },
    { id: "mvv", label: "Mission/Vision/Values", icon: "🎨" },
    { id: "story", label: "Our Story", icon: "📖" },
    { id: "stats", label: "Statistics", icon: "📊" },
    { id: "features", label: "Features", icon: "⭐" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            About Page Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage dynamic about page content displayed on your website
          </p>
        </div>
        <div className="flex gap-3">
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
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
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
          <div>
            <p className="font-semibold text-green-900">
              Settings updated successfully!
            </p>
            <p className="text-sm text-green-700">
              Your about page has been updated.
            </p>
          </div>
        </div>
      )}

      {/* Unsaved Changes Warning */}
      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <svg
            className="w-6 h-6 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-sm text-yellow-800">
            You have unsaved changes. Don't forget to save your updates!
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200 px-6 overflow-x-auto">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Hero Tab */}
          {activeTab === "hero" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Title *
                </label>
                <input
                  type="text"
                  value={heroData.heroTitle}
                  onChange={(e) => {
                    setHeroData({ ...heroData, heroTitle: e.target.value });
                    setHasChanges(true);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Shah Creation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Subtitle *
                </label>
                <input
                  type="text"
                  value={heroData.heroSubtitle}
                  onChange={(e) => {
                    setHeroData({ ...heroData, heroSubtitle: e.target.value });
                    setHasChanges(true);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Crafting luxury fashion since 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Description
                </label>
                <textarea
                  value={heroData.heroDescription}
                  onChange={(e) => {
                    setHeroData({
                      ...heroData,
                      heroDescription: e.target.value,
                    });
                    setHasChanges(true);
                  }}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  placeholder="Where elegance meets innovation..."
                />
              </div>
              <button
                onClick={handleSaveHero}
                disabled={isLoading || !hasChanges}
                className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Save Hero Section</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* MVV Tab */}
          {activeTab === "mvv" && (
            <div className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 gap-6">
                {/* Mission */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Mission</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={mvvData.missionTitle}
                        onChange={(e) => {
                          setMvvData({
                            ...mvvData,
                            missionTitle: e.target.value,
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text
                      </label>
                      <textarea
                        value={mvvData.missionText}
                        onChange={(e) => {
                          setMvvData({
                            ...mvvData,
                            missionText: e.target.value,
                          });
                          setHasChanges(true);
                        }}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Vision */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Vision</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={mvvData.visionTitle}
                        onChange={(e) => {
                          setMvvData({
                            ...mvvData,
                            visionTitle: e.target.value,
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text
                      </label>
                      <textarea
                        value={mvvData.visionText}
                        onChange={(e) => {
                          setMvvData({
                            ...mvvData,
                            visionText: e.target.value,
                          });
                          setHasChanges(true);
                        }}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Values */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Values</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={mvvData.valuesTitle}
                        onChange={(e) => {
                          setMvvData({
                            ...mvvData,
                            valuesTitle: e.target.value,
                          });
                          setHasChanges(true);
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text
                      </label>
                      <textarea
                        value={mvvData.valuesText}
                        onChange={(e) => {
                          setMvvData({
                            ...mvvData,
                            valuesText: e.target.value,
                          });
                          setHasChanges(true);
                        }}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveMVV}
                disabled={isLoading || !hasChanges}
                className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Save MVV Section</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Story Tab */}
          {activeTab === "story" && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title
                </label>
                <input
                  type="text"
                  value={storyData.storyTitle}
                  onChange={(e) => {
                    setStoryData({ ...storyData, storyTitle: e.target.value });
                    setHasChanges(true);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paragraph 1
                </label>
                <textarea
                  value={storyData.storyParagraph1}
                  onChange={(e) => {
                    setStoryData({
                      ...storyData,
                      storyParagraph1: e.target.value,
                    });
                    setHasChanges(true);
                  }}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paragraph 2
                </label>
                <textarea
                  value={storyData.storyParagraph2}
                  onChange={(e) => {
                    setStoryData({
                      ...storyData,
                      storyParagraph2: e.target.value,
                    });
                    setHasChanges(true);
                  }}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Story Image
                </label>
                {storyData.storyImageUrl ? (
                  <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 group mb-4">
                    <img
                      src={storyData.storyImageUrl}
                      alt="Story"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label
                        htmlFor="story-image-replace"
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        Replace
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("Remove story image?")) {
                            setStoryData({ ...storyData, storyImageUrl: "" });
                            setHasChanges(true);
                          }
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="file"
                      id="story-image-replace"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="story-image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <label
                      htmlFor="story-image"
                      className={`cursor-pointer ${
                        uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        {uploadingImage ? (
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </div>
                      <p className="text-gray-700 font-medium">
                        {uploadingImage
                          ? "Uploading..."
                          : "Click to upload story image"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PNG, JPG, WebP up to 5MB
                      </p>
                    </label>
                  </div>
                )}
              </div>
              <button
                onClick={handleSaveStory}
                disabled={isLoading || !hasChanges}
                className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Save Story Section</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === "stats" && (
            <div className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clients
                  </label>
                  <input
                    type="text"
                    value={statsData.clients}
                    onChange={(e) => {
                      setStatsData({ ...statsData, clients: e.target.value });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="500+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collections
                  </label>
                  <input
                    type="text"
                    value={statsData.collections}
                    onChange={(e) => {
                      setStatsData({
                        ...statsData,
                        collections: e.target.value,
                      });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="50+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality
                  </label>
                  <input
                    type="text"
                    value={statsData.quality}
                    onChange={(e) => {
                      setStatsData({ ...statsData, quality: e.target.value });
                      setHasChanges(true);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="100%"
                  />
                </div>
              </div>
              <button
                onClick={handleSaveStats}
                disabled={isLoading || !hasChanges}
                className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Save Statistics</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === "features" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Features ({featuresData.length})
                </h3>
                <button
                  onClick={() => setShowAddFeature(!showAddFeature)}
                  className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">+</span>
                  <span>Add Feature</span>
                </button>
              </div>

              {/* Add Feature Form */}
              {showAddFeature && (
                <div className="border border-primary/30 bg-primary/5 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    New Feature
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {iconOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() =>
                                setNewFeature({
                                  ...newFeature,
                                  icon: option.value,
                                })
                              }
                              className={`p-3 border-2 rounded-lg transition-all ${
                                newFeature.icon === option.value
                                  ? "border-primary bg-primary/10"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <Icon className="w-6 h-6 mx-auto" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={newFeature.title}
                        onChange={(e) =>
                          setNewFeature({
                            ...newFeature,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="Feature title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newFeature.description}
                        onChange={(e) =>
                          setNewFeature({
                            ...newFeature,
                            description: e.target.value,
                          })
                        }
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                        placeholder="Feature description"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddFeature}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                      >
                        Add Feature
                      </button>
                      <button
                        onClick={() => {
                          setShowAddFeature(false);
                          setNewFeature({
                            icon: "Award",
                            title: "",
                            description: "",
                          });
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuresData.map((feature, index) => {
                  const iconOption = iconOptions.find(
                    (opt) => opt.value === feature.icon
                  );
                  const Icon = iconOption?.icon || Award; 
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {feature.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteFeature(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-end">
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="px-6 py-3 border-2 border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Reset to Default</span>
        </button>
      </div>
    </div>
  );
}

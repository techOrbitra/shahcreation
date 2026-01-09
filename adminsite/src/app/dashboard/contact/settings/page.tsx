"use client";

import { useState, useEffect } from "react";
import { useContactStore } from "@/store/contactStore";

export default function ContactSettingsPage() {
  const {
    settings,
    fetchSettings,
    updateSettings,
    resetSettings,
    uploadMapImage,
    isLoading,
  } = useContactStore();

  const [formData, setFormData] = useState({
    phone: "",
    phoneHours: "",
    email: "",
    address: "",
    workingHours: "",
    mapImageUrl: "",
    googleMapsLink: "",
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      setFormData({
        phone: settings.phone,
        phoneHours: settings.phoneHours,
        email: settings.email,
        address: settings.address,
        workingHours: settings.workingHours,
        mapImageUrl: settings.mapImageUrl || "",
        googleMapsLink: settings.googleMapsLink || "",
      });
    }
  }, [settings]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setHasChanges(true);
  };

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
      const imageUrl = await uploadMapImage(file);
      setFormData({ ...formData, mapImageUrl: imageUrl });
      setHasChanges(true);
    } catch (error) {
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    if (confirm("Are you sure you want to remove the map image?")) {
      setFormData({ ...formData, mapImageUrl: "" });
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.phone.trim()) {
      alert("Phone number is required");
      return;
    }
    if (!formData.email.trim()) {
      alert("Email is required");
      return;
    }
    if (!formData.address.trim()) {
      alert("Address is required");
      return;
    }

    try {
      await updateSettings(formData);
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Failed to update settings");
    }
  };

  const handleReset = async () => {
    if (
      !confirm(
        "⚠️ This will reset all contact information to default values. All your custom data will be lost. Are you sure?"
      )
    ) {
      return;
    }

    try {
      await resetSettings();
      setHasChanges(false);
      alert("✅ Settings reset to default successfully!");
    } catch (error) {
      alert("❌ Failed to reset settings");
    }
  };

  const handlePreview = () => {
    window.open("/contact", "_blank");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Contact Page Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your contact page information - changes will be reflected on
            the public contact page
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handlePreview}
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
            <span>Preview Page</span>
          </button>
        </div>
      </div>

      {/* Save Success Message */}
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
              Your contact page has been updated with the new information.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Phone Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📞</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Phone Information
                </h2>
                <p className="text-sm text-gray-600">
                  Contact phone number and availability
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="+91 98765 43210"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Displayed prominently on the contact page
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Availability Hours
                </label>
                <input
                  type="text"
                  name="phoneHours"
                  value={formData.phoneHours}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="Mon-Sat 9AM-8PM"
                />
                <p className="text-xs text-gray-500 mt-1">
                  When customers can reach you by phone
                </p>
              </div>
            </div>
          </div>

          {/* Email Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✉️</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Email Information
                </h2>
                <p className="text-sm text-gray-600">
                  Primary contact email address
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="hello@shahcreation.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Customer inquiries and messages will reference this email
              </p>
            </div>
          </div>

          {/* Address & Hours */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📍</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Business Address & Hours
                </h2>
                <p className="text-sm text-gray-600">
                  Physical location and operating hours
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  placeholder="123 Fashion Street, Siddhapur, Gujarat, India - 384151"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Full business address including city, state, and postal code
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working Hours
                </label>
                <textarea
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  placeholder="Mon-Sat: 9AM - 8PM&#10;Sunday: 10AM - 6PM"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use line breaks to separate different days or time slots
                </p>
              </div>
            </div>
          </div>

          {/* Location Map */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🗺️</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Location Map
                </h2>
                <p className="text-sm text-gray-600">
                  Map image and Google Maps integration
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {/* Map Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Map Image
                </label>
                {formData.mapImageUrl ? (
                  <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 group">
                    <img
                      src={formData.mapImageUrl}
                      alt="Location Map"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label
                        htmlFor="map-replace"
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        Replace
                      </label>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      type="file"
                      id="map-replace"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      id="map-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <label
                      htmlFor="map-upload"
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
                          : "Click to upload map image"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PNG, JPG, WebP up to 5MB
                      </p>
                    </label>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Upload a screenshot of your location from Google Maps or a
                  custom map image
                </p>
              </div>

              {/* Google Maps Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Maps Link
                </label>
                <input
                  type="url"
                  name="googleMapsLink"
                  value={formData.googleMapsLink}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="https://maps.google.com/?q=your+location"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to your location on Google Maps (optional)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preview & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Quick Preview Card */}
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-sm p-6 text-white sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Quick Preview</h3>
            <div className="space-y-4 text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white/80 text-xs mb-1">Phone</p>
                <p className="font-medium">{formData.phone || "Not set"}</p>
                {formData.phoneHours && (
                  <p className="text-white/70 text-xs mt-1">
                    {formData.phoneHours}
                  </p>
                )}
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white/80 text-xs mb-1">Email</p>
                <p className="font-medium break-all">
                  {formData.email || "Not set"}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white/80 text-xs mb-1">Address</p>
                <p className="font-medium text-sm leading-relaxed">
                  {formData.address || "Not set"}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white/80 text-xs mb-1">Working Hours</p>
                <p className="font-medium text-sm leading-relaxed whitespace-pre-line">
                  {formData.workingHours || "Not set"}
                </p>
              </div>

              {formData.mapImageUrl && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-white/80 text-xs mb-2">Map Image</p>
                  <img
                    src={formData.mapImageUrl}
                    alt="Map preview"
                    className="w-full h-24 object-cover rounded"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleSave}
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
                  <span>Save Changes</span>
                  {hasChanges && (
                    <span className="px-2 py-0.5 bg-white/20 text-xs rounded-full">
                      Unsaved
                    </span>
                  )}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading}
              className="w-full px-6 py-3 border-2 border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Dynamic Contact Page</p>
                <p className="text-blue-700 leading-relaxed">
                  All changes made here will be instantly reflected on your
                  public contact page. Make sure to save before leaving!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

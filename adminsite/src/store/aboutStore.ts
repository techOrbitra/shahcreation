import { create } from "zustand";
import type { AboutPageContent, UpdateAboutData, AboutFeature } from "@/types/about";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

interface AboutState {
  content: AboutPageContent | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchContent: () => Promise<void>;
  updateContent: (data: UpdateAboutData) => Promise<void>;
  updateHeroSection: (data: Partial<UpdateAboutData>) => Promise<void>;
  updateMVV: (data: Partial<UpdateAboutData>) => Promise<void>;
  updateStorySection: (data: Partial<UpdateAboutData>) => Promise<void>;
  updateStats: (stats: AboutPageContent["stats"]) => Promise<void>;
  updateFeatures: (features: AboutFeature[]) => Promise<void>;
  addFeature: (feature: AboutFeature) => Promise<void>;
  deleteFeature: (index: number) => Promise<void>;
  resetToDefault: () => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
}

export const useAboutStore = create<AboutState>((set, get) => ({
  content: null,
  isLoading: false,
  error: null,

  // Fetch content (public)
  fetchContent: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_URL}/aboutus`);
      if (!response.ok) throw new Error("Failed to fetch content");
      const data = await response.json();
      set({ content: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Update all content (admin)
  updateContent: async (updateData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/aboutus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update content");
      const data = await response.json();
      set({ content: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update hero section
  updateHeroSection: async (updateData) => {
    set({ isLoading: true, error: null });
    try { 
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/aboutus/hero`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update hero");
      const data = await response.json();
      set({ content: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update Mission/Vision/Values
  updateMVV: async (updateData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/aboutus/mvv`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update MVV");
      const data = await response.json();
      set({ content: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update story section
  updateStorySection: async (updateData) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/aboutus/story`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error("Failed to update story");
      const data = await response.json();
      set({ content: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update stats
  updateStats: async (stats) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/aboutus/stats`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stats }),
      });

      if (!response.ok) throw new Error("Failed to update stats");
      const data = await response.json();
      set({ content: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Update features
  updateFeatures: async (features) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/aboutus/features`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ features }),
      });

      if (!response.ok) throw new Error("Failed to update features");
      const data = await response.json();
      set({ content: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Add feature
  addFeature: async (feature) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/aboutus/features`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(feature),
      });

      if (!response.ok) throw new Error("Failed to add feature");
      const data = await response.json();
      set({ content: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Delete feature
  deleteFeature: async (index) => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/aboutus/features/${index}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete feature");
      const data = await response.json();
      set({ content: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Reset to default
  resetToDefault: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/aboutus/reset`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to reset");
      const data = await response.json();
      set({ content: data.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Upload image
  uploadImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("images", file);

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/products/upload-images`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");
      const data = await response.json();
      return data.data[0];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
}));

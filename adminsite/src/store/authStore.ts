"use client";

import { create } from "zustand";
import { apiClient } from "@/lib/axios";
import type {
  Admin,
  LoginCredentials,
  AuthResponse,
  ApiResponse,
} from "@/types";

interface AuthState {
  admin: Admin | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

// ✅ Token validation helper (client-side JWT decode)
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    // ✅ 5min buffer before expiry
    return payload.exp > now + 300;
  } catch {
    return false;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<AuthResponse>(
        "/auth/login",
        credentials
      );
      const { admin, accessToken, refreshToken } = response.data.data;

      // Store tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Update axios default header
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;

      set({
        admin,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Login failed",
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    const token = localStorage.getItem("accessToken");

    // ✅ SKIP API CALL if token invalid
    if (!isTokenValid(token)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({ isAuthenticated: false, admin: null, isLoading: false });
      return;
    }

    set({ isLoading: true });

    try {
      // Set token in header
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Verify token with backend
      const response = await apiClient.get<ApiResponse<Admin>>("/auth/me");

      set({
        admin: response.data.data || null,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      // Token is invalid, clear everything
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      delete apiClient.defaults.headers.common["Authorization"];

      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
      });

      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete apiClient.defaults.headers.common["Authorization"];

    set({
      admin: null,
      isAuthenticated: false,
      error: null,
    });
  },
}));

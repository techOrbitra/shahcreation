// import axios from 'axios';
// import Cookies from 'js-cookie';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// export const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get('accessToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       Cookies.remove('accessToken');
//       Cookies.remove('refreshToken');
//       if (typeof window !== 'undefined') {
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ FIXED: Type-safe token getter
const getAuthToken = (): string | null => {
  // Cookies first (secure)
  const cookieToken = Cookies.get("accessToken");
  if (cookieToken) return cookieToken;

  // LocalStorage fallback
  return localStorage.getItem("accessToken") || null;
};

// Request interceptor ✅ FIXED types
apiClient.interceptors.request.use(
  (config: any) => {
    const token = getAuthToken();
    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
      (config.headers as any)["x-auth-token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor ✅ FIXED types
apiClient.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          Cookies.get("refreshToken") || localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          const { accessToken } = response.data.data;

          // Update both
          Cookies.set("accessToken", accessToken, { expires: 1 });
          localStorage.setItem("accessToken", accessToken);

          // Retry
          (
            originalRequest.headers as any
          ).Authorization = `Bearer ${accessToken}`;
          (originalRequest.headers as any)["x-auth-token"] = accessToken;
          return apiClient(originalRequest);
        }
      } catch {
        // Logout
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }

    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login?session=expired";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

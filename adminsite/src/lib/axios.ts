// // import axios from 'axios';
// // import Cookies from 'js-cookie';

// // const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// // export const apiClient = axios.create({
// //   baseURL: API_BASE_URL,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });

// // // Request interceptor
// // apiClient.interceptors.request.use(
// //   (config) => {
// //     const token = Cookies.get('accessToken');
// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// // // Response interceptor
// // apiClient.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     if (error.response?.status === 401) {
// //       Cookies.remove('accessToken');
// //       Cookies.remove('refreshToken');
// //       if (typeof window !== 'undefined') {
// //         window.location.href = '/login';
// //       }
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// import axios from "axios";
// import Cookies from "js-cookie";

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// export const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ FIXED: Type-safe token getter
// const getAuthToken = (): string | null => {
//   // Cookies first (secure)
//   const cookieToken = Cookies.get("accessToken");
//   if (cookieToken) return cookieToken;

//   // LocalStorage fallback
//   return localStorage.getItem("accessToken") || null;
// };

// // Request interceptor ✅ FIXED types
// // apiClient.interceptors.request.use(
  
// //   (config: any) => {
// //     const token = getAuthToken();
// //     if (token) {
// //       (config.headers as any).Authorization = `Bearer ${token}`;
// //       (config.headers as any)["x-auth-token"] = token;
// //     }
// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// apiClient.interceptors.request.use((config: any) => {
//   const skipAuthRoutes = ["/auth/login", "/auth/refresh"];

//   if (skipAuthRoutes.some((url) => config.url?.includes(url))) {
//     return config; // ❌ DO NOT attach token
//   }

//   const token = getAuthToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//     config.headers["x-auth-token"] = token;
//   }

//   return config;
// });


// // Response interceptor ✅ FIXED types
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error: any) => {
//     const originalRequest = error.config as any;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken =
//           Cookies.get("refreshToken") || localStorage.getItem("refreshToken");
//         if (refreshToken) {
//           const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
//             refreshToken,
//           });
//           const { accessToken } = response.data.data;

//           // Update both
//           Cookies.set("accessToken", accessToken, { expires: 1 });
//           localStorage.setItem("accessToken", accessToken);

//           // Retry
//           (
//             originalRequest.headers as any
//           ).Authorization = `Bearer ${accessToken}`;
//           (originalRequest.headers as any)["x-auth-token"] = accessToken;
//           return apiClient(originalRequest);
//         }
//       } catch {
//         // Logout
//         Cookies.remove("accessToken");
//         Cookies.remove("refreshToken");
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("refreshToken");
//       }
//     }

//     if (error.response?.status === 401) {
//       if (typeof window !== "undefined") {
//         window.location.href = "/login?session=expired";
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default apiClient;

import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===========================
   REQUEST INTERCEPTOR
   =========================== */
apiClient.interceptors.request.use(
  (config) => {
    if (config.url?.includes("/auth/login") || config.url?.includes("/auth/refresh")) {
      return config;
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===========================
   RESPONSE INTERCEPTOR
   =========================== */
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const newAccessToken = res.data.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        apiClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

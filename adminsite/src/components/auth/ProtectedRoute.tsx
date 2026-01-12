"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { admin, isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("accessToken");

      // ✅ IMMEDIATE REJECT if no token
      if (!token) {
        router.replace("/login");
        return;
      }

      // ✅ IMMEDIATE APPROVE if already authenticated + admin data
      if (isAuthenticated && admin) {
        setChecking(false);
        return;
      }

      // ✅ ONLY CALL API if we need to verify token
      try {
        await checkAuth();
        setChecking(false);
      } catch (error) {
        // Token invalid, clear & redirect
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.replace("/login");
      }
    };

    verifyAuth();
  }, []); // ✅ EMPTY DEPS = run ONCE only

  // Show loading while checking auth
  if (checking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !admin) {
    return null;
  }

  // ✅ Render protected content (NO REPEATED CALLS)
  return <>{children}</>;
}

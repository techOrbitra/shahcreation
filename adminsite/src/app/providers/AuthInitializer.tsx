"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    checkAuth().finally(() => setReady(true));
  }, [checkAuth]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

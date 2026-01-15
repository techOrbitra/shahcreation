// // "use client";

// // import { useEffect, useState } from "react";
// // import { useAuthStore } from "@/store/authStore";
// // import Sidebar from "@/components/layout/Sidebar";
// // import Header from "@/components/layout/Header";

// // export default function DashboardLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   const { isAuthenticated, admin, checkAuth } = useAuthStore();
// //   const [sidebarOpen, setSidebarOpen] = useState(false);
// //   const [isAuthChecked, setIsAuthChecked] = useState(false);

// //   // ✅ Run checkAuth ONLY ONCE on mount
// //   useEffect(() => {
// //     checkAuth().finally(() => setIsAuthChecked(true));
// //   }, []); // ✅ Empty deps = run once only

// //   // Show loading while checking auth
// //   if (!isAuthChecked) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
// //         <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
// //       </div>
// //     );
// //   }

// //   // Redirect handled by middleware or ProtectedRoute (not here)
// //   if (!isAuthenticated || !admin) {
// //     return null; // or redirect
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
// //       <div className="lg:pl-64">
// //         <Header onMenuClick={() => setSidebarOpen(true)} />
// //         <main className="p-4 md:p-6 lg:p-8">{children}</main>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/authStore";
// import Sidebar from "@/components/layout/Sidebar";
// import Header from "@/components/layout/Header";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const { isAuthenticated, admin, checkAuth } = useAuthStore();

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [checkingAuth, setCheckingAuth] = useState(true);

//   useEffect(() => {
//     const verify = async () => {
//       try {
//         await checkAuth();
//       } finally {
//         setCheckingAuth(false);
//       }
//     };

//     verify();
//   }, [checkAuth]);

//   /* ===========================
//      LOADING STATE
//      =========================== */
//   if (checkingAuth) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   /* ===========================
//      NOT AUTHENTICATED
//      =========================== */
//   if (!isAuthenticated || !admin) {
//     router.replace("/login");
//     return null;
//   }

//   /* ===========================
//      AUTHENTICATED
//      =========================== */
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
//       <div className="lg:pl-64">
//         <Header onMenuClick={() => setSidebarOpen(true)} />
//         <main className="p-4 md:p-6 lg:p-8">{children}</main>
//       </div>
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, admin } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ===========================
     REDIRECT IF NOT AUTHORIZED
     =========================== */
  useEffect(() => {
    if (!isAuthenticated || !admin) {
      router.replace("/login");
    }
  }, [isAuthenticated, admin, router]);

  /* ===========================
     BLOCK RENDER UNTIL AUTH OK
     =========================== */
  if (!isAuthenticated || !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ===========================
     AUTHENTICATED UI
     =========================== */
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

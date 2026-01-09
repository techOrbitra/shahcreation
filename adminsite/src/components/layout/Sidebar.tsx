"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { admin } = useAuthStore();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: "📊" },
    {
      name: "Admins",
      href: "/dashboard/admins",
      icon: "👥",
      superAdminOnly: true,
    },
    { name: "Clothes", href: "/dashboard/clothes", icon: "👕" },
    { name: "Products", href: "/dashboard/products", icon: "👕" },
    { name: "Categories", href: "/dashboard/categories", icon: "📁" },
    { name: "Orders", href: "/dashboard/orders", icon: "🛒" },
    { name: "Contact", href: "/dashboard/contact", icon: "📧" },
    { name: "About Us", href: "/dashboard/about", icon: "ℹ️" },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.superAdminOnly || admin?.role === "super_admin"
  );

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredMenuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold">
                  {admin?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {admin?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{admin?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

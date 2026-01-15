import type { Metadata } from "next";
import "./globals.css";
import AuthInitializer from "@/app/providers/AuthInitializer";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Modern admin dashboard built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthInitializer>{children}</AuthInitializer>
      </body>
    </html>
  );
}

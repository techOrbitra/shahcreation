"use client";

import { Suspense } from "react";
import ShopContent from "@/components/ShopContent";

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-screen flex items-center justify-center">
          <p className="text-lg">Loading products...</p>
        </section>
      }
    >
      <ShopContent />
    </Suspense>
  );
}

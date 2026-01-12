"use client";

import { useEffect } from "react";
import Hero from "@/components/Hero";
import FeaturedGrid from "@/components/FeaturedGrid";
import CategoryChips from "@/components/CategoryChips";
import { useProductsStore } from "@/store/productsStore";

export default function Home() {
  const {
    products,
    categories,
    fetchProducts,
    fetchCategories,
    isLoading,
  } = useProductsStore();

  useEffect(() => {
    fetchCategories();
    fetchProducts({ featured: true, limit: 8 });
  }, []);

  return (
    <div>
      <Hero />

      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          {/* Categories */}
          <CategoryChips categories={categories.slice(0, 4)} />

          {/* Featured Products */}
          <FeaturedGrid
            clothes={products}
            isLoading={isLoading}
          />
        </div>
      </section>
    </div>
  );
}

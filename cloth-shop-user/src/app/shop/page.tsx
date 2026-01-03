"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { clothes, categories } from "@/lib/data";
import FeaturedGrid from "@/components/FeaturedGrid";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function Shop() {
  const [filteredClothes, setFilteredClothes] = useState(clothes);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const searchParams = useSearchParams();

  useEffect(() => {
    let results = clothes;

    if (search) {
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "all") {
      const cat = categories.find((c) => c.slug === category);
      if (cat) results = results.filter((c) => c.categoryIds.includes(cat.id));
    }

    results = results.filter((c) => c.price >= minPrice && c.price <= maxPrice);

    setFilteredClothes(results);
  }, [search, category, minPrice, maxPrice]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setMinPrice(0);
    setMaxPrice(10000);
  };

  return (
    <section className="min-h-screen py-20 bg-gradient-to-b from-cream to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-foreground">
            Luxury Collection
          </h1>
          <div className="w-32 h-1.5 bg-accent mx-auto rounded-full mb-6"></div>
          <p className="text-xl md:text-2xl text-slate-700 max-w-2xl mx-auto">
            Discover premium fashion crafted for elegance
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 mb-16">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6 bg-cream/70 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-light/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black flex items-center gap-3 text-foreground">
                  <SlidersHorizontal className="h-6 w-6 text-accent" />
                  Filters
                </h3>
                {(search ||
                  category !== "all" ||
                  minPrice > 0 ||
                  maxPrice < 10000) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-accent hover:text-accent/80 hover:bg-accent/10"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              {/* Search */}
              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-wide text-slate-700">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 h-12 rounded-2xl border-2 border-light focus:border-accent transition-all"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-wide text-slate-700">
                  Category
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-12 rounded-2xl border-2 border-light focus:border-accent font-semibold">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="all" className="font-semibold">
                      All Categories
                    </SelectItem>
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.slug}
                        className="font-medium"
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <label className="text-sm font-bold uppercase tracking-wide text-slate-700">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">
                      Min (₹)
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minPrice || ""}
                      onChange={(e) => setMinPrice(+e.target.value || 0)}
                      className="h-12 rounded-2xl border-2 border-light focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">
                      Max (₹)
                    </label>
                    <Input
                      type="number"
                      placeholder="10000"
                      value={maxPrice || ""}
                      onChange={(e) => setMaxPrice(+e.target.value || 10000)}
                      className="h-12 rounded-2xl border-2 border-light focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Active Filters Summary */}
              {(search ||
                category !== "all" ||
                minPrice > 0 ||
                maxPrice < 10000) && (
                <div className="pt-6 border-t border-slate-200">
                  <p className="text-sm font-semibold text-slate-600 mb-3">
                    Active Filters:
                  </p>
                  <div className="space-y-2">
                    {search && (
                      <div className="text-xs px-3 py-2 bg-accent/10 rounded-lg border border-accent/30">
                        Search: <span className="font-bold">{search}</span>
                      </div>
                    )}
                    {category !== "all" && (
                      <div className="text-xs px-3 py-2 bg-accent/10 rounded-lg border border-accent/30">
                        Category:{" "}
                        <span className="font-bold">
                          {categories.find((c) => c.slug === category)?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-8 flex items-center justify-between">
              <p className="text-lg font-semibold text-foreground">
                <span className="text-3xl font-black text-foreground">
                  {filteredClothes.length}
                </span>{" "}
                Products Found
              </p>
            </div>

            {filteredClothes.length ? (
              <FeaturedGrid clothes={filteredClothes} />
            ) : (
              <div className="text-center py-32 bg-cream/50 backdrop-blur-sm rounded-3xl shadow-xl">
                <div className="text-8xl mb-8">😔</div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">
                  No Products Found
                </h3>
                <p className="text-lg text-slate-600 mb-8">
                  Try adjusting your filters
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-accent hover:opacity-95 transition-all text-lg px-8 py-6 text-white"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

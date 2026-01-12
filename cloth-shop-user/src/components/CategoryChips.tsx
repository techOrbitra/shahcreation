"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
  isLoading?: boolean;
}

export default function CategoryChips({ categories, isLoading }: Props) {
  // ✅ Skeleton state
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-4 justify-center mb-20">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-12 w-32 bg-slate-300 rounded-full animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!categories.length) return null;

  return (
    <div className="flex flex-wrap gap-4 justify-center mb-20">
      {categories.map((cat) => (
        <Link key={cat.id} href={`/shop?category=${cat.slug}`}>
          <Badge className="text-lg px-6 py-3 bg-cream shadow-lg hover:bg-accent hover:text-white transition-all">
            {cat.name}
          </Badge>
        </Link>
      ))}
    </div>
  );
}

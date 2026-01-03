"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Props {
  categories: Array<{ id: number; name: string; slug: string; color: string }>; // ✅ Added slug
}

// components/CategoryChips.tsx
export default function CategoryChips({ categories }: Props) {
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-20 px-8">
      <div className="flex -space-x-2">
        {categories.map((cat, idx) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="relative z-[${idx + 1}]"
          >
            <Badge
              className={`text-lg px-6 py-3 shadow-xl backdrop-blur-sm border-2 border-light/20 font-semibold hover:scale-105 transition-all hover:shadow-accent/50 ${
                cat.color === "#0ea5e9"
                  ? "bg-blue-500/90"
                  : cat.color === "#ec4899"
                  ? "bg-pink-500/90"
                  : "bg-cream/90 text-foreground"
              }`}
            >
              {cat.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}

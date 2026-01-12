"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { ShoppingCart } from "lucide-react";

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
}

interface Props {
  clothes: Product[];
  isLoading?: boolean;
}

export default function FeaturedGrid({ clothes, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {clothes.map((cloth) => (
        <ClothCard key={cloth.id} cloth={cloth} />
      ))}
    </div>
  );
}

/* ================= Skeleton ================= */

function SkeletonCard() {
  return (
    <div className="bg-cream/70 rounded-3xl shadow-xl overflow-hidden border animate-pulse">
      {/* Image */}
      <div className="h-80 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200" />

      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="h-6 w-3/4 bg-slate-300 rounded" />

        {/* Description */}
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="h-4 w-5/6 bg-slate-200 rounded" />

        {/* Price */}
        <div className="h-8 w-32 bg-slate-300 rounded" />

        {/* Button */}
        <div className="h-12 w-full bg-slate-300 rounded-xl" />
      </div>
    </div>
  );
}

/* ================= Card ================= */

function ClothCard({ cloth }: { cloth: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="group bg-cream/70 rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all hover:-translate-y-3 border">
      <Link href={`/shop/${cloth.slug}`}>
        <div className="relative h-80 overflow-hidden">
          <Image
            src={cloth.image}
            alt={cloth.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform"
          />

          {cloth.oldPrice && (
            <Badge className="absolute top-6 left-6 bg-accent text-white">
              {Math.round(
                ((cloth.oldPrice - cloth.price) / cloth.oldPrice) * 100
              )}
              % OFF
            </Badge>
          )}
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/shop/${cloth.slug}`}>
          <h3 className="font-black text-xl mb-2 line-clamp-1">{cloth.name}</h3>
        </Link>

        <p className="text-sm opacity-70 mb-4 line-clamp-2">
          {cloth.description}
        </p>

        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-3xl font-black">
            ₹{cloth.price.toLocaleString()}
          </span>
          {cloth.oldPrice && (
            <span className="text-lg line-through opacity-60">
              ₹{cloth.oldPrice.toLocaleString()}
            </span>
          )}
        </div>

        <Button
          onClick={(e) => {
            e.preventDefault();
            addToCart({
              id: cloth.id,
              name: cloth.name,
              price: cloth.price,
              image: cloth.image,
            });
          }}
          className="w-full bg-accent text-white"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

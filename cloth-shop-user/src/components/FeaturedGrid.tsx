"use client";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clothes } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { ShoppingCart } from "lucide-react";

interface Props {
  clothes: typeof clothes;
}

export default function FeaturedGrid({ clothes }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {clothes.map((cloth) => (
        <ClothCard key={cloth.id} cloth={cloth} />
      ))}
    </div>
  );
}

function ClothCard({ cloth }: { cloth: (typeof clothes)[0] }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="group bg-cream/70 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-3 border border-light">
      <Link href={`/shop/${cloth.slug}`} className="block">
        <div className="relative h-80 overflow-hidden bg-light">
          <Image
            src={cloth.image}
            alt={cloth.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {cloth.oldPrice && (
            <Badge className="absolute top-6 left-6 bg-accent text-white px-4 py-2 text-sm font-bold shadow-lg">
              {Math.round(
                ((cloth.oldPrice - cloth.price) / cloth.oldPrice) * 100
              )}
              % OFF
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/shop/${cloth.slug}`}>
          <h3 className="font-black text-xl mb-2 line-clamp-1 text-foreground group-hover:text-accent transition-colors">
            {cloth.name}
          </h3>
        </Link>
        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
          {cloth.description}
        </p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-foreground">
              ₹{cloth.price.toLocaleString()}
            </span>
            {cloth.oldPrice && (
              <span className="text-lg text-slate-400 line-through">
                ₹{cloth.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <Button
          onClick={(e) => {
            e.preventDefault();
            addToCart(cloth);
          }}
          className="w-full h-12 bg-accent hover:opacity-95 text-white font-bold shadow-lg hover:shadow-2xl transition-all rounded-2xl"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}

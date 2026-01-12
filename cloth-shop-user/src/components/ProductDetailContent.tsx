"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store";
import { useProductsStore } from "@/store/productsStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeaturedGrid from "./FeaturedGrid";

interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  image: string;
  categoryIds: number[];
}

interface Props {
  product: Product;
}

export default function ProductDetailContent({ product }: Props) {
  const addToCart = useCartStore((state) => state.addToCart);
  const categories = useProductsStore((state) => state.categories);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [related, setRelated] = useState<Product[]>([]);

  /* ---------- Images ---------- */
  const images =
    product.images?.length > 0 ? product.images : [product.image];

  /* ---------- Category Names ---------- */
  const catNames = product.categoryIds
    .map((id) => categories.find((c) => c.id === id)?.name)
    .filter(Boolean) as string[];

  /* ---------- Related Products (Backend) ---------- */
  useEffect(() => {
    const loadRelated = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${product.slug}/related`
        );
        const data = await res.json();

        const transformed = (data.data || []).map((p: any) => ({
          ...p,
          image: p.images?.[0] || "",
          categoryIds: p.categories?.map((c: any) => c.id) || [],
        }));

        setRelated(transformed);
      } catch (err) {
        console.error("Failed to load related products");
      }
    };

    loadRelated();
  }, [product.slug]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      {/* Breadcrumb */}
      <nav className="bg-cream/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3 text-sm text-foreground/80">
            <a href="/shop" className="hover:text-accent font-medium">
              Shop
            </a>
            <span>/</span>
            <span className="font-semibold text-foreground">
              {product.name}
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 lg:gap-16 xl:gap-24">
        {/* Gallery */}
        <div className="space-y-8">
          <div className="bg-cream/70 rounded-3xl shadow-2xl aspect-square relative p-4">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover rounded-2xl cursor-pointer"
            />
            <button className="absolute top-4 right-4 p-3 bg-cream rounded-2xl shadow-lg">
              <Heart className="h-5 w-5 text-accent" />
            </button>
          </div>

          <div className="flex gap-4">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-24 h-24 rounded-2xl overflow-hidden border-4 ${
                  selectedImage === idx
                    ? "border-accent"
                    : "border-transparent"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-8">
          <h1 className="text-5xl font-black">{product.name}</h1>

          <div className="flex items-center gap-6">
            <span className="text-4xl font-black">
              ₹{product.price.toLocaleString()}
            </span>
            {product.oldPrice && (
              <span className="text-xl line-through opacity-60">
                ₹{product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          {product.oldPrice && (
            <Badge className="bg-accent text-white text-lg px-4 py-2">
              {Math.round(
                ((product.oldPrice - product.price) / product.oldPrice) * 100
              )}
              % OFF
            </Badge>
          )}

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {catNames.map((name, i) => (
              <Badge key={i} className="px-4 py-2">
                {name}
              </Badge>
            ))}
          </div>

          <p className="text-lg opacity-80">{product.description}</p>

          {/* Quantity + Cart */}
          <div className="flex gap-6 items-center">
            <div className="flex items-center bg-white rounded-xl shadow p-2">
              <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus />
              </Button>
              <span className="px-6 font-bold">{quantity}</span>
              <Button onClick={() => setQuantity(quantity + 1)}>
                <Plus />
              </Button>
            </div>

            <Button
              size="lg"
              className="bg-accent text-white"
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                })
              }
            >
              <ShoppingCart className="mr-2" />
              Add to Cart
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Specifications</TabsTrigger>
            </TabsList>

            <TabsContent value="description">
              <p>{product.description}</p>
            </TabsContent>

            <TabsContent value="details">
              <ul className="space-y-2">
                <li>Material: Premium Cotton</li>
                <li>Origin: India</li>
                <li>Warranty: 30 Days</li>
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-black mb-12 text-center">
              Complete Your Look
            </h2>
            <FeaturedGrid clothes={related} />
          </div>
        </section>
      )}
    </div>
  );
}

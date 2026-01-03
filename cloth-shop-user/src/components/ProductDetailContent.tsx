"use client";
import Image from "next/image";
import { useState } from "react";
import { clothes, categories } from "@/lib/data";
import { useCartStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, ShoppingCart, Heart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeaturedGrid from "./FeaturedGrid";

interface Product {
  id: number;
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  categoryIds: number[];
  image: string;
  description: string;
}

interface Props {
  product: Product;
}

export default function ProductDetailContent({ product }: Props) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  const images = [
    product.image,
    "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&fit=crop",
    "https://images.unsplash.com/photo-1621184455862-4ab8b28d80aa?w=500&fit=crop",
  ];

  const catNames = product.categoryIds
    .map((id) => categories.find((c) => c.id === id)?.name)
    .filter(Boolean) as string[];

  const related = clothes
    .filter(
      (c) =>
        c.categoryIds.some((cid) => product.categoryIds.includes(cid)) &&
        c.id !== product.id
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
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

      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 lg:gap-16 xl:gap-24 items-start">
        {/* Gallery */}
        <div className="space-y-8 order-2 md:order-1">
          <div className="bg-cream/70 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden aspect-square relative group p-4">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover cursor-pointer group-hover:scale-105 transition-all duration-500 rounded-2xl"
              onClick={() => window.open(images[selectedImage], "_blank")}
            />

            <button className="absolute top-4 right-4 p-3 bg-cream/90 hover:bg-cream rounded-2xl shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
              <Heart className="h-5 w-5 text-accent" />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-4 px-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                className={`relative overflow-hidden rounded-2xl shadow-lg transition-all flex-shrink-0 w-24 h-24 border-4 ${
                  selectedImage === idx
                    ? "border-accent shadow-2xl shadow-accent/30 scale-105"
                    : "border-transparent hover:border-light hover:scale-105"
                }`}
                onClick={() => setSelectedImage(idx)}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-8 md:pt-8 order-1 md:order-2">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 text-foreground leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-6 mb-8">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl md:text-5xl font-black text-foreground">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="text-2xl text-foreground/60 line-through">
                    ₹{product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {product.oldPrice && (
                <Badge className="text-lg px-6 py-3 bg-accent text-white font-bold shadow-lg">
                  {Math.round(
                    ((product.oldPrice - product.price) / product.oldPrice) *
                      100
                  )}
                  % OFF
                </Badge>
              )}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-3 mb-8">
              {catNames.map((catName, idx) => (
                <Badge
                  key={idx}
                  className="text-base px-5 py-3 backdrop-blur-sm border border-light/30 font-semibold shadow-lg hover:shadow-accent/50 transition-all"
                >
                  {catName}
                </Badge>
              ))}
            </div>

            <p className="text-lg text-foreground/80 leading-relaxed mb-10 max-w-prose">
              {product.description}
            </p>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center mb-12">
              <div className="flex items-center gap-6 bg-cream/50 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-light/50">
                <label className="text-lg font-semibold text-foreground w-20">
                  Quantity:
                </label>
                <div className="flex items-center bg-white rounded-2xl p-2 shadow-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-12 w-12 p-0 hover:bg-light rounded-xl"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-5 w-5 text-foreground" />
                  </Button>
                  <span className="w-16 text-center text-2xl font-black text-foreground mx-4">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-12 w-12 p-0 hover:bg-light rounded-xl"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-5 w-5 text-foreground" />
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                className="flex-1 lg:w-auto h-16 text-xl font-black bg-accent shadow-2xl hover:shadow-accent/50 hover:scale-105 transition-all px-12 text-white"
                onClick={() => {
                  const { id, name, price, image } = product;
                  addToCart({ id, name, price, image });
                }}
              >
                <ShoppingCart className="mr-3 h-6 w-6" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-16 rounded-3xl bg-cream/50 backdrop-blur-sm shadow-xl border-0 p-1 mb-6">
              <TabsTrigger
                value="description"
                className="data-[state=active]:bg-accent data-[state=active]:text-white rounded-2xl h-14 font-semibold text-lg"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-accent data-[state=active]:text-white rounded-2xl h-14 font-semibold text-lg"
              >
                Specifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-8 pb-12">
              <div className="prose prose-lg max-w-none text-foreground/80 leading-relaxed">
                <p>{product.description}</p>
                <p className="mt-8 p-8 bg-cream/40 rounded-2xl">
                  Crafted with premium materials for the modern individual.
                  Perfect fit guaranteed.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="details" className="pt-8 pb-12">
              <div className="grid md:grid-cols-2 gap-8 text-sm">
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold text-foreground">
                      Material:
                    </span>{" "}
                    100% Premium Cotton
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Sizes:
                    </span>{" "}
                    S, M, L, XL, XXL
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Fit:</span>{" "}
                    Slim Fit
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold text-foreground">Care:</span>{" "}
                    Machine Wash Cold
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Origin:
                    </span>{" "}
                    India
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">
                      Warranty:
                    </span>{" "}
                    30 Days
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-32 bg-gradient-to-b from-cream to-white -mt-20 relative">
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground">
                Complete Your Look
              </h2>
              <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
            </div>
            <FeaturedGrid clothes={related} />
          </div>
        </section>
      )}
    </div>
  );
}

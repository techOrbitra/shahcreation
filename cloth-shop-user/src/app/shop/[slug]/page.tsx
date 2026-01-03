"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { clothes } from "@/lib/data";
import ProductDetailContent from "@/components/ProductDetailContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: Props) {
  const { slug } = use(params);
  const product = clothes.find((c) => c.slug === slug);
  if (!product) notFound();

  return <ProductDetailContent product={product} />;
}

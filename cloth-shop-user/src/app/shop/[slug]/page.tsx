"use client";

import React, { use } from "react";
import { notFound } from "next/navigation";
import { useProductsStore } from "@/store/productsStore";
import ProductDetailContent from "@/components/ProductDetailContent";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: Props) {
  // ✅ unwrap params correctly
  const { slug } = use(params);

  const fetchProductBySlug = useProductsStore(
    (state) => state.fetchProductBySlug
  );

  const [product, setProduct] = React.useState<any>(null);

  React.useEffect(() => {
    const loadProduct = async () => {
      const data = await fetchProductBySlug(slug);
      if (!data) {
        notFound();
        return;
      }
      setProduct(data);
    };

    loadProduct();
  }, [slug]);

  if (!product) return null;

  return <ProductDetailContent product={product} />;
}

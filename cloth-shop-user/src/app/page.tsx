import { clothes, categories } from "@/lib/data";
import Hero from "@/components/Hero";
import FeaturedGrid from "@/components/FeaturedGrid";
import CategoryChips from "@/components/CategoryChips";

export default function Home() {
  const featured = clothes.slice(0, 8);

  return (
    <div>
      <Hero />
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <CategoryChips categories={categories.slice(0, 4)} />
          <FeaturedGrid clothes={featured} />
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen xs:min-h-[90vh]   sm:min-h-screen md:h-screen flex items-center justify-center py-8 xs:py-10 sm:py-12">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=2000"
          alt="Luxury Fashion"
          fill
          className="object-cover"
          
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/40" />
      </div>
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 xs:px-5 sm:px-6">
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-3 xs:mb-4 sm:mb-6 drop-shadow-lg leading-tight">
          Shah Creation
        </h1>
        <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl mb-6 xs:mb-8 sm:mb-10 opacity-95 drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
          Traditional Fashion, Timeless Elegance
        </p>
        <div className="flex flex-col xs:flex-col sm:flex-row gap-3 xs:gap-4 sm:gap-6 justify-center items-center">
          <a href="/shop" className="group w-full xs:w-auto">
            <Button
              size="lg"
              className="bg-accent text-white hover:bg-accent/80 text-sm xs:text-base sm:text-lg lg:text-xl px-4 xs:px-6 sm:px-8 lg:px-10 py-2 xs:py-2.5 sm:py-3 lg:py-4 font-semibold shadow-2xl transition-all group-hover:scale-105 w-full xs:w-auto "
            >
              Shop Now
            </Button>
          </a>
          <a href="/about" className="w-full xs:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 bg-white text-black hover:bg-[#0f766e] backdrop-blur-sm text-sm xs:text-base sm:text-lg lg:text-xl px-4 xs:px-6 sm:px-8 lg:px-10 py-2 xs:py-2.5 sm:py-3 lg:py-4 font-semibold w-full xs:w-auto"
            >
              Discover More
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

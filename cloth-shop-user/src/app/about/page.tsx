import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sparkles, Award, Users, Heart, Zap, Target } from "lucide-react";

export default function About() {
  return (
    <section className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-10 xs:py-10 sm:py-15 md:py-20 bg-gradient-to-br from-[#f5f1ea] to-cream overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 xs:mb-16 sm:mb-20">
            <div className="flex items-center justify-center gap-2 mb-4 xs:mb-6">
              <Sparkles className="h-5 w-5 xs:h-6 xs:w-6 text-accent" />
              <span className="text-xs xs:text-sm font-bold uppercase tracking-widest text-accent">
                Our Story
              </span>
              <Sparkles className="h-5 w-5 xs:h-6 xs:w-6 text-accent" />
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-4 xs:mb-6 leading-tight">
              Shah Creation
            </h1>
            <div className="h-1 xs:h-1.5 w-24 xs:w-32 bg-gradient-to-r from-accent to-accent/50 mx-auto rounded-full mb-6 xs:mb-8"></div>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/80 max-w-3xl mx-auto leading-relaxed">
              Crafting luxury fashion since 2025. Where elegance meets
              innovation, and every piece tells a story.
            </p>
          </div>
        </div>
      </div>

      {/* Mission, Vision, Values */}
      <div className="py-16 xs:py-20 sm:py-24 md:py-32 px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 xs:gap-8 sm:gap-10">
            {/* Mission */}
            <div className="group bg-gradient-to-br from-cream/50 to-white border border-light/50 rounded-2xl xs:rounded-3xl p-6 xs:p-8 sm:p-10 hover:shadow-2xl transition-all duration-300 hover:border-accent/30">
              <div className="h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl xs:rounded-2xl flex items-center justify-center mb-4 xs:mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 text-accent" />
              </div>
              <h3 className="text-lg xs:text-xl sm:text-2xl font-black mb-3 xs:mb-4 text-foreground">
                Our Mission
              </h3>
              <p className="text-sm xs:text-base text-foreground/70 leading-relaxed">
                To deliver premium fashion that empowers individuals to express
                their unique style and confidence.
              </p>
            </div>

            {/* Vision */}
            <div className="group bg-gradient-to-br from-cream/50 to-white border border-light/50 rounded-2xl xs:rounded-3xl p-6 xs:p-8 sm:p-10 hover:shadow-2xl transition-all duration-300 hover:border-accent/30">
              <div className="h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl xs:rounded-2xl flex items-center justify-center mb-4 xs:mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 text-accent" />
              </div>
              <h3 className="text-lg xs:text-xl sm:text-2xl font-black mb-3 xs:mb-4 text-foreground">
                Our Vision
              </h3>
              <p className="text-sm xs:text-base text-foreground/70 leading-relaxed">
                To become the most trusted luxury fashion brand known for
                innovation, quality, and timeless elegance.
              </p>
            </div>

            {/* Values */}
            <div className="group bg-gradient-to-br from-cream/50 to-white border border-light/50 rounded-2xl xs:rounded-3xl p-6 xs:p-8 sm:p-10 hover:shadow-2xl transition-all duration-300 hover:border-accent/30">
              <div className="h-12 w-12 xs:h-14 xs:w-14 sm:h-16 sm:w-16 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl xs:rounded-2xl flex items-center justify-center mb-4 xs:mb-6 group-hover:scale-110 transition-transform">
                <Heart className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 text-accent" />
              </div>
              <h3 className="text-lg xs:text-xl sm:text-2xl font-black mb-3 xs:mb-4 text-foreground">
                Our Values
              </h3>
              <p className="text-sm xs:text-base text-foreground/70 leading-relaxed">
                Quality, integrity, and sustainability guide every decision we
                make in crafting your perfect style.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 xs:py-20 sm:py-24 md:py-32 px-3 xs:px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-cream/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 xs:gap-10 sm:gap-12 md:gap-16 items-center">
            {/* Image */}
            <div className="relative h-64 xs:h-80 sm:h-96 lg:h-[500px] rounded-2xl xs:rounded-3xl overflow-hidden shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1558618047-3c8c76ca6e97?w=800"
                alt="Shah Creation"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black mb-4 xs:mb-6 text-foreground leading-tight">
                Our Legacy of Excellence
              </h2>
              <p className="text-sm xs:text-base sm:text-lg text-foreground/80 mb-4 xs:mb-6 leading-relaxed">
                Shah Creation was born from a passion for timeless elegance and
                superior craftsmanship. Founded with a vision to revolutionize
                the luxury fashion industry, we believe that every piece should
                tell a story.
              </p>
              <p className="text-sm xs:text-base sm:text-lg text-foreground/80 mb-6 xs:mb-8 leading-relaxed">
                Every garment is meticulously designed and crafted to make you
                feel extraordinary. We combine traditional artistry with modern
                innovation, ensuring that each collection reflects the essence
                of contemporary luxury.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 xs:gap-4">
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg xs:rounded-xl p-4 xs:p-6 border border-accent/20">
                  <div className="text-2xl xs:text-3xl sm:text-4xl font-black text-accent mb-1">
                    500+
                  </div>
                  <p className="text-xs xs:text-sm font-semibold text-foreground/70 uppercase tracking-wide">
                    Happy Clients
                  </p>
                </div>
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg xs:rounded-xl p-4 xs:p-6 border border-accent/20">
                  <div className="text-2xl xs:text-3xl sm:text-4xl font-black text-accent mb-1">
                    50+
                  </div>
                  <p className="text-xs xs:text-sm font-semibold text-foreground/70 uppercase tracking-wide">
                    Collections
                  </p>
                </div>
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg xs:rounded-xl p-4 xs:p-6 border border-accent/20">
                  <div className="text-2xl xs:text-3xl sm:text-4xl font-black text-accent mb-1">
                    100%
                  </div>
                  <p className="text-xs xs:text-sm font-semibold text-foreground/70 uppercase tracking-wide">
                    Quality
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-16 xs:py-20 sm:py-24 md:py-32 px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 xs:mb-16 sm:mb-20">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black mb-3 xs:mb-4 text-foreground">
              Why Choose Us?
            </h2>
            <p className="text-sm xs:text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
              Experience the difference that true craftsmanship brings
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8">
            {[
              {
                icon: Award,
                title: "Premium Quality",
                desc: "Carefully selected materials for durability and comfort",
              },
              {
                icon: Users,
                title: "Expert Team",
                desc: "Experienced designers committed to your satisfaction",
              },
              {
                icon: Sparkles,
                title: "Unique Designs",
                desc: "Exclusive collections that set you apart",
              },
              {
                icon: Heart,
                title: "Customer First",
                desc: "Your happiness is our top priority",
              },
              {
                icon: Zap,
                title: "Fast Delivery",
                desc: "Quick and reliable shipping to your door",
              },
              {
                icon: Target,
                title: "Best Prices",
                desc: "Luxury fashion at competitive rates",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group bg-white border border-light/50 rounded-2xl xs:rounded-3xl p-6 xs:p-8 hover:shadow-xl hover:border-accent/30 transition-all duration-300"
              >
                <div className="h-12 w-12 xs:h-14 xs:w-14 bg-accent/10 rounded-lg xs:rounded-xl flex items-center justify-center mb-4 xs:mb-6 group-hover:bg-accent group-hover:text-white transition-all">
                  <item.icon className="h-6 w-6 xs:h-7 xs:w-7 text-accent group-hover:text-white" />
                </div>
                <h3 className="text-base xs:text-lg sm:text-xl font-black mb-2 xs:mb-3 text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs xs:text-sm text-foreground/70">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 xs:py-20 sm:py-24 md:py-32 px-3 xs:px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent/5 via-cream/50 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black mb-4 xs:mb-6 text-foreground">
            Ready to Elevate Your Style?
          </h2>
          <p className="text-sm xs:text-base sm:text-lg text-foreground/70 mb-8 xs:mb-10 sm:mb-12 max-w-2xl mx-auto">
            Explore our exclusive collections and discover pieces that celebrate
            your unique identity.
          </p>
          <a href="/shop">
            <Button className="bg-accent hover:bg-accent/80 hover:text-black/70 text-white text-base xs:text-lg sm:text-xl px-6 xs:px-8 sm:px-12 py-3 xs:py-3.5 sm:py-4 rounded-xl xs:rounded-2xl font-black shadow-lg transition-all duration-300 hover:scale-105">
              Explore Collection
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

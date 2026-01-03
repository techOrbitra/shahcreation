"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Cart from "@/components/Cart";
import { useCartStore } from "@/lib/store";
import { SITE_NAME } from "@/lib/constants";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cartItems = useCartStore((state) => state.cartItems);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#fff] border-b border-light shadow-sm">
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2 xs:py-3 sm:py-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-base xs:text-lg sm:text-2xl md:text-3xl font-black flex-shrink-0 min-w-0"
          >
            <span className="text-accent truncate">{SITE_NAME}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-10">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base font-bold transition-colors ${
                  isActive(item.href)
                    ? "text-accent"
                    : "text-foreground hover:text-accent"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 xs:gap-2 sm:gap-4">
            {/* Cart Button - Responsive */}
            <Button
              variant="ghost"
              onClick={() => setCartOpen(true)}
              className="relative h-9 w-9 xs:h-10 xs:w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 hover:bg-accent/10 rounded-lg xs:rounded-xl sm:rounded-2xl transition-all flex-shrink-0"
            >
              <ShoppingCart className="h-5 w-5 xs:h-5 xs:w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-accent" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7 flex items-center justify-center font-black shadow-lg animate-pulse text-[10px] xs:text-xs">
                  {cartItems.length}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <div suppressHydrationWarning className="md:hidden flex-shrink-0">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 w-9 xs:h-10 xs:w-10 sm:h-12 sm:w-12 hover:bg-accent/10 rounded-lg xs:rounded-xl sm:rounded-2xl flex-shrink-0"
                  >
                    <Menu className="h-5 w-5 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-accent" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="bg-[#f5f1ea] w-[280px] xs:w-[300px] sm:w-[320px] p-4 xs:p-5 sm:p-6"
                >
                  <nav className="flex flex-col space-y-3 xs:space-y-4 sm:space-y-6 mt-6 xs:mt-8 sm:mt-12">
                    {navLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`text-base xs:text-lg sm:text-xl font-bold transition-colors py-2 ${
                          isActive(item.href)
                            ? "text-accent"
                            : "text-foreground hover:text-accent"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <Cart open={cartOpen} onOpenChange={setCartOpen} />
    </nav>
  );
}

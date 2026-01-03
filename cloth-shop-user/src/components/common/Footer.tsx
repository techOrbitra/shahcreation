import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-light text-foreground py-6 xs:py-8 sm:py-12 mt-12 xs:mt-16 sm:mt-20">
      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6 md:gap-8 mb-6 xs:mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-base xs:text-lg sm:text-2xl font-black text-accent mb-2 xs:mb-3 sm:mb-4">
              {SITE_NAME}
            </h3>
            <p className="text-xs xs:text-xs sm:text-sm text-foreground/70 leading-relaxed mb-3 xs:mb-4 text-justify">
              Premium fashion crafted for elegance and style. Quality you can
              trust.
            </p>
            <div className="flex space-x-2 xs:space-x-3 sm:space-x-4">
              <a
                href="#"
                className="h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 rounded-full bg-accent/10 hover:bg-accent text-accent hover:text-white flex items-center justify-center transition-all flex-shrink-0"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="#"
                className="h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 rounded-full bg-accent/10 hover:bg-accent text-accent hover:text-white flex items-center justify-center transition-all flex-shrink-0"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
              </a>
              <a
                href="#"
                className="h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 rounded-full bg-accent/10 hover:bg-accent text-accent hover:text-white flex items-center justify-center transition-all flex-shrink-0"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm xs:text-base sm:text-lg font-bold mb-2 xs:mb-3 sm:mb-4">
              Quick Links
            </h4>
            <ul className="space-y-1.5 xs:space-y-2 sm:space-y-3">
              {[
                { name: "Shop", href: "/shop" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs xs:text-xs sm:text-sm text-foreground/70 hover:text-accent transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm xs:text-base sm:text-lg font-bold mb-2 xs:mb-3 sm:mb-4">
              Contact Us
            </h4>
            <ul className="space-y-2 xs:space-y-2.5 sm:space-y-3">
              <li className="flex items-start gap-2 xs:gap-3">
                <Phone className="h-4 w-4 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-xs xs:text-xs sm:text-sm">
                    +91 98765 43210
                  </p>
                  <p className="text-xs text-foreground/60">Mon-Sat 9AM-8PM</p>
                </div>
              </li>
              <li className="flex items-start gap-2 xs:gap-3">
                <Mail className="h-4 w-4 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0 mt-0.5" />
                <p className="font-medium text-xs xs:text-xs sm:text-sm">
                  hello@shahcreation.com
                </p>
              </li>
              <li className="flex items-start gap-2 xs:gap-3">
                <MapPin className="h-4 w-4 xs:h-4 xs:w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0 mt-0.5" />
                <p className="font-medium text-xs xs:text-xs sm:text-sm">
                  123 Fashion Street, Siddhapur, Gujarat
                </p>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm xs:text-base sm:text-lg font-bold mb-2 xs:mb-3 sm:mb-4">
              Categories
            </h4>
            <ul className="space-y-1.5 xs:space-y-2 sm:space-y-3">
              {["Men", "Women", "Kids", "Sale", "New Arrivals"].map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/shop?category=${cat
                      .toLowerCase()
                      .replace(" ", "-")}`}
                    className="text-xs xs:text-xs sm:text-sm text-foreground/70 hover:text-accent transition-colors font-medium"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-foreground/10 pt-4 xs:pt-5 sm:pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2 xs:gap-3 sm:gap-4">
            <p className="text-xs text-foreground/60 text-center md:text-left">
              © 2026 {SITE_NAME}. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6 text-xs">
              <Link
                href="/privacy"
                className="text-foreground/60 hover:text-accent transition-colors text-xs"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-foreground/60 hover:text-accent transition-colors text-xs"
              >
                Terms of Service
              </Link>
              <Link
                href="/refund"
                className="text-foreground/60 hover:text-accent transition-colors text-xs"
              >
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

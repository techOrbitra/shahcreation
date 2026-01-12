"use client";
import { useCartStore } from "@/lib/store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Cart({ open, onOpenChange }: Props) {
  const { cartItems, updateQuantity, removeFromCart, clearCart } =
    useCartStore();
  const [checkoutData, setCheckoutData] = useState({
    name: "",
    phone: "",
    whatsapp: "",
    address: "",
  });

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!checkoutData.name || !checkoutData.phone || cartItems.length === 0)
      return;

    const orderText = `
    🛍️ *NEW ORDER RECEIVED*
    
    ━━━━━━━━━━━━━━━
    👤 *Customer Details*
    ━━━━━━━━━━━━━━━
    • Name: ${checkoutData.name}
    • Phone: ${checkoutData.phone}
    • WhatsApp: ${checkoutData.whatsapp || "-"}
    • Address: ${checkoutData.address || "-"}
    
    ━━━━━━━━━━━━━━━
    🛒 *Order Items*
    ━━━━━━━━━━━━━━━
    ${cartItems
      .map(
        (item) =>
          `• ${item.name} × ${item.quantity}  —  ₹${item.price * item.quantity}`
      )
      .join("\n")}
    
    ━━━━━━━━━━━━━━━
    💰 *Order Total*
    ━━━━━━━━━━━━━━━
    ₹${total}
    
    ━━━━━━━━━━━━━━━
    📌 *Payment Method*
    ━━━━━━━━━━━━━━━
    Cash on Delivery (COD)
    
    🙏 Thank you for shopping with *Shah Creation*
    `;

    // ✅ IMPORTANT: replace with YOUR business number
    const businessNumber = "919876543210"; // <-- NO +, NO spaces

    const encodedText = encodeURIComponent(orderText);

    // Universal WhatsApp URL
    const whatsappUrl = `https://wa.me/${businessNumber}?text=${encodedText}`;

    // ✅ Works on Android, iOS, Desktop
    window.location.href = whatsappUrl;

    clearCart();
    onOpenChange(false);
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] sm:w-[540px] p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>

        <div className="p-6 flex-1 overflow-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="mx-auto h-12 w-12 text-slate-400 mb-4" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b last:border-b-0"
                >
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.name}</h3>
                    <p className="text-sm text-slate-500">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t bg-slate-50">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{total}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <Label>Name *</Label>
                <Input
                  value={checkoutData.name}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, name: e.target.value })
                  }
                  placeholder="Full Name"
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input
                  value={checkoutData.phone}
                  onChange={(e) =>
                    setCheckoutData({ ...checkoutData, phone: e.target.value })
                  }
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <Label>Your WhatsApp</Label>
                <Input
                  value={checkoutData.whatsapp}
                  onChange={(e) =>
                    setCheckoutData({
                      ...checkoutData,
                      whatsapp: e.target.value,
                    })
                  }
                  placeholder="WhatsApp Number"
                />
              </div>
              <div>
                <Label>Delivery Address</Label>
                <Input
                  value={checkoutData.address}
                  onChange={(e) =>
                    setCheckoutData({
                      ...checkoutData,
                      address: e.target.value,
                    })
                  }
                  placeholder="Full Address"
                />
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full bg-accent text-white"
            >
              Place Order via WhatsApp (COD)
            </Button>
            <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl border border-emerald-200">
              <p className="text-sm font-medium text-emerald-800 mb-2">
                📱 Order Confirmation
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">
                Click "Place Order" to send complete details to Shah Creation
                via WhatsApp. Our team will contact you within 30 minutes to
                confirm.
              </p>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

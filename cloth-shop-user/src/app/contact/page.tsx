"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Phone, Mail, MapPin, Clock } from "lucide-react";
import Image from "next/image";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // WhatsApp direct
    const text = `New Contact Form: Name: ${formData.name}, Phone: ${formData.phone}, Email: ${formData.email}, Message: ${formData.message}`;
    window.open(
      `https://wa.me/+91${process.env.MY_NUMBER}?text=${encodeURIComponent(
        text
      )}`,
      "_blank"
    );
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="py-20 max-w-6xl mx-auto px-4">
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Get In Touch
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Have questions? We're here to help.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-20">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-accent/8 to-accent/4 rounded-2xl">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Phone</h3>
              <p className="text-2xl font-bold text-slate-950">
                +91 98765 43210
              </p>
              <p className="text-sm text-slate-500">Mon-Sat 9AM-8PM</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-accent/8 to-accent/4 rounded-2xl">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Email</h3>
              <p className="text-lg font-medium">hello@clothshop.com</p>
            </div>
          </div>

           <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-accent/8 to-accent/4 rounded-2xl">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <MapPin className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Address</h3>
              <p className="text-sm leading-relaxed">
                123 Fashion Street
                <br />
                Narnaund, Haryana 124001
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-accent/8 rounded-2xl">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Working Hours</h3>
              <p className="text-sm">
                Mon-Sat: 9AM - 8PM
                <br />
                Sunday: 10AM - 6PM
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone *
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <Textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={5}
                placeholder="Tell us about your query..."
              />
            </div>
            <Button
              type="submit"
              className="w-full h-14 bg-accent hover:bg-accent/80 text-white text-lg"
            >
              <Send className="mr-2 h-5 w-5" />
              Send Message
            </Button>
          </form>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
        <Image
          src="https://images.unsplash.com/photo-1551632811-561732a7d5e0?w=1200&fit=crop"
          alt="Our Location"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-6 left-6 text-foreground">
          <h3 className="text-2xl font-bold mb-2">Visit Us</h3>
          <p className="text-lg">Open Google Maps</p>
        </div>
      </div>
    </div>
  );
}

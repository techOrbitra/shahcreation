"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Phone, Mail, MapPin, Clock, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useContactStore } from "@/store/contactStore";

export default function Contact() {
  const { settings, isLoading, error, fetchSettings, createInquiry } =
    useContactStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    try {
      await createInquiry(formData);
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });

      // Auto hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      setSubmitError(
        error.message || "Failed to submit inquiry. Please try again."
      );
    }
  };

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-foreground/60 text-lg">
            Loading contact information...
          </p>
        </div>
      </div>
    );
  }

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
          {/* Phone */}
          <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-accent/8 to-accent/4 rounded-2xl">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Phone</h3>
              <a
                href={`tel:${settings.phone}`}
                className="text-2xl font-bold text-slate-950 hover:text-accent transition-colors"
              >
                {settings.phone}
              </a>
              {settings.phoneHours && (
                <p className="text-sm text-slate-500 mt-1">
                  {settings.phoneHours}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-accent/8 to-accent/4 rounded-2xl">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Email</h3>
              <a
                href={`mailto:${settings.email}`}
                className="text-lg font-medium text-slate-900 hover:text-accent transition-colors"
              >
                {settings.email}
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-accent/8 to-accent/4 rounded-2xl">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Address</h3>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {settings.address}
              </p>
            </div>
          </div>

          {/* Working Hours */}
          {settings.workingHours && (
            <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-accent/8 to-accent/4 rounded-2xl">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Working Hours</h3>
                <p className="text-sm whitespace-pre-line">
                  {settings.workingHours}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className="space-y-6">
          {/* Success Message */}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-900">
                  Message sent successfully!
                </p>
                <p className="text-sm text-green-700">
                  We'll get back to you soon.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Phone *
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  placeholder="+91 98765 43210"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Message *
              </label>
              <Textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={5}
                placeholder="Tell us about your query..."
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-accent hover:bg-accent/80 text-white text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      {/* Map Section */}
      <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl group">
        {settings.mapImageUrl ? (
          <Image
            src={settings.mapImageUrl}
            alt="Our Location"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/10 to-accent/5 flex items-center justify-center">
            <MapPin className="w-20 h-20 text-accent/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h3 className="text-2xl font-bold mb-2">Visit Our Store</h3>
          <p className="text-lg mb-4">{settings.address?.split("\n")[0]}</p>
        </div>
      </div>
    </div>
  );
}

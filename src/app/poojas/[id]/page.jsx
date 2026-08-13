"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Clock,
  Video,
  Home,
  Star,
  Users,
  CheckCircle,
  Languages,
} from "lucide-react";
import Button from "@/components/ui/Button";
import useCheckoutStore from "@/store/checkoutStore";

export default function PoojaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Rename to avoid conflict - this is for the checkout store
  const setPoojaInStore = useCheckoutStore((state) => state.setPooja);
  
  // This is for the local component state
  const [pooja, setPoojaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPooja = async () => {
      try {
        // Handle async params if needed
        const id = await params.id || params.id;
        
        const response = await fetch(`/backend/poojas/${id}`);
        if (!response.ok) {
          throw new Error('Pooja not found');
        }
        const data = await response.json();
        setPoojaData(data); // Use the renamed setter
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPooja();
    }
  }, [params.id]);

 const handleBookNow = () => {
  setPoojaInStore(pooja);
  router.push(`/checkout?poojaId=${pooja.id}`);
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  if (error || !pooja) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Pooja not found</p>
      </div>
    );
  }

  const discount = Math.round(
    ((pooja.price - pooja.offer_price) / pooja.price) * 100
  );

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-secondary mb-8">
          <span
            onClick={() => router.push("/")}
            className="cursor-pointer hover:text-primary-main"
          >
            Home
          </span>
          <span>/</span>
          <span
            onClick={() => router.push("/poojas")}
            className="cursor-pointer hover:text-primary-main"
          >
            Poojas
          </span>
          <span>/</span>
          <span className="text-main">{pooja.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left - Image */}
          <div className="space-y-6">
            <div className="relative w-full h-[500px] bg-gray-100 rounded-r32 overflow-hidden">
              <Image
                src={pooja.image}
                alt={pooja.title}
                fill
                className="object-contain p-8"
                priority
              />
              {pooja.popular && (
                <div className="absolute top-4 left-4 bg-primary-main text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Popular
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-500 mb-1">
                  <Star size={20} fill="currentColor" />
                  <span className="text-lg font-bold text-main">
                    {pooja.rating}
                  </span>
                </div>
                <p className="text-sm text-secondary">Rating</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Users size={20} className="text-primary-main" />
                  <span className="text-lg font-bold text-main">
                    {pooja.bookings}
                  </span>
                </div>
                <p className="text-sm text-secondary">Bookings</p>
              </div>
            </div>
          </div>

          {/* Right - Details */}
          <div className="space-y-8">
            <div>
              <h1 className="heading-h1 text-main mb-4">{pooja.title}</h1>
              <p className="text-xl text-secondary leading-relaxed">
                {pooja.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-primary-light to-secondary-light p-6 rounded-xl">
              <div className="flex items-end gap-4 mb-2">
                <span className="text-4xl font-bold text-main">
                  ₹{pooja.offer_price}
                </span>
                <span className="text-2xl text-secondary line-through mb-1">
                  ₹{pooja.price}
                </span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-1">
                  {discount}% OFF
                </span>
              </div>
              <p className="text-sm text-secondary">
                Inclusive of all taxes and materials
              </p>
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <h3 className="heading-h4 text-main">Key Features</h3>

              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center shrink-0">
                    <Clock size={20} className="text-primary-main" />
                  </div>
                  <div>
                    <p className="font-semibold text-main">Duration</p>
                    <p className="text-sm text-secondary">{pooja.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary-light rounded-full flex items-center justify-center shrink-0">
                    {pooja.mode === "Video Call" ? (
                      <Video size={20} className="text-secondary-dark" />
                    ) : (
                      <Home size={20} className="text-secondary-dark" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-main">Mode</p>
                    <p className="text-sm text-secondary">{pooja.mode}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center shrink-0">
                    <Languages size={20} className="text-primary-main" />
                  </div>
                  <div>
                    <p className="font-semibold text-main">Languages</p>
                    <p className="text-sm text-secondary">
                      {Array.isArray(pooja.language) ? pooja.language.join(", ") : pooja.language}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="space-y-4">
              <h3 className="heading-h4 text-main">What's Included</h3>
              <div className="space-y-3">
                {[
                  "Experienced Vedic Pandit Ji",
                  "Complete pooja samagri (for on-site)",
                  "Live guidance and blessings",
                  "Prasad delivery (for on-site)",
                  "Post-pooja consultation",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle
                      size={20}
                      className="text-green-500 shrink-0 mt-0.5"
                    />
                    <span className="text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="sticky bottom-4 bg-white border-t pt-6">
              <Button
                onClick={handleBookNow}
                className="w-full !h-14 !text-lg"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Loading..." : `Book Now - ₹${pooja.offer_price}`}
              </Button>
              <p className="text-center text-sm text-secondary mt-3">
                100% Safe & Secure Payment
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-gray-50 p-8 rounded-xl">
          <h3 className="heading-h3 text-main mb-6">
            About {pooja.title}
          </h3>
          <div className="prose max-w-none text-secondary">
            <p className="mb-4">
              {pooja.title} is a sacred Vedic ritual performed to invoke divine
              blessings and positive energy. This powerful ceremony has been
              practiced for centuries and brings prosperity, peace, and spiritual
              growth.
            </p>
            <p className="mb-4">
              Our experienced Pandit Ji will perform all rituals according to
              authentic Vedic traditions, ensuring you receive maximum spiritual
              benefits. Whether you choose online or on-site, the sanctity and
              effectiveness of the pooja remain the same.
            </p>
            <p>
              {pooja.mode === "Video Call"
                ? "Join from anywhere via video call and participate in real-time. You'll receive a complete list of required items before the pooja."
                : "Our Pandit Ji will arrive at your home with all necessary pooja materials, making it completely hassle-free for you."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
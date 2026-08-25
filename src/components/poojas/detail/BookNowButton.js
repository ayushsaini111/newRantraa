// src/components/poojas/detail/BookNowButton.js
"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import useCheckoutStore from "@/store/checkoutStore";

export default function BookNowButton({ pooja, className = "", label }) {
  const router = useRouter();
  const setPoojaInStore = useCheckoutStore((state) => state.setPooja);

  const handleBookNow = () => {
    setPoojaInStore(pooja);
    router.push(`/checkout?poojaId=${pooja.id}`);
  };

  if (label) {
    return (
      <Button onClick={handleBookNow} className={className}>
        {label}
      </Button>
    );
  }

  return (
    <div className="sticky bottom-0 bg-background border-t border-secondary-dark pt-3 z-10">
      <Button onClick={handleBookNow} className={`w-full !h-12 sm:!h-14 !text-base sm:!text-lg ${className}`}>
        Book Now - ₹{pooja.offer_price}
      </Button>
      <p className="text-center text-xs sm:text-sm text-secondary mt-2 sm:mt-3">
        100% Safe & Secure Payment
      </p>
    </div>
  );
}
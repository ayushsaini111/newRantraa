"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function CommunityOfferSection() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-background">
      {/* Top soft curve */}
      <div
        aria-hidden="true"
        className="
          absolute
          -top-[45px]
          left-1/2
          h-[70px]
          w-[120%]
          -translate-x-1/2
          rounded-[50%]
         
          blur-[8px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-[300px]
          max-w-7xl
          flex-col
          items-center
          justify-center
          px-s16
          py-s48
          text-center
          sm:min-h-[320px]
          lg:py-0
        "
      >
        {/* Small Heading */}
        <p className="heading-h5 font-medium text-main">
          Limited Time offer
        </p>

        {/* Main Heading */}
        <h2
          className="
            mt-s16
            heading-h3
            text-main
          "
        >
          Join Community for Free*
        </h2>

        {/* Actions */}
        <div className="mt-s16 flex items-center gap-s16">
          <Button
            size="sm"
            onClick={() => router.push("/community")}
          >
            Know more
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push("/community")}
          >
            Join
          </Button>
        </div>
      </div>
    </section>
  );
}
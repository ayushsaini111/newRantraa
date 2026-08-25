"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative isolate mt-s80 overflow-hidden">
      {/* Full-section background video */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Tint overlay on top of video, using your primary-light token */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 backdrop-blur-xs"
      />

      {/* Top Curve */}
      <div
        aria-hidden="true"
        className="
          absolute
          -top-[230px] md:-top-[110px]
          left-1/2
          z-10
          h-[170px]
          w-[125%]
          -translate-x-1/2
          rounded-[50%]
          bg-background
        "
      />

      {/* Main Content */}
      <div
        className="
          relative
          z-20
          mx-auto
          flex
          min-h-[600px]
          max-w-7xl
          items-center
          px-s16
          py-s48
          sm:px-s24
          sm:py-s64
          lg:min-h-[780px]
          lg:px-s32
          lg:py-s104
        "
      >
        <div
          className="
            grid
            w-full
            items-center
            gap-s32
            sm:gap-s48
            lg:grid-cols-[1.35fr_0.65fr]
            lg:gap-s64
          "
        >
          {/* Left Content */}
          <div className="max-w-[650px]">
            <h1
              className="
                heading-h2
                max-w-[620px]
                text-white/85
              "
            >
              Talk to Experienced
              <br className="hidden sm:block" />
              Pandits. Find Guidance
              <br className="hidden sm:block" />
              for Every Stage of Life.
            </h1>

            <div className="mt-s24 sm:mt-s32">
              <Button onClick={() => router.push("/consult")}>
                Talk to Pandit
              </Button>
            </div>
          </div>

        
        </div>
      </div>

      {/* Bottom Curve */}
      <div
        aria-hidden="true"
        className="
          absolute
           -bottom-[150px] md:-bottom-[105px]
          left-1/2
          z-10
          h-[200px]
          w-[125%]
          -translate-x-1/2
          rounded-[50%]
          bg-background
        "
      />
    </section>
  );
}
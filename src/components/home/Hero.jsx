"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative isolate mt-s80 overflow-hidden bg-primary-light/20 ">
      {/* Top Curve */}
      <div
        aria-hidden="true"
        className="
          absolute
          -top-[110px]
          left-1/2
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
          z-10
          mx-auto
          flex
          min-h-[780px]
          max-w-7xl
          items-center
          px-s16
          py-s80
          sm:px-s24
          lg:px-s32
          lg:py-s104
        "
      >
        <div
          className="
            grid
            w-full
            items-center
            gap-s48
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
                text-primary-main
              "
            >
              Talk to Experienced
              <br className="hidden sm:block" />
              Pandits. Find Guidance
              <br className="hidden sm:block" />
              for Every Stage of Life.
            </h1>

            <div className="mt-s32">
              <Button
                onClick={() => router.push("/consult")}
              >
                Talk to Pandit
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="
                relative
                h-[300px]
                w-full
                max-w-[400px]
                overflow-hidden
                rounded-r16
                bg-background
                shadow-sm
                sm:h-[360px]
                lg:h-[390px]
              "
            >
              <Image
                src="/hero.jpg"
                alt="Experienced Pandit"
                fill
                priority
                sizes="
                  (max-width: 640px) 90vw,
                  (max-width: 1024px) 50vw,
                  400px
                "
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Curve */}
      <div
        aria-hidden="true"
        className="
          absolute
          -bottom-[105px]
          left-1/2
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
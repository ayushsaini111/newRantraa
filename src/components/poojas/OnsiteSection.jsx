"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import Button from "@/components/ui/Button";
import PoojaCard from "./PoojaCard";

export default function OnsiteSection({ data }) {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: direction === "next" ? 360 : -360,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-s104">
      {/* Top */}

      <div className="grid lg:grid-cols-12 gap-s64">
        {/* Left */}

        <div className="lg:col-span-4">
          <h2 className="heading-h2">
            {data.title}
          </h2>

          <div className="mt-s40">
            <PoojaCard data={data.cards[0]} />
          </div>
        </div>

        {/* Right */}

        <div className="lg:col-span-8 pr-s80 flex flex-col items-end">
          <p className="body-default max-w-md text-secondary">
            {data.description}
          </p>

          <div className="mt-s64 flex max-w-md flex-col gap-s24">
            <div
              className="
                h-15
                w-15
                rounded-full
                bg-secondary-main
                flex
                items-center
                justify-center
              "
            >
              <ShieldCheck
                size={30}
                className="text-secondary-dark"
              />
            </div>

            <h3 className="heading-h4">
              {data.feature.title}
            </h3>

            <p className="body-large text-secondary">
              {data.feature.description}
            </p>
          </div>
        </div>
      </div>

      {/* Slider */}

      <div className="mt-s48 overflow-hidden">
        <div
          ref={sliderRef}
          className="
            flex
            gap-s32
            overflow-x-auto
            hide-scrollbar
            scroll-smooth
          "
        >
          {data.cards.slice(1).map((item) => (
            <PoojaCard
              key={item.id}
              data={item}
            />
          ))}

          <div className="w-40 shrink-0" />
        </div>
      </div>

      {/* Bottom */}

      <div className="flex items-center justify-between mt-s40 pr-s24">
        <Link href="/poojas/all?mode=On-site">
          <Button
            variant="outline"
            className="rounded-full"
          >
            View All
          </Button>
        </Link>

        <div className="flex gap-s16">
          <Button
            variant="ghost"
            size="md"
            onClick={() => scroll("prev")}
            className="!h-11 !w-11 !rounded-full !p-0 bg-black text-white hover:bg-gray-800"
          >
            <ChevronLeft size={18} />
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={() => scroll("next")}
            className="!h-11 !w-11 !rounded-full !p-0 bg-black text-white hover:bg-gray-800"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
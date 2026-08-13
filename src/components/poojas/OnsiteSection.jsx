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
      left: direction === "next" ? 380 : -380,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-s104 w-full overflow-hidden">
      {/* =========================
          TOP CONTENT
      ========================= */}
      <div className="mx-auto max-w-7xl px-s16 lg:px-0">
        <div className="grid gap-s64 lg:grid-cols-12">
          {/* Left */}
          <div className="lg:col-span-4">
            <h2 className="heading-h2">
              {data?.title}
            </h2>

            <div className="mt-s40">
              {data?.cards?.[0] && (
                <PoojaCard data={data.cards[0]} />
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end lg:col-span-8">
            <p className="body-default max-w-md text-secondary">
              {data?.description}
            </p>

            <div className="mt-s64 flex max-w-md flex-col gap-s24">
              <div
                className="
                  flex
                  h-15
                  w-15
                  items-center
                  justify-center
                  rounded-full
                  bg-secondary-main
                "
              >
                <ShieldCheck
                  size={30}
                  className="text-secondary-dark"
                />
              </div>

              <h3 className="heading-h4">
                {data?.feature?.title}
              </h3>

              <p className="body-large text-secondary">
                {data?.feature?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          HORIZONTAL SLIDER
          EXTENDS TO RIGHT EDGE
      ========================= */}
      <div className="mt-s48 w-full overflow-hidden">
        <div
          ref={sliderRef}
          className="
            flex
            gap-s32
            overflow-x-auto
            scroll-smooth
            hide-scrollbar
            pl-s16
            lg:pl-[max(16px,calc((100vw-1280px)/2))]
            pr-s16
            lg:pr-s32
          "
        >
          {data?.cards?.slice(1).map((item) => (
            <div
              key={item.id}
              className="
                w-[230px]
                shrink-0
                sm:w-[245px]
                xl:w-[300px]
              "
            >
              <PoojaCard data={item} />
            </div>
          ))}

          {/* Extra space at right */}
          <div className="w-s80 shrink-0 lg:w-s104" />
        </div>
      </div>

      {/* =========================
          BOTTOM CONTROLS
      ========================= */}
      <div
        className="
          mx-auto
          mt-s40
          flex
          max-w-7xl
          items-center
          justify-between
          px-s16
          lg:px-s32
        "
      >
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
            aria-label="Previous poojas"
            className="
              !h-11
              !w-11
              !rounded-full
              !p-0
              bg-black
              text-white
              hover:bg-gray-800
            "
          >
            <ChevronLeft size={18} />
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={() => scroll("next")}
            aria-label="Next poojas"
            className="
              !h-11
              !w-11
              !rounded-full
              !p-0
              bg-black
              text-white
              hover:bg-gray-800
            "
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
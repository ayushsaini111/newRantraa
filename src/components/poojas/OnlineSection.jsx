// src/components/poojas/OnlineSection.js
"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";
import PoojaCard from "./PoojaCard";

export default function OnlineSection({ data }) {
  const sliderRef = useRef(null);

  const scroll = (dir) => {
    if (!sliderRef.current) return;
    const amount = window.innerWidth < 640 ? 220 : 280;
    sliderRef.current.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="mt-0">
      <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-s104">
        {/* LEFT */}
        <div className="lg:col-span-3 px-4 sm:px-0">
          <h2 className="heading-h2 text-main">{data.title}</h2>
          <p className="body-default text-secondary mt-3 sm:mt-s24 max-w-[280px]">
            {data.description}
          </p>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-9 overflow-hidden lg:pl-s40">
          <div
            ref={sliderRef}
            className="flex gap-4 sm:gap-s40 overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory rounded-l-r32 pl-4 sm:pl-0 pr-10 sm:pr-40 lg:pr-64"
          >
            {data.cards.map((card) => (
              <div key={card.id} className="snap-start shrink-0 w-[220px] sm:w-[245px] xl:w-[280px]">
                <PoojaCard data={card} />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 sm:mt-s32 px-4 sm:px-0 sm:pr-s32">
            <Link href="/poojas/all?mode=Online">
              <Button variant="outline" className="rounded-full !text-sm sm:!text-base">
                View All
              </Button>
            </Link>

            <div className="flex gap-3 sm:gap-s16">
              <Button
                variant="ghost"
                onClick={() => scroll("prev")}
                aria-label="Previous"
                className="!h-9 !w-9 sm:!h-11 sm:!w-11 !rounded-full !p-0 bg-black text-white hover:bg-gray-800"
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="ghost"
                onClick={() => scroll("next")}
                aria-label="Next"
                className="!h-9 !w-9 sm:!h-11 sm:!w-11 !rounded-full !p-0 bg-black text-white hover:bg-gray-800"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
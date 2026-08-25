// src/components/poojas/OnlineSection.js
"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PoojaCard from "./PoojaCard";

export default function OnlineSection({ data }) {
  const sliderRef = useRef(null);

  const scroll = (dir) => {
    if (!sliderRef.current) return;
    const amount = window.innerWidth < 640 ? 240 : window.innerWidth < 1024 ? 280 : 320;
    sliderRef.current.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="w-full overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-s32 sm:gap-s40 lg:gap-s64 lg:px-0">
        {/* LEFT */}
        <div className=" pl-s16 lg:col-span-3">
          <h2 className="heading-h3 sm:heading-h2 text-main">{data.title}</h2>
          <p className="body-small sm:body-default text-secondary mt-s16 sm:mt-s24 max-w-[280px]">
            {data.description}
          </p>
        </div>

        {/* RIGHT */}
        <div className="  lg:col-span-9 overflow-hidden lg:pl-s40">
          <div
            ref={sliderRef}
            className="flex gap-s16 rounded-r24 sm:gap-s24 lg:gap-s32 overflow-x-auto hide-scrollbar scroll-smooth snap-x snap-mandatory pl-s16 sm:pl-0 pr-s40 sm:pr-s64 lg:pr-s80"
          >
            {data.cards.map((card) => (
              <div key={card.id} className="snap-start pl-s16 sm:pl-s24 shrink-0 w-[220px] sm:w-[245px] xl:w-[280px]">
                <PoojaCard data={card} />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-s24 sm:mt-s32 px-s16 ml-s16 sm:px-0 lg:pr-s32">
            <Link href="/poojas/all?mode=Online">
              <button className="px-s24 sm:px-s32 py-s8 sm:py-s8 rounded-r40 body-small sm:body-default font-medium bg-background text-main border border-secondary-dark hover:bg-primary-main/10 hover:border-primary-main/20 transition-all">
                View All
              </button>
            </Link>

            <div className="flex gap-s8 sm:gap-s16">
              <button
                onClick={() => scroll("prev")}
                aria-label="Previous"
                className="w-s40 h-s40 sm:w-s48 sm:h-s48 rounded-r40 flex items-center justify-center bg-main text-background hover:bg-main/80 transition-all"
              >
                <ChevronLeft size={18} className="sm:w-s24 sm:h-s24" />
              </button>
              <button
                onClick={() => scroll("next")}
                aria-label="Next"
                className="w-s40 h-s40 sm:w-s48 sm:h-s48 rounded-r40 flex items-center justify-center bg-main text-background hover:bg-main/80 transition-all"
              >
                <ChevronRight size={18} className="sm:w-s24 sm:h-s24" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
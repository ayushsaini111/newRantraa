// src/components/poojas/OnsiteSection.js
"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import PoojaCard from "./PoojaCard";

export default function OnsiteSection({ data }) {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (!sliderRef.current) return;
    const amount = window.innerWidth < 640 ? 240 : window.innerWidth < 1024 ? 280 : 320;
    sliderRef.current.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full overflow-hidden">
      {/* TOP CONTENT */}
      <div className="mx-auto max-w-7xl px-s16 sm:px-s24 lg:px-s16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-s32 sm:gap-s40 lg:gap-s64">
          {/* Left */}
          <div className="lg:col-span-4">
            <h2 className="heading-h3 sm:heading-h2 text-main">
              {data?.title}
            </h2>

            <div className="mt-s24 sm:mt-s32 lg:mt-s40">
              {data?.cards?.[0] && (
                <PoojaCard data={data.cards[0]} />
              )}
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-start lg:items-end lg:col-span-8">
            <p className="body-small sm:body-default max-w-md text-secondary">
              {data?.description}
            </p>

            <div className="mt-s32 sm:mt-s48 lg:mt-s64 flex max-w-md flex-col gap-s16 sm:gap-s24">
              <div className="flex w-s48 h-s48 sm:w-s56 sm:h-s56 lg:w-s64 lg:h-s64 items-center justify-center rounded-full bg-primary-main">
                <ShieldCheck size={24} className="sm:w-s32 sm:h-s32 text-secondary-dark" />
              </div>

              <h3 className="heading-h5 sm:heading-h4 text-main">
                {data?.feature?.title}
              </h3>

              <p className="body-small sm:body-default lg:body-large text-secondary">
                {data?.feature?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HORIZONTAL SLIDER */}
      <div className="mt-s32 sm:mt-s40 lg:mt-s48 w-full overflow-hidden">
        <div
          ref={sliderRef}
          className="flex gap-s16   sm:gap-s24 lg:gap-s32 overflow-x-auto scroll-smooth hide-scrollbar pl-s16 sm:pl-s24 lg:pl-[max(16px,calc((100vw-1280px)/2))] pr-s16 sm:pr-s24 lg:pr-s32"
        >
          {data?.cards?.slice(1).map((item) => (
            <div
              key={item.id}
              className="w-[220px] shrink-0 sm:w-[245px] xl:w-[280px]"
            >
              <PoojaCard data={item} />
            </div>
          ))}

          {/* Extra space at right */}
          <div className="w-s40 shrink-0 sm:w-s64 lg:w-s104" />
        </div>
      </div>

      {/* BOTTOM CONTROLS */}
      <div className="mx-auto mt-s24 sm:mt-s32 lg:mt-s40 flex max-w-7xl items-center justify-between px-s16 sm:px-s24 lg:px-s32">
        <Link href="/poojas/all?mode=On-site">
          <button className="px-s24 sm:px-s32 py-s8 sm:py-s8 rounded-r40 body-small sm:body-default font-medium bg-background text-main border border-secondary-dark hover:bg-primary-main/10 hover:border-primary-main/20 transition-all">
            View All
          </button>
        </Link>

        <div className="flex gap-s8 sm:gap-s16">
          <button
            onClick={() => scroll("prev")}
            aria-label="Previous poojas"
            className="w-s40 h-s40 sm:w-s48 sm:h-s48 rounded-r40 flex items-center justify-center bg-main text-background hover:bg-main/80 transition-all"
          >
            <ChevronLeft size={18} className="sm:w-s24 sm:h-s24" />
          </button>

          <button
            onClick={() => scroll("next")}
            aria-label="Next poojas"
            className="w-s40 h-s40 sm:w-s48 sm:h-s48 rounded-r40 flex items-center justify-center bg-main text-background hover:bg-main/80 transition-all"
          >
            <ChevronRight size={18} className="sm:w-s24 sm:h-s24" />
          </button>
        </div>
      </div>
    </section>
  );
}
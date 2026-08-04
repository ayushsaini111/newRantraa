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

    sliderRef.current.scrollBy({
      left: dir === "next" ? 280 : -280,
      behavior: "smooth",
    });
  };

  return (
    <section className="mt-s104">
      <div className="grid lg:grid-cols-12 gap-s104">
        {/* LEFT */}

        <div className="lg:col-span-3">
          <h2 className="heading-h2 text-main">{data.title}</h2>

          <p className="body-default text-secondary mt-s24 max-w-[280px]">
            {data.description}
          </p>
        </div>

        {/* RIGHT */}

        <div className="lg:col-span-9 overflow-hidden pl-s40">
          <div
            ref={sliderRef}
            className="
              flex
              gap-s24
              overflow-x-auto
              hide-scrollbar
              scroll-smooth
              rounded-l-r32
              pr-40
              lg:pr-64
            "
          >
            {data.cards.map((card) => (
              <PoojaCard
                key={card.id}
                data={card}
              />
            ))}
          </div>

          {/* Bottom */}

          <div className="flex items-center justify-between mt-s32 pr-s32">
            <Link href="/poojas/all?mode=Online">
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
        </div>
      </div>
    </section>
  );
}
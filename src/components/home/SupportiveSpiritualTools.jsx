"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { ALL_PRODUCTS } from "@/data/products";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/products/ProductCard";

export default function SupportiveSpiritualTools() {
  const router = useRouter();
  const sliderRef = useRef(null);

  const products = ALL_PRODUCTS.slice(0, 10);

  const scroll = (direction) => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-background py-s80 lg:py-s104">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-s16 lg:px-0">
        <div className="mb-s56 flex items-center justify-between gap-s24">
          <h2 className="heading-h2 text-main">
            Supportive Spiritual Tools
          </h2>

          <Button
            onClick={() => router.push("/allproducts")}
            className="shrink-0"
          >
            Pre-Book Pooja
          </Button>
        </div>
      </div>

      {/* Full-width horizontal products */}
      <div className="w-full overflow-hidden">
        <div
          ref={sliderRef}
          className="
            flex
            gap-s24
            overflow-x-auto
            scroll-smooth
            scrollbar-hide
            pl-s16
            lg:pl-[max(16px,calc((100vw-1280px)/2))]
            pr-s16
            lg:pr-s32
          "
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[230px] shrink-0 sm:w-[245px] xl:w-[300px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mx-auto mt-s32 flex max-w-7xl justify-end gap-s16 px-s16 lg:px-s32">
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Previous products"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-primary-main
            text-white
            transition
            hover:scale-105
            hover:opacity-90
          "
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Next products"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-primary-main
            text-white
            transition
            hover:scale-105
            hover:opacity-90
          "
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
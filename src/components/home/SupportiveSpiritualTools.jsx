// src/components/home/SupportiveSpiritualTools.jsx
"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { useProducts } from "@/hooks/useProducts";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/products/ProductCard";

// ─── Skeleton Card for Loading State ──────────────────────────────
function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-r24 bg-white border border-[#E8DED5] animate-pulse">
      {/* Image skeleton */}
      <div className="h-[270px] bg-[#F6F1EB]" />

      {/* Content skeleton */}
      <div className="p-s16 flex flex-col gap-s8">
        <div className="h-4 bg-[#F6F1EB] rounded w-3/4" />
        <div className="h-3 bg-[#F6F1EB] rounded w-1/2" />
        <div className="h-3 bg-[#F6F1EB] rounded w-1/3" />

        <div className="flex items-center justify-between mt-s8">
          <div className="h-4 bg-[#F6F1EB] rounded w-16" />
          <div className="h-9 bg-[#F6F1EB] rounded-r16 w-16" />
        </div>
      </div>
    </div>
  );
}

export default function SupportiveSpiritualTools() {
  const router = useRouter();
  const sliderRef = useRef(null);

  // ── Fetch products from DB ─────────────────────────────────────
  // Fetch popular products, limit to 10 for the slider
  const { data, isLoading, error } = useProducts({
    sort: "popularity",
    limit: 10,
  });

  const products = data?.products || [];

  const scroll = (direction) => {
    if (!sliderRef.current) return;

    sliderRef.current.scrollBy({
      left: direction === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  // Don't render section at all if error or no products after loading
  if (!isLoading && (error || products.length === 0)) {
    return null;
  }

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
            view all
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
          {isLoading
            ? // ── Loading skeletons ──────────────────────────────
              [...Array(5)].map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="w-[230px] shrink-0 sm:w-[245px] xl:w-[300px]"
                >
                  <ProductCardSkeleton />
                </div>
              ))
            : // ── Real products from DB ──────────────────────────
              products.map((product) => (
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
          disabled={isLoading}
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
            disabled:opacity-40
          "
        >
          <ChevronLeft size={20} />
        </button>

        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Next products"
          disabled={isLoading}
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
            disabled:opacity-40
          "
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
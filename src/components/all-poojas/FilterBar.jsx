"use client";

import { useEffect, useMemo, useState } from "react";
import { RotateCcw, X } from "lucide-react";
import Button from "@/components/ui/Button";
import CustomDropdown from "./CustomDropdown";

const MODES = ["All", "Online", "On-site"];

const SORTS = [
  { label: "Popular", value: "popular" },
  { label: "Highest Rated", value: "rating" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export default function FilterBar({
  mode,
  setMode,
  sort,
  setSort,
  search,
  setSearch,
  total,
  totalData,
  clearFilters,
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeFilters = useMemo(() => {
    const filters = [];

    if (search.trim()) {
      filters.push({
        key: "search",
        label: search,
      });
    }

    if (mode !== "All") {
      filters.push({
        key: "mode",
        label: mode,
      });
    }

    if (sort !== "popular") {
      filters.push({
        key: "sort",
        label:
          SORTS.find((i) => i.value === sort)?.label ||
          sort,
      });
    }

    return filters;
  }, [search, mode, sort]);

  function removeFilter(key) {
    switch (key) {
      case "search":
        setSearch("");
        break;

      case "mode":
        setMode("All");
        break;

      case "sort":
        setSort("popular");
        break;
    }
  }

  return (
    <div
      className={`
        sticky
        top-0
        z-30
        bg-background/90
        backdrop-blur-xl
        border-y
        border-black/5
        py-s24
        transition-all
        duration-300
        ${scrolled ? "shadow-lg" : ""}
      `}
    >
      {/* Header */}

      <div className="flex flex-col gap-s24 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h3 className="heading-h5">
            Showing {total} of {totalData} Poojas
          </h3>

          <p className="caption text-secondary mt-1">
            {activeFilters.length} filter
            {activeFilters.length !== 1 && "s"} applied
          </p>
        </div>

        <div className="flex items-center gap-s16">
          <CustomDropdown
            value={sort}
            onChange={setSort}
            options={SORTS}
          />

          {activeFilters.length > 0 && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="!rounded-full"
            >
              <RotateCcw
                size={16}
                className="mr-2"
              />

              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Mode Filter */}

      <div className="mt-s24 overflow-x-auto scrollbar-hide">
        <div className="flex gap-s8 min-w-max">

          {MODES.map((item) => {
            const active = mode === item;

            return (
              <Button
                key={item}
                onClick={() => setMode(item)}
                variant={active ? "primary" : "outline"}
                className="!rounded-full"
              >
                {item}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Active Chips */}

      {activeFilters.length > 0 && (
        <div className="mt-s24 flex flex-wrap gap-s12">

          {activeFilters.map((item) => (
            <button
              key={item.key}
              onClick={() => removeFilter(item.key)}
              className="
                flex
                items-center
                gap-2
                rounded-full
                bg-primary-main/10
                px-4
                py-2
                body-small
                transition
                hover:bg-primary-main
                hover:text-white
              "
            >
              {item.label}

              <X size={14} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
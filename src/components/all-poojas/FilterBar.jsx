"use client";

import { useEffect, useMemo, useRef } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";

const MODES = ["All", "Online", "On-site"];

const REMEDIES = [
  { label: "Shiv ji Pooja", value: "shiv-ji-pooja" },
  { label: "Wealth & Prosperity", value: "wealth-prosperity" },
  { label: "Home & Family", value: "home-family" },
  { label: "Planetary Remedies", value: "planetary-remedies" },
  { label: "Career & Business", value: "career-business" },
  { label: "Love & Marriage", value: "love-marriage" },
  { label: "Health & Protection", value: "health-protection" },
  { label: "Vastu Shanti", value: "vastu-shanti" },
];

export default function FilterBar({
  mode,
  setMode,
  filter,
  setFilter,
  search,
  setSearch,
  total,
  totalData,
  clearFilters,
}) {
  const filterRefs = useRef({});

  /* Scroll selected filter into horizontal view */
  useEffect(() => {
    if (filter === "All") return;

    const element = filterRefs.current[filter];

    if (element) {
      requestAnimationFrame(() => {
        element.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      });
    }
  }, [filter]);

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

    if (filter !== "All") {
      filters.push({
        key: "filter",
        label:
          REMEDIES.find(
            (item) => item.value === filter
          )?.label || filter,
      });
    }

    return filters;
  }, [search, mode, filter]);

  function removeFilter(key) {
    if (key === "search") setSearch("");
    if (key === "mode") setMode("All");
    if (key === "filter") setFilter("All");
  }

  return (
    <div
      className="
       
    
        px-s6
       
      "
    >
      {/* Header */}
      <div className="flex  gap-s6  items-center justify-between">
        <div>
          {/* <h3 className="heading-h5">
            Showing {total} of {totalData} Poojas
          </h3> */}

          <p className="caption mt-1 text-secondary">
            {activeFilters.length} filter
            {activeFilters.length !== 1 && "s"} applied
          </p>
        </div>

        {/* Mode */}
        <div className="flex shrink-0 gap-s8">
          {MODES.map((item) => {
            const active = mode === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`
    px-s16 py-s8 rounded-r40
    body-small font-medium transition-all
    ${active
                    ? "bg-primary-main text-background hover:bg-primary-light"
                    : "bg-background text-main border border-secondary-dark hover:bg-primary-main/10 hover:border-primary-main/20"
                  }
  `}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Horizontal Remedy Filters */}
      <div
        className="
          mt-s8
          overflow-x-auto
          overflow-y-hidden
          hide-scrollbar
          scroll-smooth
        "
      >
        <div className="flex min-w-max gap-s8 pr-s24">
          <div ref={(el) => (filterRefs.current.All = el)}>
            <button

              onClick={() => setFilter("All")}
              className={`
    px-s16 py-s8 rounded-r40
    body-small font-medium transition-all
    ${filter === "All"
                  ? "bg-primary-main text-background hover:bg-primary-light"
                  : "bg-background text-main border border-secondary-dark hover:bg-primary-main/10 hover:border-primary-main/20"
                }
  `}
            >
              All
            </button>
          </div>

          {REMEDIES.map((item) => {
            const active = filter === item.value;

            return (
              <div
                key={item.value}
                ref={(el) => {
                  filterRefs.current[item.value] = el;
                }}
                className="shrink-0"
              >
                <button

                  onClick={() => setFilter(item.value)}
                  className={`
    px-s16 py-s8 rounded-r40
    body-small font-medium transition-all
    ${active
                      ? "bg-primary-main text-background hover:bg-primary-light"
                      : "bg-background text-main border border-secondary-dark hover:bg-primary-main/10 hover:border-primary-main/20"
                    }
  `}
                >
                  {item.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mt-s8 flex flex-wrap gap-s8">
          {activeFilters.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => removeFilter(item.key)}
              className="
                flex
                items-center
                gap-2
                rounded-full
                bg-primary-main/10
                px-s16
                py-s8
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
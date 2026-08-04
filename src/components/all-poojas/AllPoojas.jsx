"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import PoojaGrid from "./PoojaGrid";

import {
  ONLINE_POOJAS,
  ONSITE_POOJAS,
} from "@/data/poojas";

export default function AllPoojas() {
    const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState(
  searchParams.get("mode") || "All"
);
useEffect(() => {
  const modeParam = searchParams.get("mode");

  if (modeParam) {
    setMode(modeParam);
  } else {
    setMode("All");
  }
}, [searchParams]);
  const [sort, setSort] = useState("popular");

  const deferredSearch = useDeferredValue(search);

  const allPoojas = useMemo(
    () => [
      ...ONLINE_POOJAS.cards,
      ...ONSITE_POOJAS.cards,
    ],
    []
  );

  const filteredPoojas = useMemo(() => {
    let list = [...allPoojas];

    // Mode
    if (mode === "Online") {
      list = list.filter(
        (item) => item.mode === "Video Call"
      );
    }

    if (mode === "On-site") {
      list = list.filter(
        (item) => item.mode === "At Home"
      );
    }

    // Search
    const keyword = deferredSearch.trim().toLowerCase();

    if (keyword) {
      list = list.filter((item) => {
        return (
          item.title.toLowerCase().includes(keyword) ||
          item.shortDescription
            .toLowerCase()
            .includes(keyword) ||
          item.description
            .toLowerCase()
            .includes(keyword) ||
          item.mode.toLowerCase().includes(keyword) ||
          item.language.some((lang) =>
            lang.toLowerCase().includes(keyword)
          )
        );
      });
    }

    // Sort
    switch (sort) {
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;

      case "price-asc":
        list.sort(
          (a, b) => a.offerPrice - b.offerPrice
        );
        break;

      case "price-desc":
        list.sort(
          (a, b) => b.offerPrice - a.offerPrice
        );
        break;

      default:
        list.sort((a, b) => {
          if (a.popular === b.popular) return 0;
          return a.popular ? -1 : 1;
        });
    }

    return list;
  }, [
    allPoojas,
    deferredSearch,
    mode,
    sort,
  ]);

  function clearFilters() {
    setSearch("");
    setMode("All");
    setSort("popular");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8">
      <SearchBar
        value={search}
        onChange={setSearch}
        data={allPoojas}
      />

      <div className="mt-s32">
        <FilterBar
          mode={mode}
          setMode={setMode}
          sort={sort}
          setSort={setSort}
          total={filteredPoojas.length}
          search={search}
          clearFilters={clearFilters}
        />
      </div>

      <PoojaGrid
        poojas={filteredPoojas}
      />
    </div>
  );
}
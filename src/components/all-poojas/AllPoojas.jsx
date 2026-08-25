"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import SearchBar from "./SearchBar";
import FilterBar from "./FilterBar";
import PoojaGrid from "./PoojaGrid";

const REMEDY_FILTERS = [
  "shiv-ji-pooja",
  "wealth-prosperity",
  "home-family",
  "planetary-remedies",
  "career-business",
  "love-marriage",
  "health-protection",
  "vastu-shanti",
];

export default function AllPoojas() {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [mode, setMode] = useState(
    searchParams.get("mode") || "All"
  );
  const [filter, setFilter] = useState(
    searchParams.get("filter") || "All"
  );

  const [poojas, setPoojas] = useState([]);
  const [loading, setLoading] = useState(true);

  const deferredSearch = useDeferredValue(search);

  /* ---------------- Fetch Poojas ---------------- */

  useEffect(() => {
    let cancelled = false;

    async function fetchPoojas() {
      try {
        setLoading(true);

        const res = await fetch("/backend/poojas", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch poojas");
        }

        const data = await res.json();

        if (!cancelled) {
          setPoojas(
            Array.isArray(data)
              ? data
              : data?.poojas || []
          );
        }
      } catch (error) {
        console.error("Fetch poojas error:", error);

        if (!cancelled) {
          setPoojas([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPoojas();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------------- URL Filters ---------------- */

  useEffect(() => {
    setMode(searchParams.get("mode") || "All");
    setFilter(searchParams.get("filter") || "All");
  }, [searchParams]);

  /* ---------------- Filter ---------------- */

  const filteredPoojas = useMemo(() => {
    let list = [...poojas];

    /* Mode */
    if (mode === "Online") {
      list = list.filter(
        (item) =>
          item.mode === "Video Call" ||
          item.category === "online"
      );
    }

    if (mode === "On-site") {
      list = list.filter(
        (item) =>
          item.mode === "At Home" ||
          item.category === "onsite"
      );
    }

    /* Remedy filter */
    if (
      filter !== "All" &&
      REMEDY_FILTERS.includes(filter)
    ) {
      list = list.filter(
        (item) => item.filter === filter
      );
    }

    /* Search */
    const keyword = deferredSearch
      .trim()
      .toLowerCase();

    if (keyword) {
      list = list.filter((item) => {
        const title =
          item.title?.toLowerCase() || "";

        const shortDescription =
          (
            item.short_description ||
            item.shortDescription ||
            ""
          ).toLowerCase();

        const description =
          item.description?.toLowerCase() || "";

        const itemMode =
          item.mode?.toLowerCase() || "";

        return (
          title.includes(keyword) ||
          shortDescription.includes(keyword) ||
          description.includes(keyword) ||
          itemMode.includes(keyword)
        );
      });
    }

    return list;
  }, [
    poojas,
    mode,
    filter,
    deferredSearch,
  ]);

  function clearFilters() {
    setSearch("");
    setMode("All");
    setFilter("All");
  }

  return (
    <div className="mx-auto max-w-7xl lg:px-s32">

      <SearchBar
        value={search}
        onChange={setSearch}
        data={poojas}
      />

      <div className="mt-s16">
        <FilterBar
          mode={mode}
          setMode={setMode}
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          total={filteredPoojas.length}
          totalData={poojas.length}
          clearFilters={clearFilters}
        />
      </div>

      {loading ? (
        <div className="py-s80 text-center">
          <p className="body-default text-secondary">
            Loading poojas...
          </p>
        </div>
      ) : (
        <PoojaGrid poojas={filteredPoojas} />
      )}
    </div>
  );
}
// src/components/products/ProductsHeaderClient.jsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Search, SlidersHorizontal, X, Loader2 } from "lucide-react";

export default function ProductsHeaderClient({
  title,
  totalCount = 0,
  currentCategory = "All",
  currentSearch = "",
  currentSort = "popularity",
  currentTags = "",
  categories = [],
  allTags = [],
  searchPlaceholder = "Search products...",
  searchEndpoint = "/backend/products/search",
  enableSuggestions = true,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const boxRef = useRef(null);

  const tagList = currentTags ? currentTags.split(",").filter(Boolean) : [];
  const hasActiveFilters = currentCategory !== "All" || currentSearch || currentTags;

  function updateParam(key, value, resetPage = true) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "All" || value === "popularity") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    if (resetPage) params.delete("page");
    router.push(`?${params.toString()}`);
  }

  // ── Debounced search-as-you-type with image suggestions ──────────
  useEffect(() => {
    if (!enableSuggestions || searchInput.length < 2) {
      setSuggestions([]);
      return;
    }
    setSuggestLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${searchEndpoint}?query=${encodeURIComponent(searchInput)}`);
        const data = await res.json();
        setSuggestions(data?.results || []);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, enableSuggestions, searchEndpoint]);

  // Close suggestions on outside click
  useEffect(() => {
    function handleClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const submitSearch = (value) => {
    updateParam("search", value);
    setShowSuggestions(false);
  };

  const handleTagToggle = (tag) => {
    const newTags = tagList.includes(tag)
      ? tagList.filter((t) => t !== tag)
      : [...tagList, tag];
    updateParam("tags", newTags.join(","));
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    router.push(`?${params.toString()}`);
  };

  return (
    <header className="flex flex-col gap-s16 sm:gap-s24 px-s16 pt-s16 lg:px-s32 lg:pt-s24">

      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-s60 h-s60 rounded-full flex items-center justify-center hover:bg-secondary-main/30 transition-colors"
        >
          <ArrowLeft size={22} className="text-main" />
        </button>

        <div className="text-center">
          <h1 className="heading-h3 lg:text-[40px] text-main">{title}</h1>
          {totalCount > 0 && (
            <p className="body-small text-secondary mt-1">{totalCount} available</p>
          )}
        </div>

        <div className="w-s60 h-s60" />
      </div>

      {/* SEARCH BAR + SUGGESTIONS */}
      <div className="flex gap-s8 sm:gap-s16 relative" ref={boxRef}>
        <div className="flex-1 h-s64 lg:h-s56 rounded-full border border-secondary-dark px-s16 flex items-center gap-s8 focus-within:border-primary-main">
          <Search size={18} className="text-secondary shrink-0" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => e.key === "Enter" && submitSearch(searchInput)}
            className="flex-1 bg-transparent outline-none body-default placeholder:text-secondary"
          />
          {suggestLoading && <Loader2 size={16} className="animate-spin text-secondary shrink-0" />}
          {searchInput && !suggestLoading && (
            <button
              onClick={() => {
                setSearchInput("");
                submitSearch("");
              }}
              className="p-1 hover:bg-secondary-main/40 rounded-full transition-colors shrink-0"
            >
              <X size={14} className="text-secondary" />
            </button>
          )}
        </div>

        {categories.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-s56 h-s56 lg:w-s56 lg:h-s56 rounded-full border flex items-center justify-center transition-all shrink-0 ${
              showFilters || hasActiveFilters
                ? "bg-primary-main border-primary-main"
                : "border-secondary-dark bg-secondary-skin hover:bg-secondary-main/40"
            }`}
          >
            <SlidersHorizontal size={18} className={showFilters || hasActiveFilters ? "text-background" : "text-main"} />
          </button>
        )}

        {/* SUGGESTIONS DROPDOWN — with images */}
        {enableSuggestions && showSuggestions && searchInput.length >= 2 && (
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 lg:right-[calc(3.5rem+16px)] bg-background border border-secondary-dark rounded-r16 shadow-lg z-50 max-h-[360px] overflow-y-auto">
            {suggestions.length === 0 && !suggestLoading ? (
              <p className="body-small text-secondary text-center py-s24">No results found</p>
            ) : (
              suggestions.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(`/allproducts/${item.id}`)}
                  className="w-full flex items-center gap-s16 p-s16 hover:bg-secondary-main/20 transition-colors text-left border-b border-secondary-dark last:border-0"
                >
                  <div className="relative w-14 h-14 rounded-r8 overflow-hidden bg-secondary-main/20 shrink-0">
                    {item.image && (
                      <Image src={item.image} alt={item.title} fill className="object-cover" sizes="56px" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="body-default font-medium text-main truncate">{item.title}</p>
                    <p className="caption text-secondary">{item.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="body-default font-semibold text-primary-main">₹{item.price}</p>
                    {item.originalPrice && (
                      <p className="caption text-secondary line-through">₹{item.originalPrice}</p>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* ACTIVE FILTERS */}
      {hasActiveFilters && (
        <div className="flex items-center gap-s8 flex-wrap">
          <span className="body-small text-secondary">Active filters:</span>
          {currentSearch && (
            <FilterChip label={`"${currentSearch}"`} onRemove={() => updateParam("search", "")} />
          )}
          {currentCategory !== "All" && (
            <FilterChip label={currentCategory} onRemove={() => updateParam("category", "All")} />
          )}
          {tagList.map((tag) => (
            <FilterChip key={tag} label={`#${tag}`} onRemove={() => handleTagToggle(tag)} />
          ))}
        </div>
      )}

      {/* CATEGORY TABS (always visible, e.g. Pandits page) */}
      {categories.length > 0 && (
        <div className="flex flex-nowrap gap-s8 overflow-x-auto pb-s6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateParam("category", cat)}
              className={`shrink-0 px-s16 py-s8 rounded-full body-small font-medium whitespace-nowrap transition-all ${
                currentCategory === cat
                  ? "bg-primary-main text-background"
                  : "bg-background border border-secondary-dark text-main hover:border-primary-light"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* TAG CHIPS */}
      {allTags.length > 0 && (
        <div className="flex flex-nowrap gap-s8 overflow-x-auto pb-s6">
          {allTags.map((tag) => {
            const active = tagList.includes(tag);

            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`shrink-0 px-s16 py-s6 rounded-full caption font-medium border transition-all ${
                  active
                    ? "bg-primary-main text-background border-primary-main"
                    : "bg-background text-secondary border-secondary-dark hover:border-primary-light"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}

      {showFilters && (
        <div className="bg-secondary-skin rounded-r16 p-s16 border border-secondary-dark">
          <div className="flex flex-col gap-s16">
            {/* Sort */}
            <div>
              <h4 className="body-small font-medium text-main mb-s8">
                Sort by
              </h4>

              <select
                value={currentSort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="w-full px-s16 py-s8 border border-secondary-dark rounded-r16 bg-background body-small focus:outline-none focus:border-primary-main"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-s8">
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 px-s16 py-s8 border border-secondary-dark rounded-r16 text-main font-medium hover:bg-background transition-colors"
              >
                Close
              </button>

              <button
                onClick={clearAllFilters}
                className="flex-1 px-s16 py-s8 bg-primary-main text-background rounded-r16 font-medium hover:bg-primary-light transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <div className="flex items-center gap-s6 px-s16 py-s8 bg-primary-main/10 rounded-full">
      <span className="body-small text-primary-main">{label}</span>
      <button onClick={onRemove} className="p-1 hover:bg-primary-main/20 rounded-full">
        <X size={12} className="text-primary-main" />
      </button>
    </div>
  );
}
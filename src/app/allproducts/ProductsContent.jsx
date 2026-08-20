// src/app/allproducts/ProductsContent.jsx  — replace your existing file
"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import ProductsHeader from "@/components/ProductsHeader";
import HeroSection    from "@/components/products/HeroSection";
import ProductsSection from "@/components/products/ProductsSection";

import { useProducts, useProductCategories } from "@/hooks/useProducts";

export default function ProductsContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  const [showFilters, setShowFilters] = useState(false);

  const currentCategory = searchParams.get("category") || "All";
  const currentSearch   = searchParams.get("search")   || "";
  const currentSort     = searchParams.get("sort")     || "popularity";
  const currentTags     = searchParams.get("tags")     || "";
  const currentPage     = parseInt(searchParams.get("page") || "1");

  // ── Fetch from DB ─────────────────────────────────────────────────
  const {
    data,
    isLoading,
    error,
  } = useProducts({
    category: currentCategory,
    search:   currentSearch,
    sort:     currentSort,
    tags:     currentTags,
    page:     currentPage,
  });

  const { data: categoriesData } = useProductCategories();

  const products   = data?.products        || [];
  const pagination = data?.pagination      || {};
  const allTags    = data?.meta?.allTags   || [];
  const categories = categoriesData?.categories?.map(c => c.name) || [
    "All","Rudraksha","Gemstones","Bracelets","Idols","Spiritual Items"
  ];

  // ── Helpers ───────────────────────────────────────────────────────
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

  const handleCategoryChange = (cat) => updateParam("category", cat);
  const handleSortChange     = (s)   => updateParam("sort", s);
  const handleTagToggle      = (tag) => {
    const tagList = currentTags ? currentTags.split(",").filter(Boolean) : [];
    const newTags = tagList.includes(tag)
      ? tagList.filter(t => t !== tag)
      : [...tagList, tag];
    updateParam("tags", newTags.join(","));
  };

  const clearAllFilters = () => router.push("/allproducts");

  const hasActiveFilters = currentCategory !== "All" || currentSearch || currentTags;

  return (
    <main className="min-h-screen mt-s104 max-w-7xl flex mx-auto flex-col gap-s32 pb-s40">
      <ProductsHeader
        title="All Products"
        subtitle={
          isLoading
            ? "Loading..."
            : `${pagination.total || products.length} products available`
        }
        showSubtitle
        searchPlaceholder="Search products..."
        searchValue={currentSearch}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        hasActiveFilters={hasActiveFilters}
        currentCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        currentSort={currentSort}
        onSortChange={handleSortChange}
        onClearAll={clearAllFilters}
        // Tag filter props
        allTags={allTags}
        currentTags={currentTags ? currentTags.split(",") : []}
        onTagToggle={handleTagToggle}
      />

      <HeroSection />

      {/* Tag Filter Chips */}
      {allTags.length > 0 && (
        <div className="px-s16 flex flex-wrap gap-s8">
          {allTags.map((tag) => {
            const active = currentTags?.split(",").includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`px-s16 py-s6 rounded-full text-xs font-medium border transition-all ${
                  active
                    ? "bg-primary-main text-white border-primary-main"
                    : "bg-white text-secondary border-[#E0D4E3] hover:border-primary-light"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}

      <ProductsSection
        products={products}
        isLoading={isLoading}
        error={error}
        currentCategory={currentCategory}
        currentSearch={currentSearch}
        onClearFilters={clearAllFilters}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={(p) => updateParam("page", String(p), false)}
      />
    </main>
  );
}
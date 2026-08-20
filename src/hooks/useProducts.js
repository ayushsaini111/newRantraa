// src/hooks/useProducts.js
"use client";

import { useQuery } from "@tanstack/react-query";

// ─── Fetch all products with filters ──────────────────────────────
export function useProducts({
  category = "All",
  search   = "",
  sort     = "popularity",
  tags     = "",
  page     = 1,
  limit    = 20,
} = {}) {
  return useQuery({
    queryKey: ["products", category, search, sort, tags, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category && category !== "All") params.append("category", category);
      if (search)  params.append("search",  search);
      if (sort)    params.append("sort",    sort);
      if (tags)    params.append("tags",    tags);
      params.append("page",  page);
      params.append("limit", limit);

      const res = await fetch(`/backend/products?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    keepPreviousData: true,
  });
}

// ─── Fetch single product ──────────────────────────────────────────
export function useProduct(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) throw new Error("Product ID is required");
      
      const res = await fetch(`/backend/products/${id}`); // ✅ Make sure this matches your route
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Product not found");
      }
      
      const data = await res.json();
      return data.product; // ✅ Return just the product, not the whole response
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Fetch categories ──────────────────────────────────────────────
export function useProductCategories() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const res = await fetch(`/backend/products/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
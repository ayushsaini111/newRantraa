// src/lib/api.js
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

async function apiFetch(path) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    next: { revalidate: 3600 }, // ISR cache — 1 hour
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`API error ${res.status} on ${path}`);
  }

  return res.json();
}

// GET /api/poojas?category=online|onsite  -> returns array directly
export async function getPoojasByCategory(category) {
  const data = await apiFetch(`/api/poojas?category=${category}`);
  return data || [];
}

// GET /api/poojas/:id -> returns pooja object directly
export async function getPoojaById(id) {
  return apiFetch(`/api/poojas/${id}`);
}

// GET /api/poojas/:id/content -> returns { success, content }
export async function getPoojaContent(id) {
  const data = await apiFetch(`/api/poojas/${id}/content`);
  return data?.content || null;
}

// GET /api/poojas/testimonials?poojaId=X -> returns { success, testimonials }
export async function getPoojaTestimonials(id) {
  const data = await apiFetch(`/api/poojas/testimonials?poojaId=${id}`);
  return data?.testimonials || [];
}

// Fetch all 3 pieces in parallel — single Promise.all, zero client waterfall
export async function getPoojaFullData(id) {
  const [pooja, content, testimonials] = await Promise.all([
    getPoojaById(id),
    getPoojaContent(id),
    getPoojaTestimonials(id),
  ]);

  return { pooja, content, testimonials };
}


// ── Products listing (server-side, cached per unique query) ──────────
export async function getProducts(params = {}) {
  const qs = new URLSearchParams();
  if (params.category && params.category !== "All") qs.set("category", params.category);
  if (params.search) qs.set("search", params.search);
  if (params.sort) qs.set("sort", params.sort);
  if (params.tags) qs.set("tags", params.tags);
  if (params.page) qs.set("page", params.page);

  const data = await apiFetch(`/api/products?${qs.toString()}`, { revalidate: 60 });
  return data || { products: [], pagination: {}, meta: { allTags: [] } };
}

export async function getProductCategories() {
  const data = await apiFetch(`/api/products/categories`, { revalidate: 3600 });
  return data?.categories || [];
}

export async function getProductById(id) {
  const data = await apiFetch(`/api/products/${id}`, { revalidate: 3600 });
  return data?.product || null;
}

// Related products — same category, excluding current
export async function getRelatedProducts(category, excludeId) {
  const data = await apiFetch(
    `/api/products?category=${encodeURIComponent(category)}&limit=4`,
    { revalidate: 3600 }
  );
  return (data?.products || []).filter((p) => p.id !== excludeId).slice(0, 4);
}
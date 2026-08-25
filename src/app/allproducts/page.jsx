// src/app/allproducts/page.jsx
import { getProducts, getProductCategories } from "@/lib/api";
import ProductsHeaderClient from "@/components/products/ProductsHeaderClient";
import ProductsSection from "@/components/products/ProductsSection";
import HeroSection from "@/components/products/HeroSection";

export const metadata = {
  title: "All Products | Rantraa",
  description: "Shop Rudraksha, Gemstones, Bracelets, Idols & Spiritual Items.",
};

export default async function AllProductsPage({ searchParams }) {
  const sp = await searchParams;

  const category = sp.category || "All";
  const search   = sp.search   || "";
  const sort     = sp.sort     || "popularity";
  const tags     = sp.tags     || "";
  const page     = parseInt(sp.page || "1");

  const [data, categoriesData] = await Promise.all([
    getProducts({ category, search, sort, tags, page }),
    getProductCategories(),
  ]);

  const products   = data.products || [];
  const pagination = data.pagination || {};
  const allTags    = data.meta?.allTags || [];
  const categories = categoriesData?.map((c) => c.name) || [
    "All", "Rudraksha", "Gemstones", "Bracelets", "Idols", "Spiritual Items",
  ];

  return (
    <main className="min-h-screen mt-s104 max-w-7xl flex mx-auto flex-col gap-s32 pb-s40">
      <ProductsHeaderClient
        title="All Products"
        totalCount={pagination.total ?? products.length}
        currentCategory={category}
        currentSearch={search}
        currentSort={sort}
        currentTags={tags}
        categories={categories}
        allTags={allTags}
      />

      <HeroSection />

      <ProductsSection
        products={products}
        currentCategory={category}
        pagination={pagination}
        currentPage={page}
      />
    </main>
  );
}
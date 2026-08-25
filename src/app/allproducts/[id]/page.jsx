// src/app/products/[id]/page.jsx
import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/lib/api";
import ProductDetailView from "@/components/products/detail/ProductDetailView";

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.title} | Rantraa`,
    description: product.shortDescription || product.description,
    openGraph: { images: product.image ? [product.image] : [] },
  };
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const related = await getRelatedProducts(product.category, product.id);

  return <ProductDetailView product={product} related={related} />;
}
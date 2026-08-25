// src/app/poojas/[id]/page.jsx
import { notFound } from "next/navigation";
import { getPoojaFullData, getPoojasByCategory } from "@/lib/api";
import PoojaDetailView from "@/components/poojas/detail/PoojaDetailView";

export const revalidate = 3600; // ISR

// Pre-build static pages for known poojas at deploy time
export async function generateStaticParams() {
  const [online, onsite] = await Promise.all([
    getPoojasByCategory("online"),
    getPoojasByCategory("onsite"),
  ]);
  const all = [...online, ...onsite];
  return all.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { pooja } = await getPoojaFullData(id);

  if (!pooja) return { title: "Pooja Not Found" };

  return {
    title: `${pooja.title} | Rantraa`,
    description: pooja.short_description,
    openGraph: {
      title: pooja.title,
      description: pooja.short_description,
      images: pooja.image ? [pooja.image] : [],
    },
  };
}

export default async function PoojaDetailPage({ params }) {
  const { id } = await params;

  const { pooja, content, testimonials } = await getPoojaFullData(id);

  if (!pooja) notFound();

  return (
    <PoojaDetailView pooja={pooja} content={content} testimonials={testimonials} />
  );
}
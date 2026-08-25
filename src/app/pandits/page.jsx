// frontend/src/app/pandits/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProductsHeader from "@/components/products/ProductsHeaderClient";
import PanditsClient from "@/components/Pandits/PanditsClient";

async function fetchPandits() {
  try {
    const res = await fetch("https://astro-nine-beige.vercel.app/api/pandits", {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Failed to fetch pandits:", res.status);
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching pandits:", error.message);
    return [];
  }
}

export default async function PanditsPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";
  const category = params?.category || "All";

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const allPandits = await fetchPandits();

  let pandits = allPandits.filter((p) => p.isAvailable !== false);

  if (category && category !== "All") {
    pandits = pandits.filter((p) => {
      const specs = Array.isArray(p.speciality)
        ? p.speciality
        : [p.speciality].filter(Boolean);
      return specs.some((s) =>
        String(s).toLowerCase().includes(category.toLowerCase())
      );
    });
  }

  if (search) {
    const q = search.toLowerCase();
    pandits = pandits.filter((p) => {
      const nameMatch = String(p.name || "").toLowerCase().includes(q);
      const specs = Array.isArray(p.speciality)
        ? p.speciality
        : [p.speciality].filter(Boolean);
      const specMatch = specs.some((s) =>
        String(s).toLowerCase().includes(q)
      );
      return nameMatch || specMatch;
    });
  }

  return (
    <main className="min-h-screen max-w-7xl mt-s80 mx-auto flex flex-col gap-s32 pb-[120px]">
      <ProductsHeader
        title="Pandits"
        totalCount={pandits.length}
        currentCategory={category}
        currentSearch={search}
        categories={["All", "Vedic", "Puja", "Astrology", "Vastu"]}
        allTags={[]}
        searchPlaceholder="Search pandit..."
        enableSuggestions={false}
      />

      <PanditsClient pandits={pandits} userId={userId} />
    </main>
  );
}
// frontend/src/app/pandits/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProductsHeader from "@/components/ProductsHeader";
import PanditsClient from "@/components/Pandits/PanditsClient";

// frontend/src/app/pandits/page.jsx
async function fetchPandits() {
  try {
    const res = await fetch("https://astro-nine-beige.vercel.app/api/pandits", {
      cache: "no-store",
    });
    
    console.log("Fetched pandits response status:", res.status);
    
    if (!res.ok) {
      console.error("Failed to fetch pandits:", res.status);
      return [];
    }
    
    const data = await res.json(); // ✅ Parse once
    console.log("Fetched pandits response:", data);
    return data; // ✅ Return the parsed data
    
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

  // ✅ Fetch from backend API (no direct Prisma in frontend)
  const allPandits = await fetchPandits();

  // ✅ Filter: only available
  let pandits = allPandits.filter((p) => p.isAvailable !== false);

  // ✅ Filter: category tab
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

  // ✅ Filter: search (name or speciality)
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
    <main className="min-h-screen max-w-7xl mx-auto flex flex-col gap-s32 pb-[120px]">
      <ProductsHeader
        title="Pandits"
        subtitle="Connect with verified and experienced pandits"
        showSubtitle={true}
        showTabs={true}
        tabs={["All", "Vedic", "Puja", "Astrology", "Vastu"]}
        activeTab={category}
        searchPlaceholder="Search pandit..."
        searchValue={search}
        currentParams={{ search, category }}
      />

      <PanditsClient pandits={pandits} userId={userId} />
    </main>
  );
}
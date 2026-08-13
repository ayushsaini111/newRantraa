import AstrologyToolsSection from "@/components/home/AstrologyToolsSection";
import CommunityOfferSection from "@/components/home/CommunityOfferSection";
import FaqSection from "@/components/home/FaqSection";
import Footer from "@/components/footer/Footer";
import FullImageSection from "@/components/home/FullImageSection";
import Hero from "@/components/home/Hero";
import PanditSection from "@/components/home/PanditSection";
import SpecialRemediesSection from "@/components/home/SpecialRemediesSection";
import SpiritualitySection from "@/components/home/SpiritualitySection";
import SupportiveSpiritualTools from "@/components/home/SupportiveSpiritualTools";
import UpcomingFestivals from "@/components/home/UpcomingFestivals";
import OnsiteSection from "@/components/poojas/OnsiteSection";

// ✅ Fix 1: Force dynamic rendering
export const dynamic = "force-dynamic";

async function getOnsitePoojas() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    const res = await fetch(`${baseUrl}/api/poojas?category=onsite`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching onsite poojas:", error);
    return [];
  }
}

export default async function Page() {
  const onsitePoojas = await getOnsitePoojas();

  const onsiteData = {
    title: "On-site",
    description:
      "If you want a hassle-free pooja at your home, book an on-site pooja. Our Pandit Ji will visit with complete pooja samagri and perform every ritual according to Vedic traditions.",
    feature: {
      title: "100% Hassle-Free",
      description:
        "No arrangements needed. Pandit Ji arrives with all required pooja samagri.",
    },
    cards: onsitePoojas,
  };

  return (
    <div>
      <Hero />
      <CommunityOfferSection />
      <PanditSection />
      <SpecialRemediesSection />
      <AstrologyToolsSection />
      <div className="mx-auto">
        <OnsiteSection data={onsiteData} />
      </div>
      <UpcomingFestivals />
      <SupportiveSpiritualTools />
      <FaqSection />
      <SpiritualitySection />
      <FullImageSection />
    </div>
  );
}
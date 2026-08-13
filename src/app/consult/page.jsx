// app/consult/page.jsx
import ConsultClient from "@/components/consult/ConsultClient";

export const metadata = {
  title: "Consult Expert | Rantraa",
  description: "Talk to verified spiritual experts",
};

async function fetchPandits() {
  try {
    const res = await fetch("https://astro-nine-beige.vercel.app/api/pandits", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.log("Error fetching pandits:", error.message);
    return [];
  }
}

export default async function ConsultPage() {
  const pandits = await fetchPandits();

  const balance = {
    hasFreeCall: true,
    freeSeconds: 300,
    totalSeconds: 300,
    availableSeconds: 300,
  };

  return (
    <ConsultClient
      pandits={pandits}
      balance={balance}
    />
  );
}
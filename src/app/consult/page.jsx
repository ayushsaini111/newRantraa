// app/consult/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ConsultClient from "@/components/consult/ConsultClient";
import { redirect } from "next/navigation";

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
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

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
      userId={session.user.id}
      userName={session.user.name || "User"}
      userImage={session.user.image}
    />
  );
}
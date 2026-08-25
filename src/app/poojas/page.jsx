// src/app/poojas/page.jsx
import { getPoojasByCategory } from "@/lib/api";
import PoojasSection from "@/components/poojas/PoojasSection";

export const revalidate = 3600; // ISR

export const metadata = {
  title: "Book Poojas | Rantraa",
  description: "Book Online and On-site Poojas with experienced Pandit Ji.",
};

export default async function PoojasPage() {
  const [onlinePoojas, onsitePoojas] = await Promise.all([
    getPoojasByCategory("online"),
    getPoojasByCategory("onsite"),
  ]);

  return (
    <main className="bg-white">
      <PoojasSection onlinePoojas={onlinePoojas} onsitePoojas={onsitePoojas} />
    </main>
  );
}
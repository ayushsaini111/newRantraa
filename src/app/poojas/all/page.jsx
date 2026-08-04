import AllPoojas from "@/components/all-poojas/AllPoojas";

export const metadata = {
  title: "All Poojas | Rantraa",
  description: "Explore all online and on-site poojas.",
};

export default function AllPoojasPage() {
  return (
    <main className="bg-background">
      <AllPoojas />
    </main>
  );
}
// frontend/src/app/plans/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PlansClient from "./PlansClient";

export default async function PlansPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  let plans = [];
  let status = null;

  try {
    // ✅ Fetch from backend API
    const res = await fetch("/backend/api/plans/list", {
      headers: {
        'x-user-id': userId || '',
      },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      plans = data.plans || [];
      status = data.status;
    } else {
      console.error("Failed to fetch plans:", res.status);
    }
  } catch (e) {
    console.error("PlansPage error:", e);
  }

  return <PlansClient plans={plans} status={status} userId={userId} />;
}
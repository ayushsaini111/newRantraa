// src/app/profile/orders/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import OrdersClient from "./OrdersClient";

export const metadata = {
  title: "Order History | Rantraa",
  description: "View all your orders, bookings and plans",
};

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

async function getInitialOrders(user) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/orders?filter=ALL&page=1&limit=10`, {
      headers: {
        "x-user-id": user.id,
        "x-user-email": user.email || "",
        "x-user-name": user.name || "",
      },
      cache: "no-store", // private, per-user data — always fresh, never cached
    });

    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Initial orders fetch error:", err);
    return null;
  }
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile/orders");
  }

  // ✅ Fetched server-side, before any HTML is sent — no client spinner on first load
  const initialData = await getInitialOrders(session.user);

  return (
    <OrdersClient
      userId={session.user.id}
      session={session}
      initialOrders={initialData?.orders || []}
      initialCounts={initialData?.counts || {}}
      initialPagination={initialData?.pagination || {}}
    />
  );
}
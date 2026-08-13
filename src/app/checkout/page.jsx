// src/app/checkout/page.jsx
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect as nextRedirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import CheckoutForm from "./CheckoutForm";

export default async function CheckoutPage({ searchParams }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    const { poojaId } = await searchParams;
    const target = poojaId ? `/checkout?poojaId=${poojaId}` : "/checkout";

    nextRedirect(`/login?redirect=${encodeURIComponent(target)}`);
  }

  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
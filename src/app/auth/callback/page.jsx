"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const res = await fetch("/api/auth/me");

      if (!res.ok) {
        router.replace("/login");
        return;
      }

      const user = await res.json();

      if (user.hasCompletedOnboarding) {
        router.replace("/");
      } else {
        router.replace("/auth/onboarding");
      }
    }

    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}
"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import useAuthStore from "@/store/authStore";

export default function AuthSync() {
  const { data, status } = useSession();

  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    if (status === "loading") return;

    hydrate(data?.user ?? null);
  }, [data, status, hydrate]);

  return null;
}
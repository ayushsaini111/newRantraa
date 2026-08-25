// frontend/src/app/profile/page.jsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileClient from "./ProfileClient";

export const metadata = {
  title: "My Profile | Rantraa",
  description: "Manage your personal information and account settings",
};

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

async function getInitialProfile(user) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/user/profile`, {
      headers: {
        "x-user-id": user.id,
        "x-user-email": user.email || "",
        "x-user-name": user.name || "",
      },
      cache: "no-store", // private per-user data
    });

    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Initial profile fetch error:", err);
    return null;
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  // ✅ Fetched server-side before HTML is sent — zero loading spinner on first paint
  const initialProfile = await getInitialProfile(session.user);

  return (
    <ProfileClient
      session={session}
      initialProfile={
        initialProfile || {
          name: session.user.name || "",
          email: session.user.email || "",
          image: session.user.image || null,
        }
      }
    />
  );
}
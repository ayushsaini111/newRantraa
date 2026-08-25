import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust to your actual authOptions path
import { redirect } from "next/navigation";
import CommunityClient from "./CommunityClient";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/community");

  const headers = {
    "x-user-id": session.user.id,
    "x-user-email": session.user.email ?? "",
    "x-user-name": session.user.name ?? "",
  };

  const [profileRes, communityRes] = await Promise.all([
    fetch(`${BACKEND_URL}/api/user/profile`, { headers, cache: "no-store" }),
    fetch(`${BACKEND_URL}/api/user/community`, { headers, cache: "no-store" }),
  ]);

  const profile = profileRes.ok ? await profileRes.json() : null;
  const community = communityRes.ok ? await communityRes.json() : null;

  return (
    <CommunityClient
      userId={session.user.id}
      userEmail={session.user.email}
      userName={session.user.name}
      initialPhone={profile?.phone ?? null}
      initialJoined={!!community?.joined}
    />
  );
}
// src/app/api/auth/me/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      phone: session.user.phone,
      image: session.user.image,
      isProfileCompleted: session.user.isProfileCompleted ?? false,
      hasCompletedOnboarding: session.user.hasCompletedOnboarding ?? false,
    });
  } catch (err) {
    console.error("❌ /api/auth/me error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
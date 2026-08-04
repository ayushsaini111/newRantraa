import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { name, dob, phone, token } = await req.json();

    if (!name?.trim() || !dob) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    let userId;

    // PATH A: New OTP user (no session yet, has phone + token)
    if (phone && token) {
      const verification = await prisma.oTPVerification.findFirst({
        where: {
          identifier: phone,
          otp: token,
          verified: true,
          expiresAt: { gt: new Date() },
        },
      });

      if (!verification) {
        return NextResponse.json(
          { error: "Session expired. Please login again." },
          { status: 401 }
        );
      }

      // Create user
      const user = await prisma.user.upsert({
        where: { phone },
        update: {
          name: name.trim(),
          dob: new Date(dob),
          hasCompletedOnboarding: true,
        },
        create: {
          phone,
          name: name.trim(),
          dob: new Date(dob),
          hasCompletedOnboarding: true,
          isVerified: true,
        },
      });

      userId = user.id;
    } else {
      // PATH B: Google user (has session, just updating profile)
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          name: name.trim(),
          dob: new Date(dob),
          hasCompletedOnboarding: true,
        },
      });

      userId = session.user.id;
    }

    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("Complete Onboarding Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
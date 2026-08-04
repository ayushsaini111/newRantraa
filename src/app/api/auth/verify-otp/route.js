import { NextResponse } from "next/server";
import crypto from "crypto";

import { prisma } from "@/lib/prisma";
import { verifyOTP } from "@/lib/twilio";

export async function POST(req) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        {
          error: "Phone number and OTP are required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return NextResponse.json(
        {
          error: "Invalid phone number.",
        },
        {
          status: 400,
        }
      );
    }

    if (otp.length !== 6) {
      return NextResponse.json(
        {
          error: "Invalid OTP.",
        },
        {
          status: 400,
        }
      );
    }

    // Verify with Twilio
    const verification = await verifyOTP(phone, otp);

    if (verification.status !== "approved") {
      return NextResponse.json(
        {
          error: "Incorrect OTP.",
        },
        {
          status: 400,
        }
      );
    }

    // Check existing user
    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });

    // Delete old verification tokens
    await prisma.oTPVerification.deleteMany({
      where: {
        identifier: phone,
      },
    });

    // Generate login token
    const verifiedToken = crypto.randomBytes(32).toString("hex");

    // Save temporary verification
    await prisma.oTPVerification.create({
      data: {
        identifier: phone,
        otp: verifiedToken,
        verified: true,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000),
        userId: user?.id,
      },
    });

    return NextResponse.json({
      success: true,
      verifiedToken,
      isNewUser: !user,
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "OTP verification failed.",
      },
      {
        status: 500,
      }
    );
  }
}
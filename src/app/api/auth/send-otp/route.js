import { NextResponse } from "next/server";
import { sendOTP } from "@/lib/twilio";

export async function POST(req) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        {
          error: "Phone number is required.",
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

    await sendOTP(phone);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to send OTP.",
      },
      {
        status: 500,
      }
    );
  }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import cloudinary, { deleteImageFromCloudinary } from "@/lib/cloudinary";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        dob: true,
        gender: true,
        houseNo: true,
        address: true,
        landmark: true,
        pinCode: true,
        provider: true,
        isProfileCompleted: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const dob = formData.get("dob");
    const gender = formData.get("gender");
    const houseNo = formData.get("houseNo");
    const address = formData.get("address");
    const landmark = formData.get("landmark");
    const pinCode = formData.get("pinCode");
    const imageFile = formData.get("image");

    // Get existing user data
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { image: true, provider: true, email: true, phone: true },
    });

    let imageUrl;

    if (imageFile && imageFile.size > 0) {
      // Validate file size (5MB)
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image size should be less than 5MB" },
          { status: 400 }
        );
      }

      // Delete old image if exists
      if (existingUser?.image) {
        await deleteImageFromCloudinary(existingUser.image);
      }

      // Upload new image
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

      const uploaded = await cloudinary.uploader.upload(base64, {
        folder: "rantraa/profiles",
        transformation: [{ width: 500, height: 500, crop: "fill", gravity: "face" }],
      });

      imageUrl = uploaded.secure_url;
    }

    // Prepare update data
    const updateData = {};

    if (name) updateData.name = name.trim();
    if (dob) updateData.dob = new Date(dob);
    if (gender) updateData.gender = gender;
    if (houseNo !== null) updateData.houseNo = houseNo;
    if (address !== null) updateData.address = address;
    if (landmark !== null) updateData.landmark = landmark;
    if (pinCode !== null) updateData.pinCode = pinCode;
    if (imageUrl) updateData.image = imageUrl;

    // Handle email updates (only if provider is PHONE)
    if (email && existingUser.provider === "PHONE") {
      // Check if email already exists for another user
      const emailExists = await prisma.user.findFirst({
        where: {
          email: email.toLowerCase().trim(),
          NOT: { id: session.user.id }
        }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }

      updateData.email = email.toLowerCase().trim();
    }

    // Handle phone updates (only if provider is GOOGLE)
    if (phone && existingUser.provider === "GOOGLE") {
      const cleanPhone = phone.replace(/\s/g, "");
      
      // Validate phone format
      if (!/^\d{10}$/.test(cleanPhone)) {
        return NextResponse.json(
          { error: "Invalid phone number format" },
          { status: 400 }
        );
      }

      // Check if phone already exists for another user
      const phoneExists = await prisma.user.findFirst({
        where: {
          phone: cleanPhone,
          NOT: { id: session.user.id }
        }
      });

      if (phoneExists) {
        return NextResponse.json(
          { error: "Phone number already in use" },
          { status: 400 }
        );
      }

      updateData.phone = cleanPhone;
    }

    // Update user
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
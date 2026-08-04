// src/app/api/proxy/[...path]/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

const OLD_API = "http://localhost:3001";

const PUBLIC_PATHS = [
  "auth/send-otp",
  "auth/sendotps",
  "auth/verify-otp",
  "auth/verifyotps",
  "auth/verify-session",
  "pandits",
];

async function handler(req, { params }) {
  const path = (await params).path.join("/");
  const isPublic = PUBLIC_PATHS.some(p => path.startsWith(p));

  let userId = null;
  let userEmail = null;
  let userName = null;

  if (path.startsWith("auth/onboarding")) {
    const session = await getServerSession(authOptions);
    userId = session?.user?.id ?? null;
    userEmail = session?.user?.email ?? null;
    userName = session?.user?.name ?? null;
  } else if (!isPublic) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    userId = session.user.id;
    userEmail = session.user.email;
    userName = session.user.name;
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.toString();
  const url = `${OLD_API}/api/${path}${query ? `?${query}` : ""}`;

  const isGet = req.method === "GET";
  let body = undefined;

  if (!isGet) {
    const json = await req.json().catch(() => ({}));
    body = JSON.stringify({
      ...json,
      ...(userId ? { userId, userEmail, userName } : {}),
    });
  }

  const res = await fetch(url, {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    body,
  });

  const data = await res.json().catch(() => ({}));
  console.log("Proxy:", req.method, path, "→", res.status, data);
  return NextResponse.json(data, { status: res.status });
}

// ✅ Named exports only — no default export
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
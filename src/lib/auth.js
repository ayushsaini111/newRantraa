// src/lib/auth.js (NEW project)
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const authOptions = {
  session: { strategy: "jwt" },

  pages: { signIn: "/login" },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      id: "otp-credentials",
      name: "OTP",
      credentials: {
        phone: {},
        token: {},
      },
      async authorize(credentials) {
        const { phone, token } = credentials ?? {};
        if (!phone || !token) return null;

        // ✅ Verify against old DB only
        const res = await fetch("http://localhost:3001/api/auth/verify-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, token }),
        });

        if (!res.ok) return null;
        const { user } = await res.json();
        if (!user) return null;

        // ✅ No new DB write — return directly from old DB
        return {
          id: user.id,
          phone: user.phone,
          email: user.email ?? null,
          name: user.name ?? null,
          image: user.profilePic ?? null,
          isProfileCompleted: user.isProfileCompleted ?? false,
          hasCompletedOnboarding: user.hasCompletedOnboarding ?? false,
        };
      },
    }),
  ],

  callbacks: {
  async signIn({ user, account }) {
  if (account.provider !== "google") return true;

  const res = await fetch("http://localhost:3001/api/auth/google-signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      name: user.name,
      image: user.image,
    }),
  });

  console.log("google-signin status:", res.status); // 👈 add this
  const body = await res.json().catch(() => ({}));
  console.log("google-signin body:", body); // 👈 add this

  if (!res.ok) return false;
  const { user: dbUser } = body;
  if (!dbUser) return false; // 👈 add this check

  user.id = dbUser.id;
  user.phone = dbUser.phone ?? null;
  user.email = dbUser.email;
  user.name = dbUser.name ?? null;
  user.image = dbUser.profilePic ?? null;
  user.isProfileCompleted = dbUser.isProfileCompleted ?? false;
  user.hasCompletedOnboarding = dbUser.hasCompletedOnboarding ?? false;

  return true;
},
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.isProfileCompleted = user.isProfileCompleted;
        token.hasCompletedOnboarding = user.hasCompletedOnboarding;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.phone = token.phone;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.image = token.image;
      session.user.isProfileCompleted = token.isProfileCompleted;
      session.user.hasCompletedOnboarding = token.hasCompletedOnboarding;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
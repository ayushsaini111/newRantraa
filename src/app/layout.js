// src/app/layout.js
import { Lora, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import AuthProvider from "@/components/providers/SessionProvider";
import QueryProvider from "@/components/providers/QueryProvider"; // ✅ Add this
import AuthSync from "@/components/providers/AuthSync";
import Footer from "@/components/footer/Footer";

const Primary = Lora({
  variable: "--font-Lora-Serif",
  subsets: ["latin"],
  display: "swap",
});

const Secondary = DM_Sans({
  variable: "--font-DM_Sans-sans-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Rantraa",
  description: "Book Pooja & Consult Experts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${Primary.variable} ${Secondary.variable} antialiased`}
      >
        {/* Razorpay Script */}
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        <AuthProvider>
          <QueryProvider> {/* ✅ Add QueryProvider inside AuthProvider */}
            <div className="min-h-screen bg-background">
              <AuthSync />
              <Navbar />

              <main className="">
                {children}
              </main>
              <Footer />

              <MobileBottomBar />
            </div>
          </QueryProvider> {/* ✅ Close QueryProvider */}
        </AuthProvider>
      </body>
    </html>
  );
}
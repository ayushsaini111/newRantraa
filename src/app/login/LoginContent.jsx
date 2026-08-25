"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function LoginContent() {  // ← Changed from LoginPage
  const router = useRouter();
  const searchParams = useSearchParams(); // ← Now safe with Suspense
  const [googleLoading, setGoogleLoading] = useState(false);
  const [step, setStep] = useState("phone"); // phone | otp

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);

  const inputsRef = useRef([]);

  // Get redirect URL from search params
  const redirectUrl = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (step !== "otp") return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  // Handle successful authentication redirect
  const handleSuccessfulAuth = () => {
    // If there's a redirect URL, go there, otherwise go to home
    if (redirectUrl && redirectUrl !== '/') {
      router.replace(redirectUrl);
    } else {
      router.replace('/');
    }
  };

  async function sendOtp() {
    if (phone.length !== 10) {
      setError("Enter valid phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/backend/auth/sendotps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      setLoading(false);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Unable to send OTP");
        return;
      }

      setTimer(30);
      setStep("otp");
    } catch (error) {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  }

  async function autoVerifyOtp(code) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/backend/auth/verifyotps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: code }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Invalid OTP");
        return;
      }

      if (data.isNewUser) {
        // For new users, store redirect URL in sessionStorage for after onboarding
        sessionStorage.setItem("verifiedPhone", phone);
        sessionStorage.setItem("verifiedToken", data.verifiedToken);
        sessionStorage.setItem("postOnboardingRedirect", redirectUrl);
        router.replace("/auth/onboarding");
        return;
      }

      // Existing user - sign them in
      const result = await signIn("otp-credentials", {
        redirect: false,
        phone,
        token: data.verifiedToken,
      });

      if (result?.error) {
        setError("Sign in failed. Please try again.");
        return;
      }

      // Successful login - redirect to intended page
      handleSuccessfulAuth();

    } catch (error) {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  }

  async function verifyOtp() {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Enter complete OTP");
      return;
    }
    await autoVerifyOtp(code);
  }

  function handleOtp(index, value) {
    if (!/^\d*$/.test(value)) return;

    const arr = [...otp];
    arr[index] = value.slice(-1);
    setOtp(arr);
    setError("");

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (arr.every((d) => d !== "")) {
      autoVerifyOtp(arr.join(""));
    }
  }

  async function handleGoogle() {
    try {
      setGoogleLoading(true);
      // Pass the redirect URL as the callback URL
      const callbackUrl = redirectUrl && redirectUrl !== '/' 
        ? `/auth/callback?redirect=${encodeURIComponent(redirectUrl)}`
        : '/auth/callback';
        
      await signIn("google", { callbackUrl });
    } catch (err) {
      console.error(err);
      setGoogleLoading(false);
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace") {
      const arr = [...otp];
      
      if (arr[index]) {
        arr[index] = "";
        setOtp(arr);
      } else if (index > 0) {
        arr[index - 1] = "";
        setOtp(arr);
        inputsRef.current[index - 1]?.focus();
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-5">
      <div className="w-full max-w-md bg-primary-light/20 rounded-r24 p-8">
        {/* Logo */}
        <div className="mx-auto relative w-38 h-28 mb-6">
          <Image
            src="/rr.png"
            fill
            alt="Rantraa"
            className="rounded-full object-contain"
          />
        </div>

        <h2 className="heading-h4 text-center mb-2">
          Welcome to Rantraa
        </h2>

        {/* Show context message if coming from booking flow */}
        {redirectUrl && redirectUrl.includes('checkout') && (
          <p className="text-center text-sm text-secondary mb-6">
            Please login to continue your booking
          </p>
        )}

        {/* STEP: PHONE */}
        {step === "phone" && (
          <>
            <label className="body-default"></label>

            <div className="mt-2 flex items-center gap-3 mt-s16 border rounded-r16 px-4 py-3">
              <MessageCircle size={22} className="text-green-600" />
              <span>+91</span>
              <input
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="bg-transparent outline-none flex-1"
                placeholder="Enter mobile number"
                autoComplete="tel"
              />
            </div>

            {error && (
              <p className="text-red-main mt-3 caption">{error}</p>
            )}

            <Button
              onClick={sendOtp}
              loading={loading}
              className="w-full mt-8"
            >
              Continue
            </Button>

            <div className="relative my-6">
              <div className="border-t border-gray-300" />
              <span className="absolute left-1/2 -translate-x-1/2 -top-3  px-4 caption text-secondary">
                OR
              </span>
            </div>

            <button
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center cursor-pointer justify-center gap-3 border border-black/20 dark:border-white/20 rounded-r16 py-3 text-main hover:bg-black/5 dark:hover:bg-white/5 transition disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-medium">
                {googleLoading ? "Signing in..." : "Continue with Google"}
              </span>
            </button>
          </>
        )}

        {/* STEP: OTP */}
        {step === "otp" && (
          <>
            <h3 className="heading-h5 text-center">Verify OTP</h3>

            <p className="caption text-center text-secondary mt-2">
              Sent to +91 {phone}
            </p>

            <div className="flex justify-between mt-8">
              {otp.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  value={d}
                  maxLength={1}
                  onChange={(e) => handleOtp(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 border rounded-r16 text-center text-xl"
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            <p className="caption text-center mt-5">
              {timer > 0 ? (
                `Resend in ${timer}s`
              ) : (
                <button
                  onClick={sendOtp}
                  className="text-primary underline"
                  disabled={loading}
                >
                  Resend OTP
                </button>
              )}
            </p>

            {error && (
              <p className="text-red-main mt-3 caption text-center">{error}</p>
            )}

            <Button
              onClick={verifyOtp}
              loading={loading}
              className="w-full mt-8"
            >
              Verify OTP
            </Button>

            <button
              onClick={() => {
                setStep("phone");
                setOtp(["", "", "", "", "", ""]);
                setError("");
                setTimer(0);
              }}
              className="w-full text-center caption text-secondary mt-4 hover:text-main transition-colors"
            >
              ← Change number
            </button>
          </>
        )}
      </div>
    </div>
  );
}
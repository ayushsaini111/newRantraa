"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Button from "@/components/ui/Button";
import WelcomeBonusModal from "@/components/auth/WelcomeBonusModal";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

  // Redirect if already onboarded
  useEffect(() => {
    if (session?.user?.hasCompletedOnboarding) {
      handlePostOnboardingRedirect();
    }
    // Pre-fill name from Google session if available
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  // Handle redirect after onboarding completion
  const handlePostOnboardingRedirect = () => {
    const redirectUrl = sessionStorage.getItem('postOnboardingRedirect') || '/';
    sessionStorage.removeItem('postOnboardingRedirect');
    
    if (redirectUrl && redirectUrl !== '/') {
      router.replace(redirectUrl);
    } else {
      router.replace("/");
    }
  };

  async function handleSubmit() {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!dob) {
      setError("Please select your date of birth.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Check if OTP new user (phone + token in sessionStorage)
      const phone = sessionStorage.getItem("verifiedPhone");
      const token = sessionStorage.getItem("verifiedToken");

      const res = await fetch("/api/proxy/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          dob,
          // Only send if OTP new user
          ...(phone && token ? { phone, token } : {}),
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      // OTP new user — sign in with fresh token
      if (phone && token) {
        const result = await signIn("otp-credentials", {
          redirect: false,
          phone,
          token: data.freshToken, // use freshToken not old token
        });

        if (result?.error) {
          setError("Sign in failed. Please try again.");
          return;
        }

        sessionStorage.removeItem("verifiedPhone");
        sessionStorage.removeItem("verifiedToken");
      }

      setShowWelcome(true);
    } catch (error) {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  }

  async function handleStartConsultation() {
    try {
      await fetch("/api/proxy/auth/free-call-popup", { method: "POST" });
    } catch (error) {
      console.error('Error setting free call popup:', error);
    }
    
    setShowWelcome(false);
    router.replace("/consult");
  }

  function handleCloseWelcome() {
    setShowWelcome(false);
    
    // Check if user was in the middle of booking a pooja
    const redirectUrl = sessionStorage.getItem('postOnboardingRedirect');
    
    if (redirectUrl && (redirectUrl.includes('checkout') || redirectUrl.includes('pooja'))) {
      // User was booking a pooja - continue that flow
      sessionStorage.removeItem('postOnboardingRedirect');
      router.replace(redirectUrl);
    } else {
      // Normal flow - go to home
      handlePostOnboardingRedirect();
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-r24 bg-secondary-main border border-border shadow-xl p-10">

          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-primary-light mx-auto flex items-center justify-center text-4xl mb-6">
              👋
            </div>
            <h1 className="heading-h3">Welcome to Rantraa</h1>
            <p className="body-default text-secondary mt-3 max-w-sm mx-auto">
              Before you begin your spiritual journey, tell us a little about yourself.
            </p>
            
            {/* Show context if user was booking */}
            {sessionStorage.getItem('postOnboardingRedirect')?.includes('checkout') && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  📿 Complete your profile to continue with your pooja booking
                </p>
              </div>
            )}
          </div>

          <div className="mt-10">
            <label className="body-small text-secondary">
              What should we call you?
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="mt-2 w-full rounded-r16 border border-border bg-background px-4 py-4 outline-none focus:border-primary"
              autoComplete="name"
            />
          </div>

          <div className="mt-6">
            <label className="body-small text-secondary">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="mt-2 w-full rounded-r16 border border-border bg-background px-4 py-4 outline-none focus:border-primary"
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
            />
          </div>

          {error && (
            <div className="mt-5 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="mt-6 rounded-r16 bg-background p-4 border border-border">
            <p className="body-small text-secondary text-center">
              This information is required only once and can be updated later from your profile settings.
            </p>
          </div>

          <Button 
            loading={loading} 
            onClick={handleSubmit} 
            className="w-full mt-8"
            disabled={!name.trim() || !dob}
          >
            {loading ? "Setting up your profile..." : "Continue →"}
          </Button>

        </div>
      </div>

      <WelcomeBonusModal
        open={showWelcome}
        onContinue={handleStartConsultation}
        onClose={handleCloseWelcome}
      />
    </>
  );
}
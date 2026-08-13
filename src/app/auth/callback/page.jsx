"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function checkUser() {
      try {
        const res = await fetch("/api/auth/me");

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const user = await res.json();

        // Get redirect URL from search params or sessionStorage
        const redirectUrl = searchParams.get('redirect') || 
                           sessionStorage.getItem('postAuthRedirect') || 
                           '/';

        if (user.hasCompletedOnboarding) {
          // User is fully onboarded - redirect to intended page
          sessionStorage.removeItem('postAuthRedirect');
          
          if (redirectUrl && redirectUrl !== '/') {
            router.replace(redirectUrl);
          } else {
            router.replace("/");
          }
        } else {
          // User needs onboarding - store redirect URL for after onboarding
          if (redirectUrl && redirectUrl !== '/') {
            sessionStorage.setItem('postOnboardingRedirect', redirectUrl);
          }
          router.replace("/auth/onboarding");
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.replace("/login");
      }
    }

    checkUser();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-secondary text-lg">Completing authentication...</p>
        <p className="text-secondary text-sm mt-2">Please wait while we set up your account</p>
      </div>
    </div>
  );
}
import { Suspense } from "react";
import HoroscopeContent from "./HoroscopeContent";

export default function HoroscopePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen mt-[90px] flex items-center justify-center bg-gradient-to-br from-primary-main/5 via-secondary-main/20 to-accent-main/5">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-main/20 border-t-primary-main" />
        </div>
      }
    >
      <HoroscopeContent />
    </Suspense>
  );
}
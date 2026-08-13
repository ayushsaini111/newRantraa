import { Suspense } from "react";
import HoroscopeContent from "./HoroscopeContent";

export default function HoroscopePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen mt-[90px] flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600" />
        </div>
      }
    >
      <HoroscopeContent />
    </Suspense>
  );
}
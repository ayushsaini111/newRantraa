import { Suspense } from 'react';
import LoginContent from './LoginContent';

export const metadata = {
  title: 'Login | Rantraa',
  description: 'Login to access astrology services, book poojas, and consult with expert pandits',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-5">
      <div className="w-full max-w-md bg-secondary-main rounded-r24 p-8">
        {/* Logo skeleton */}
        <div className="mx-auto w-28 h-28 mb-6 bg-gray-200 rounded-full animate-pulse" />
        
        {/* Title skeleton */}
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse" />
        
        {/* Input skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-r16 animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-r16 animate-pulse" />
          <div className="h-12 bg-gray-200 rounded-r16 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
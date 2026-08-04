// src/app/checkout/page.jsx
import { Suspense } from 'react';
import CheckoutForm from './CheckoutForm';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
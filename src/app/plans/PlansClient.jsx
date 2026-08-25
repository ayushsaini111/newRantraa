"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function formatSeconds(seconds) {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    return `${m}m`;
  }
  return `${seconds}s`;
}

export default function PlansClient({ plans, status, userId }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [buying, setBuying] = useState(null);
  const [message, setMessage] = useState("");

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  async function handleBuy(plan) {
    const currentUserId = session?.user?.id || userId;

    if (!currentUserId) {
      setMessage("❌ Please login first.");
      setTimeout(() => router.push("/login?callbackUrl=/plans"), 1500);
      return;
    }

    setBuying(plan.id);
    setMessage("");

    try {
      // 1. Create Razorpay order
      const orderRes = await fetch("/backend/create-plan-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId,
          "x-user-email": session?.user?.email || "",
          "x-user-name": session?.user?.name || "",
        },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          price: plan.price,
          seconds: plan.seconds,
          validDays: plan.validDays,
          perDayLimit: plan.perDayLimit,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // 2. Check if Razorpay is loaded
      if (typeof window.Razorpay === "undefined") {
        setMessage("❌ Payment gateway not loaded. Please refresh the page.");
        setBuying(null);
        return;
      }

      // 3. Open Razorpay checkout
      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Rantraa",
        description: `${plan.name} - ${formatSeconds(plan.seconds)}`,
        order_id: orderData.order.id,
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          contact: session?.user?.phone || "",
        },
        theme: { 
          color: "#8A5AB8" 
        },
        handler: async (response) => {
          await verifyPayment(response, plan);
        },
        modal: {
          ondismiss: () => {
            setBuying(null);
            setMessage("❌ Payment cancelled");
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        setMessage(`❌ Payment failed: ${response.error.description}`);
        setBuying(null);
      });

      razorpay.open();

    } catch (error) {
      console.error("Buy error:", error);
      setMessage(`❌ ${error.message || "Something went wrong"}`);
      setBuying(null);
    }
  }

  async function verifyPayment(response, plan) {
    try {
      const currentUserId = session?.user?.id || userId;

      const res = await fetch("/backend/verify-plan-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId,
          "x-user-email": session?.user?.email || "",
          "x-user-name": session?.user?.name || "",
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          planDetails: {
            planId: plan.id,
            planName: plan.name,
            price: plan.price,
            seconds: plan.seconds,
            validDays: plan.validDays,
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`✅ ${data.message || "Plan activated successfully!"}`);
        
        setTimeout(() => {
          // Return to source page or consult by default
          const returnUrl = sessionStorage.getItem("returnUrl") || "/consult";
          sessionStorage.removeItem("returnUrl");
          router.push(returnUrl);
          router.refresh(); // Refresh to update plan status
        }, 1500);
      } else {
        setMessage(`❌ ${data.message || "Payment verification failed"}`);
        setBuying(null);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage("❌ Payment verification failed. Please contact support.");
      setBuying(null);
    }
  }

  return (
    <div className="min-h-screen mt-s24 bg-background px-s16 py-s104 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="mb-s40">
        <h1 className="heading-h2 text-main mb-s8">Talktime Plans</h1>
        <p className="body-default text-secondary">Choose a plan to continue consulting</p>
      </div>

      {/* Free Call Status */}
      <div
        className={`rounded-r24 p-s24 mb-s40 ${
          status?.hasFreeCall
            ? "bg-emerald-50 border border-emerald-200"
            : "bg-orange-50 border border-orange-200"
        }`}
      >
        <p className={`body-default font-semibold ${status?.hasFreeCall ? "text-emerald-700" : "text-orange-700"}`}>
          {status?.hasFreeCall
            ? "🎁 You have a FREE 5-second test call available!"
            : "✅ Free call used. Buy a plan to continue."}
        </p>
      </div>

      {/* Active Plans */}
      {status?.activePlans?.length > 0 && (
        <div className="mb-s40">
          <h2 className="heading-h5 text-main mb-s24">Your Active Plans</h2>
          <div className="space-y-s16">
            {status.activePlans.map((p, i) => {
              const endDate = new Date(p.endDate);
              const daysLeft = Math.ceil((endDate - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <div
                  key={i}
                  className="bg-secondary-main/30 rounded-r24 p-s24 border border-secondary-dark"
                >
                  <div className="flex items-center justify-between mb-s16">
                    <h3 className="heading-h6 text-main">{p.name}</h3>
                    <p className="heading-h5 text-primary-main">
                      {formatSeconds(p.remainingSeconds)} left
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between text-secondary body-small">
                    <span>Expires: {endDate.toLocaleDateString("en-IN")}</span>
                    <span className={daysLeft <= 3 ? "text-red-main" : ""}>
                      {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                    </span>
                  </div>

                  {p.perDayLimit && (
                    <p className="body-small text-accent-main mt-s8">
                      ⚡ {formatSeconds(p.perDayLimit - (p.perDayUsedSeconds ?? 0))} remaining today
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`rounded-r16 p-s16 mb-s24 text-center ${
          message.includes("✅") 
            ? "bg-green-50 border border-green-200" 
            : "bg-red-50 border border-red-200"
        }`}>
          <p className={`body-default font-medium ${
            message.includes("✅") ? "text-green-700" : "text-red-700"
          }`}>
            {message}
          </p>
        </div>
      )}

      {/* Plans Grid */}
      <div>
        <h2 className="heading-h5 text-main mb-s24">Buy a Plan</h2>
        <div className="grid md:grid-cols-2 gap-s24">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white border-2 border-secondary-dark rounded-r32 p-s24 hover:border-primary-main transition-all hover:shadow-lg"
            >
              <h3 className="heading-h5 text-main mb-s8">{plan.name}</h3>
              
              <p className="heading-h2 text-primary-main mb-s16">
                ₹{(plan.price / 100).toFixed(0)}
              </p>

              <div className="space-y-s8 mb-s24">
                <p className="body-default text-secondary">
                  {formatSeconds(plan.seconds)} · {plan.validDays} days
                </p>
                
                {plan.perDayLimit && (
                  <p className="body-small text-accent-main">
                    ⚡ {formatSeconds(plan.perDayLimit)}/day limit
                  </p>
                )}
                
                {plan.includes?.length > 0 && (
                  <div className="space-y-s4">
                    {plan.includes.map((item, idx) => (
                      <p key={idx} className="body-small text-emerald-600 flex items-center gap-s8">
                        <span>✓</span>
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleBuy(plan)}
                disabled={buying === plan.id}
                className="w-full py-s16 bg-primary-main text-white rounded-r16 heading-h6 hover:bg-primary-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {buying === plan.id ? (
                  <span className="flex items-center justify-center gap-s8">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay ₹${(plan.price / 100).toFixed(0)}`
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Info */}
      <div className="mt-s40 bg-blue-50 border border-blue-200 rounded-r16 p-s16">
        <p className="body-small text-blue-900 text-center">
          🔒 Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
}
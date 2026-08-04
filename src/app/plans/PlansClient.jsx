// frontend/src/app/plans/PlansClient.jsx
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

  async function handleBuy(plan) {
    const currentUserId = session?.user?.id || userId;

    if (!currentUserId) {
      setMessage("❌ Please login first.");
      return;
    }

    setBuying(plan.id);
    setMessage("");

    try {
      const res = await fetch("https://astro-nine-beige.vercel.app/plans/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUserId,
          "x-user-email": session?.user?.email || "",
          "x-user-name": session?.user?.name || "",
        },
        body: JSON.stringify({ planId: plan.id }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Plan activated!");
        
        setTimeout(() => {
          // ✅ Return to source page or consult by default
          const returnUrl = sessionStorage.getItem("returnUrl") || "/consult";
          sessionStorage.removeItem("returnUrl");
          router.push(returnUrl);
        }, 1000);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error("Buy error:", error);
      setMessage("❌ Something went wrong");
    } finally {
      setBuying(null);
    }
  }

  return (
    <div className="min-h-screen bg-background px-s16 py-s104 max-w-4xl mx-auto">
      
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
        <div className="bg-secondary-main/50 rounded-r16 p-s16 mb-s24 text-center">
          <p className="body-default font-medium">{message}</p>
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
                  <p className="body-small text-emerald-600">
                    🎁 {plan.includes.join(", ")}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleBuy(plan)}
                disabled={buying === plan.id}
                className="w-full py-s16 bg-primary-main text-white rounded-r16 heading-h6 hover:bg-primary-light transition-colors disabled:opacity-60"
              >
                {buying === plan.id ? "Activating..." : "Buy Now"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
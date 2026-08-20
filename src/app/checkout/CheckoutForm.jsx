"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, ShieldCheck, Phone } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import DateSelector from "@/components/checkout/DateSelector";
import TimeSlotSelector from "@/components/checkout/TimeSlotSelector";
import ConfirmationModal from "@/components/checkout/ConfirmationModal";
import useCheckoutStore from "@/store/checkoutStore";

const TIME_SLOT_LABELS = {
  "8-12": "8:00 AM - 12:00 PM",
  "12-15": "12:00 PM - 3:00 PM", 
  "15-19": "3:00 PM - 7:00 PM",
  "19-22": "7:00 PM - 10:00 PM",
};

function InputField({ label, error, ...props }) {
  return (
    <div>
      <label className="body-small text-secondary">{label}</label>
      <input
        {...props}
        className={`mt-1 w-full rounded-r8 border px-4 py-3 outline-none focus:border-primary bg-white body-small transition ${
          error ? "border-red-main" : "border-border"
        } ${props.disabled ? "opacity-50" : ""}`}
      />
      {error && <p className="text-red-main caption mt-1">{error}</p>}
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-gray-100 rounded-r16 border border-border p-6">
      <h2 className="body-default font-semibold mb-5">{title}</h2>
      {children}
    </div>
  );
}

export default function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const poojaId = searchParams.get("poojaId");

  const {
    pooja, setPooja,
    userDetails, setUserDetails,
    selectedDate, selectedTimeSlot,
    setSelectedDate, setSelectedTimeSlot,
    resetCheckout,
  } = useCheckoutStore();

  const [loading, setLoading] = useState(false);
  const [poojaLoading, setPoojaLoading] = useState(true); // New loading state for pooja fetch
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const [needsPhone, setNeedsPhone] = useState(false);

  // 🔥 Load pooja from database API instead of static data
  useEffect(() => {
    async function fetchPooja() {
      if (!poojaId) {
        router.push("/poojas");
        return;
      }

      // Check if we already have the right pooja in store
      if (pooja && String(pooja.id) === String(poojaId)) {
        setPoojaLoading(false);
        return;
      }

      try {
        setPoojaLoading(true);
        
        const response = await fetch(`/backend/poojas/${poojaId}`);
        
        if (!response.ok) {
          throw new Error('Pooja not found');
        }
        
        const fetchedPooja = await response.json();
        setPooja(fetchedPooja);
        
      } catch (error) {
        console.error('Error fetching pooja:', error);
        router.push("/poojas");
      } finally {
        setPoojaLoading(false);
      }
    }

    fetchPooja();
  }, [poojaId, pooja, setPooja, router]);

  // Auto-fetch user details from session-based API
// Auto-fetch user details from session-based API
useEffect(() => {
  if (!session?.user?.id) return;

  fetch("/backend/user/profile", {
    headers: {
      'x-user-id': session.user.id,
      'x-user-email': session.user.email || '',
      'x-user-name': session.user.name || '',
    }
  })
    .then((r) => r.json())
    .then((data) => {
      if (data) {
        setUserDetails({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          houseNo: data.houseNo || "",
          address: data.address || "",
          landmark: data.landmark || "",
          pinCode: data.pinCode || "",
        });
        // Google user with no phone yet
        if (!data.phone && data.provider === "GOOGLE") {
          setNeedsPhone(true);
        }
      }
    })
    .catch(console.error);
}, [session, setUserDetails]);

  function validate() {
    const e = {};
    if (!userDetails.name?.trim()) e.name = "Name is required";

    if (!userDetails.phone?.trim()) {
      e.phone = "Phone is required";
    } else if (!/^[6-9]\d{9}$/.test(userDetails.phone)) {
      e.phone = "Invalid phone number";
    }

    if (!userDetails.email?.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.email)) {
      e.email = "Invalid email";
    }

    if (pooja?.mode === "At Home") {
      if (!userDetails.houseNo?.trim()) e.houseNo = "Required";
      if (!userDetails.address?.trim()) e.address = "Required";
      if (!userDetails.pinCode?.trim()) e.pinCode = "Required";
      else if (!/^\d{6}$/.test(userDetails.pinCode)) e.pinCode = "Invalid PIN";
    }

    if (!selectedDate) e.date = "Please select a date";
    if (!selectedTimeSlot) e.timeSlot = "Please select a time slot";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

 // In CheckoutForm.jsx
async function initiatePayment() {
  if (!validate()) return;

  setLoading(true);

  try {
    // Save phone if Google user added it
    if (needsPhone && userDetails.phone) {
      const fd = new FormData();
      fd.append("phone", userDetails.phone);

      await fetch("/backend/user/profile", {
        method: "PUT",
        headers: {
          'x-user-id': session.user.id,
          'x-user-email': session.user.email || '',
          'x-user-name': session.user.name || '',
        },
        body: fd,
      });
    }

    const orderRes = await fetch("/backend/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: pooja.offer_price * 100,
        currency: "INR",
        poojaId: pooja.id,
        poojaTitle: pooja.title,
      }),
    });

    const orderData = await orderRes.json();
    if (!orderData.success) throw new Error(orderData.error);

    if (typeof window.Razorpay === "undefined") {
      alert("Payment gateway not loaded. Please refresh.");
      setLoading(false);
      return;
    }

    const razorpay = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: "Rantraa",
      description: pooja.title,
      order_id: orderData.order.id,
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: `+91${userDetails.phone}`,
      },
      theme: { color: "#FF6B35" },
      handler: async (response) => {
        await verifyPayment(response);
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    });

    razorpay.on("payment.failed", (r) => {
      alert("Payment failed: " + r.error.description);
      setLoading(false);
    });

    razorpay.open();
  } catch (err) {
    console.error(err);
    alert("Failed to initiate payment. Please try again.");
    setLoading(false);
  }
}

async function verifyPayment(response) {
  try {
    const res = await fetch("/backend/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...response,
        userDetails,
        pooja,
        selectedDate,
        selectedTimeSlot,
        userId: session.user.id,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setBookingDetails({
        bookingId: data.booking.bookingId,
        date: selectedDate,
        timeSlot: TIME_SLOT_LABELS[selectedTimeSlot],
        address:
          pooja.mode === "At Home"
            ? `${userDetails.houseNo}, ${userDetails.address}${userDetails.landmark ? ", " + userDetails.landmark : ""}, ${userDetails.pinCode}`
            : "Online via Video Call",
        phone: userDetails.phone,
        email: userDetails.email,
      });
      setShowConfirmation(true);
      setLoading(false);
    } else {
      alert(data.message || "Payment verification failed");
      setLoading(false);
    }
  } catch (err) {
    console.error(err);
    alert("Verification failed. Please contact support.");
    setLoading(false);
  }
}

  // 🔥 Loading state for pooja fetch
  if (poojaLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-secondary">Loading pooja details...</p>
        </div>
      </div>
    );
  }

  if (!pooja) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-secondary mb-4">Pooja not found</p>
          <Button onClick={() => router.push("/poojas")}>
            Back to Poojas
          </Button>
        </div>
      </div>
    );
  }

  const discount = pooja.price - pooja.offer_price; // 🔥 Updated to match DB field names

  return (
    <>
      <main className="min-h-screen bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">

          {/* Header */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-secondary hover:text-main mb-6 transition"
          >
            <ArrowLeft size={20} />
            <span className="body-small">Back</span>
          </button>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* LEFT — Form */}
            <div className="lg:col-span-2 space-y-4">

              {/* Contact Details */}
              <SectionCard title="Contact Details">
                <div className="grid sm:grid-cols-2 gap-4">
                  <InputField
                    label="Full Name *"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails({ name: e.target.value })}
                    placeholder="Enter your name"
                    error={errors.name}
                  />

                  <div>
                    <label className="body-small text-secondary">Phone Number *</label>
                    <div className={`mt-1 flex items-center gap-2 rounded-r8 border px-4 py-3 bg-white transition ${errors.phone ? "border-red-main" : "border-border"}`}>
                      <Phone size={16} className="text-secondary shrink-0" />
                      <span className="body-small text-secondary">+91</span>
                      <input
                        value={userDetails.phone}
                        onChange={(e) => setUserDetails({ phone: e.target.value.replace(/\D/g, "") })}
                        placeholder="10-digit number"
                        maxLength={10}
                        className="bg-transparent outline-none flex-1 body-small"
                        readOnly={!!userDetails.phone && !needsPhone}
                      />
                    </div>
                    {needsPhone && (
                      <p className="caption text-primary mt-1">Please add your phone number to proceed</p>
                    )}
                    {errors.phone && <p className="text-red-main caption mt-1">{errors.phone}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <InputField
                      label="Email Address *"
                      type="email"
                      value={userDetails.email}
                      onChange={(e) => setUserDetails({ email: e.target.value })}
                      placeholder="your@email.com"
                      error={errors.email}
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Address — only for At Home */}
              {pooja.mode === "At Home" && (
                <SectionCard title="Address Details">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField
                      label="House/Flat No. *"
                      value={userDetails.houseNo}
                      onChange={(e) => setUserDetails({ houseNo: e.target.value })}
                      placeholder="Building, House no."
                      error={errors.houseNo}
                    />
                    <InputField
                      label="PIN Code *"
                      value={userDetails.pinCode}
                      onChange={(e) => setUserDetails({ pinCode: e.target.value.replace(/\D/g, "") })}
                      placeholder="6-digit PIN code"
                      maxLength={6}
                      error={errors.pinCode}
                    />
                    <div className="sm:col-span-2">
                      <InputField
                        label="Address (Area, Street) *"
                        value={userDetails.address}
                        onChange={(e) => setUserDetails({ address: e.target.value })}
                        placeholder="Area, Street, Sector, Village"
                        error={errors.address}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <InputField
                        label="Landmark (Optional)"
                        value={userDetails.landmark}
                        onChange={(e) => setUserDetails({ landmark: e.target.value })}
                        placeholder="Nearby landmark"
                      />
                    </div>
                  </div>
                </SectionCard>
              )}

              {/* Date */}
              <SectionCard title="Select Date">
                <DateSelector
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
                {errors.date && (
                  <p className="text-red-main caption mt-2">{errors.date}</p>
                )}
              </SectionCard>

              {/* Time */}
              <SectionCard title="Select Time Slot">
                <TimeSlotSelector
                  selectedSlot={selectedTimeSlot}
                  onSelectSlot={setSelectedTimeSlot}
                  selectedDate={selectedDate}
                />
                {errors.timeSlot && (
                  <p className="text-red-main caption mt-2">{errors.timeSlot}</p>
                )}
              </SectionCard>

            </div>

            {/* RIGHT — Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-100 rounded-r16 border border-border p-6 sticky top-4">
                <h2 className="body-default font-semibold mb-5">Order Summary</h2>

                {/* Pooja */}
                <div className="flex gap-4 mb-5">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-r8 shrink-0 border border-border">
                    <Image
                      src={pooja.image}
                      alt={pooja.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div>
                    <p className="body-small font-semibold">{pooja.title}</p>
                    <p className="caption text-secondary mt-1">{pooja.mode}</p>
                    <p className="caption text-secondary">{pooja.duration}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="body-small text-secondary">Price</span>
                    <span className="body-small line-through text-secondary">₹{pooja.price}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="body-small">Discount</span>
                      <span className="body-small">− ₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border pt-3">
                    <span className="body-default font-semibold">Total</span>
                    <span className="body-default font-semibold">₹{pooja.offer_price}</span>
                  </div>
                </div>

                {/* Trust badge */}
                <div className="flex items-center gap-3 bg-green-50 rounded-r8 p-3 mt-5">
                  <ShieldCheck size={20} className="text-green-600 shrink-0" />
                  <div>
                    <p className="caption font-semibold text-green-900">Safe & Secure Payment</p>
                    <p className="caption text-green-700">100% Payment Protection</p>
                  </div>
                </div>

                <Button
                  onClick={initiatePayment}
                  loading={loading}
                  className="w-full mt-5"
                >
                  Pay ₹{pooja.offer_price}
                </Button>

                <p className="caption text-center text-secondary mt-3">
                  Powered by Razorpay
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          resetCheckout();
        }}
        bookingDetails={bookingDetails}
      />
    </>
  );
}
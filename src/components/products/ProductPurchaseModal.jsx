"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Phone, Sparkles, Check } from "lucide-react";

const SHUDDHIKARAN_PRICE = 199;

// ─── Map Picker Component (keep your existing one, unchanged) ───────────────
function MapPicker({ initialCoords, onConfirm, onClose }) {
  // ... keep all your existing MapPicker code exactly as is ...
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const abortRef = useRef(null);

  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState(initialCoords ?? null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");

  const LOCATIONIQ_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_KEY ?? "";

  useEffect(() => {
    if (!LOCATIONIQ_KEY) {
      console.error("❌ NEXT_PUBLIC_LOCATIONIQ_KEY not found");
      setError("Geocoding service not configured");
    }
  }, [LOCATIONIQ_KEY]);

  const reverseGeocode = useCallback(async (lat, lng) => {
    if (!LOCATIONIQ_KEY) {
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lng}&format=json&accept-language=en`,
        { 
          signal: controller.signal,
          headers: { "Accept-Language": "en" }
        }
      );

      if (!res.ok) {
        if (res.status === 429) throw new Error("Too many requests. Please wait.");
        if (res.status === 401) throw new Error("Invalid API key");
        throw new Error(`Geocoding failed (${res.status})`);
      }

      const data = await res.json();
      const a = data.address ?? {};
      const parts = [
        a.house_number,
        a.road ?? a.pedestrian ?? a.footway,
        a.suburb ?? a.neighbourhood ?? a.quarter,
        a.city ?? a.town ?? a.village,
        a.state,
      ].filter(Boolean);

      const fullAddress = parts.join(", ") || data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(fullAddress);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error("Geocoding error:", err);
      setError(err.message || "Could not fetch address");
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setLoading(false);
    }
  }, [LOCATIONIQ_KEY]);

  useEffect(() => {
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (!mapContainerRef.current || mapRef.current) return;
      
      if (!window.L) {
        setError("Map failed to load. Please refresh.");
        return;
      }

      const L = window.L;
      const lat = initialCoords?.lat ?? 26.4499;
      const lng = initialCoords?.lng ?? 80.3319;

      try {
        const map = L.map(mapContainerRef.current, {
          center: [lat, lng],
          zoom: 17,
          zoomControl: false,
          attributionControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '© OpenStreetMap',
        }).addTo(map);

        L.control.zoom({ position: "bottomright" }).addTo(map);

        const icon = L.divIcon({
          className: "",
          html: `<div style="display:flex;flex-direction:column;align-items:center;">
            <div style="width:36px;height:36px;background:var(--primary-main);border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);border:3px solid white;
              box-shadow:0 4px 12px rgba(0,0,0,0.3);"></div>
            <div style="width:8px;height:8px;background:var(--primary-main);border-radius:50%;
              margin-top:2px;box-shadow:0 2px 6px rgba(0,0,0,0.2);"></div>
          </div>`,
          iconSize: [36, 46],
          iconAnchor: [18, 46],
        });

        const marker = L.marker([lat, lng], { draggable: true, icon }).addTo(map);

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          setCoords({ lat: pos.lat, lng: pos.lng });
          reverseGeocode(pos.lat, pos.lng);
        });

        map.on("click", (e) => {
          marker.setLatLng(e.latlng);
          setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
          reverseGeocode(e.latlng.lat, e.latlng.lng);
        });

        mapRef.current = map;
        markerRef.current = marker;

        if (initialCoords) {
          reverseGeocode(lat, lng);
        }
      } catch (err) {
        console.error("Map init error:", err);
        setError("Failed to initialize map");
      }
    };

    if (window.L) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      script.onerror = () => setError("Map library failed to load");
      document.head.appendChild(script);
    }

    return () => {
      abortRef.current?.abort();
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          console.warn("Error removing map:", e);
        }
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [initialCoords, reverseGeocode]);

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setError("GPS not supported");
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      ({ coords: c }) => {
        const lat = c.latitude;
        const lng = c.longitude;
        
        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          setError("Invalid GPS coordinates");
          setLocating(false);
          return;
        }

        setCoords({ lat, lng });
        mapRef.current?.setView([lat, lng], 18);
        markerRef.current?.setLatLng([lat, lng]);
        reverseGeocode(lat, lng);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        const msgs = {
          1: "Location access denied. Enable permissions in browser settings.",
          2: "Location unavailable. Check device settings.",
          3: "Location request timed out.",
        };
        setError(msgs[err.code] || "Could not get location. Drag pin manually.");
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [reverseGeocode]);

  useEffect(() => {
    if (!initialCoords && !error) {
      const timer = setTimeout(handleLocateMe, 500);
      return () => clearTimeout(timer);
    }
  }, [initialCoords, handleLocateMe, error]);

  const handleConfirm = () => {
    if (!coords) {
      setError("Please select a delivery location on the map");
      return;
    }
    if (!address) {
      setAddress(`${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`);
    }
    onConfirm({ coords, address: address || `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}` });
  };

  return (
    <div className="fixed inset-0 z-[65] flex max-w-5xl mx-auto my-auto md:h-[90vh] flex-col bg-background">
      <div className="flex items-center gap-s16 px-s16 py-s16 border-b border-secondary-dark bg-background flex-shrink-0 shadow-sm">
        <button 
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary-main/30 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-main)" strokeWidth="2.2" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <span className="heading-h5 text-main">Pin Your Delivery Location</span>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full" />

        <button
          onClick={handleLocateMe}
          disabled={locating}
          className="absolute bottom-[210px] right-s16 z-[400] flex items-center gap-s8 bg-background rounded-r16 shadow-lg px-s16 py-s8 body-small font-medium text-main border border-secondary-dark hover:bg-secondary-main/30 transition-colors disabled:opacity-60"
        >
          {locating ? (
            <>
              <svg className="animate-spin text-primary-main" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Locating…
            </>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary-main)" strokeWidth="2.2" strokeLinecap="round">
                <circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
              </svg>
              Use current location
            </>
          )}
        </button>
      </div>

      <div className="bg-background px-s16 pt-s18 pb-s16 flex flex-col gap-s16 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] flex-shrink-0">
        {error && (
          <div className="flex items-start gap-s8 bg-red-50 border border-red-200 rounded-r12 px-s16 py-s8">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--red-main)" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
            </svg>
            <p className="body-small text-red-700 leading-relaxed">{error}</p>
          </div>
        )}

        <div className="flex items-start gap-s16">
          <div className="w-9 h-9 rounded-full bg-primary-main/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary-main)" strokeWidth="2.2" strokeLinecap="round">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div className="flex flex-col flex-1 gap-s6">
            <span className="body-small font-semibold text-main">
              {coords ? "Delivery location pinned" : "No location selected"}
            </span>
            {loading || locating ? (
              <div className="flex flex-col gap-s6">
                <div className="h-3 w-52 bg-secondary-main/40 rounded animate-pulse" />
                <div className="h-3 w-36 bg-secondary-main/40 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <span className="body-small text-secondary leading-relaxed">
                  {address || "Tap the map or use current location"}
                </span>
                {coords && (
                  <span className="body-small text-secondary/50 font-mono text-xs">
                    📍 {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <p className="body-small text-secondary/50">
          Drag the pin or tap the map to adjust your exact delivery location
        </p>

        <Button
          variant="tertiary"
          onClick={handleConfirm}
          disabled={!coords || loading || locating}
          className="!rounded-r16 !py-s16 w-full disabled:opacity-50"
        >
          Confirm Location & Continue →
        </Button>
      </div>
    </div>
  );
}

// ─── Input Field Component ────────────────────────────────────────────────────
function InputField({ label, error, ...props }) {
  return (
    <div>
      <label className="block body-small font-medium text-main mb-s6">
        {label}
      </label>
      <input
        {...props}
        className={`w-full px-s16 py-s8 border rounded-r8 focus:outline-none transition-colors disabled:bg-gray-50 body-default ${
          error ? "border-red-500" : "border-secondary-dark focus:border-primary-main"
        } ${props.disabled ? "opacity-50" : ""}`}
      />
      {error && <p className="text-red-500 body-small mt-s6">{error}</p>}
    </div>
  );
}

// ─── ✅ Shuddhikaran Option Component ────────────────────────────────────────
function ShuddhikaranOption({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`w-full flex items-start gap-s16 p-s16 rounded-r16 border text-left transition-colors disabled:opacity-50 ${
        checked
          ? "border-primary-main bg-primary-main/5"
          : "border-secondary-dark bg-background hover:border-primary-light"
      }`}
    >
      <div
        className={`w-6 h-6 rounded-r8 flex items-center justify-center shrink-0 mt-0.5 border-2 transition-colors ${
          checked ? "bg-primary-main border-primary-main" : "border-secondary-dark"
        }`}
      >
        {checked && <Check size={14} className="text-background" strokeWidth={3} />}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-s8 mb-s4">
          <Sparkles size={16} className="text-primary-main" />
          <p className="body-default font-semibold text-main">Add Shuddhikaran (Purification)</p>
        </div>
        <p className="body-small text-secondary leading-relaxed">
          Get your product energized and purified by our Pandit Ji before delivery — includes Vedic mantras and ritual cleansing.
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="body-default font-semibold text-primary-main">+₹{SHUDDHIKARAN_PRICE}</p>
      </div>
    </button>
  );
}

// ─── ✅ Main Product Purchase Modal ──────────────────────────────────────────
export default function ProductPurchaseModal({ product, onClose, onSuccess }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const overlayRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    landmark: "",
    pinCode: "",
    quantity: 1,
    specialRequests: "",
  });

  const [showMap, setShowMap] = useState(false);
  const [mapCoords, setMapCoords] = useState(null);
  const [mapAddress, setMapAddress] = useState("");
  const [shuddhikaranRequested, setShuddhikaranRequested] = useState(false); // ✅ NEW
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [needsPhone, setNeedsPhone] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = showMap ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showMap]);

  // Auto-fetch user details
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
          setFormData(prev => ({
            ...prev,
            name: data.name || "",
            phone: data.phone || "",
            email: data.email || "",
            address: data.address || "",
            landmark: data.landmark || "",
            pinCode: data.pinCode || "",
          }));
          
          if (!data.phone && data.provider === "GOOGLE") {
            setNeedsPhone(true);
          }
        }
      })
      .catch(console.error);
  }, [session]);

  if (!product) {
    return null;
  }

  if (status === "unauthenticated") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-s16">
        <div className="bg-background rounded-r24 p-s32 max-w-sm w-full text-center space-y-s16">
          <h3 className="heading-h5 text-main">Sign In Required</h3>
          <p className="body-default text-secondary">Please sign in to purchase this product</p>
          <div className="flex gap-s16">
            <Button onClick={onClose} variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onClose();
                router.push("/login?callbackUrl=" + encodeURIComponent(window.location.pathname));
              }}
              className="flex-1"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleMapConfirm = ({ coords, address }) => {
    setMapCoords(coords);
    setMapAddress(address);
    setShowMap(false);
    setErrors(prev => ({ ...prev, location: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!mapCoords) {
      newErrors.location = "Please pin your delivery location on the map";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Please enter your complete delivery address";
    }
    
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = "PIN Code is required";
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = "Invalid PIN Code";
    }

    if (!formData.quantity || parseInt(formData.quantity) < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    return newErrors;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // ✅ Calculate totals including Shuddhikaran
  const subtotal = product.price * (formData.quantity || 1);
  const shuddhikaranCost = shuddhikaranRequested ? SHUDDHIKARAN_PRICE : 0;
  const totalPrice = subtotal + shuddhikaranCost;

  const initiatePayment = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const combinedAddress = `${formData.address}${formData.landmark ? `, ${formData.landmark}` : ''} - ${formData.pinCode}`;
      
      const deliveryLocation = {
        type: "complete",
        latitude: mapCoords.lat,
        longitude: mapCoords.lng,
        gpsAddress: mapAddress,
        manualAddress: combinedAddress,
        fullAddress: combinedAddress,
        pinCode: formData.pinCode,
        landmark: formData.landmark,
      };

      // ✅ Include Shuddhikaran in order creation
      const orderRes = await fetch("/backend/create-product-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-user-id': session.user.id,
          'x-user-email': session.user.email || '',
          'x-user-name': session.user.name || '',
        },
        body: JSON.stringify({
          amount: totalPrice * 100, // ✅ includes Shuddhikaran
          currency: "INR",
          productId: product.id,
          productTitle: product.title,
          productImage: product.image,
          quantity: formData.quantity,
          unitPrice: product.price,
          shuddhikaranRequested, // ✅ NEW
          shuddhikaranAmount: shuddhikaranCost, // ✅ NEW
          deliveryLocation,
          userDetails: formData,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error);

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Rantraa",
        description: product.title,
        order_id: orderData.order.id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: `+91${formData.phone}`,
        },
        theme: { color: "#341539" },
        handler: async (response) => {
          await verifyPayment(response, deliveryLocation);
        },
      });

      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      setErrors({ submit: "Failed to initiate payment" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyPayment = async (response, deliveryLocation) => {
    try {
      const res = await fetch("/backend/verify-product-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'x-user-id': session.user.id,
          'x-user-email': session.user.email || '',
          'x-user-name': session.user.name || '',
        },
        body: JSON.stringify({
          ...response,
          userDetails: formData,
          deliveryLocation,
          shuddhikaranRequested, // ✅ Pass to backend
          shuddhikaranAmount: shuddhikaranCost, // ✅ Pass to backend
          productDetails: {
            productId: product.id,
            productTitle: product.title,
            productImage: product.image,
            quantity: formData.quantity,
            unitPrice: product.price,
            totalPrice: totalPrice,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess({
          orderId: data.order.orderId,
          productTitle: product.title,
          productImage: product.image,
          quantity: formData.quantity,
          unitPrice: product.price,
          totalPrice: totalPrice,
          shuddhikaranRequested, // ✅ Pass to confirmation
          shuddhikaranAmount: shuddhikaranCost, // ✅ Pass to confirmation
          deliveryLocation,
          userDetails: formData,
          orderDate: new Date().toISOString(),
          estimatedDelivery: data.order.estimatedDelivery,
        });
      } else {
        alert(data.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("Payment verification failed");
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current && !isSubmitting) {
      onClose();
    }
  };

  return (
    <>
      {showMap && (
        <MapPicker
          initialCoords={mapCoords}
          onConfirm={handleMapConfirm}
          onClose={() => setShowMap(false)}
        />
      )}

      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-s16 overflow-y-auto"
      >
        <div className="bg-background rounded-r24 w-full max-w-2xl my-s16 max-h-[90vh] overflow-y-auto">
          
          {/* Header */}
          <div className="border-b border-secondary-dark p-s16 flex items-start justify-between sticky top-0 bg-background z-10">
            <div className="flex items-start gap-s16 flex-1">
              <div className="relative w-16 h-16 rounded-r12 overflow-hidden flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="heading-h5 text-main">{product.title}</h2>
                <p className="body-small text-secondary mt-s6">
                  {product.shortDescription}
                </p>
                <div className="flex items-center gap-s8 mt-s6">
                  <span className="bg-green-100 text-green-800 px-s8 py-s6 rounded-r8 text-xs flex items-center gap-s6">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                    In Stock
                  </span>
                  <span className="body-small text-primary-main font-semibold">
                    ₹{product.price}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary-main/30 transition-colors disabled:opacity-50 flex-shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={(e) => { e.preventDefault(); initiatePayment(); }} className="p-s16 space-y-s16">
            
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-r12 p-s16 text-red-700 body-small">
                {errors.submit}
              </div>
            )}

            {/* Personal Details */}
            <div className="space-y-s16">
              <h3 className="heading-h6 text-main">Personal Details</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-s16">
                <InputField
                  label="Full Name *"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Enter your full name"
                  error={errors.name}
                />

                <div>
                  <label className="block body-small font-medium text-main mb-s6">
                    Phone Number *
                  </label>
                  <div className={`flex items-center gap-2 rounded-r8 border px-s16 py-s8 bg-background transition ${errors.phone ? "border-red-500" : "border-secondary-dark"}`}>
                    <Phone size={16} className="text-secondary shrink-0" />
                    <span className="body-small text-secondary">+91</span>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit number"
                      maxLength={10}
                      disabled={isSubmitting || (!!formData.phone && !needsPhone)}
                      className="bg-transparent outline-none flex-1 body-small"
                    />
                  </div>
                  {needsPhone && (
                    <p className="body-small text-primary-main mt-s6">Please add your phone number to proceed</p>
                  )}
                  {errors.phone && <p className="text-red-500 body-small mt-s6">{errors.phone}</p>}
                </div>
              </div>

              <InputField
                label="Email Address *"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isSubmitting}
                placeholder="your@email.com"
                error={errors.email}
              />
            </div>

            {/* Order Details + Shuddhikaran */}
            <div className="space-y-s16">
              <h3 className="heading-h6 text-main">Order Details</h3>
              
              <div>
                <label className="block body-small font-medium text-main mb-s6">
                  Quantity *
                </label>
                <div className="flex items-center gap-s8">
                  <button
                    type="button"
                    onClick={() => {
                      const newQty = Math.max(1, (formData.quantity || 1) - 1);
                      handleInputChange("quantity", newQty);
                    }}
                    disabled={isSubmitting || formData.quantity <= 1}
                    className="w-10 h-10 rounded-r8 border border-secondary-dark flex items-center justify-center hover:bg-secondary-main/30 transition-colors disabled:opacity-50"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 1)}
                    disabled={isSubmitting}
                    className={`w-20 px-s16 py-s8 border rounded-r8 text-center focus:outline-none transition-colors disabled:bg-gray-50 body-default ${
                      errors.quantity ? "border-red-500" : "border-secondary-dark focus:border-primary-main"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newQty = (formData.quantity || 1) + 1;
                      handleInputChange("quantity", newQty);
                    }}
                    disabled={isSubmitting}
                    className="w-10 h-10 rounded-r8 border border-secondary-dark flex items-center justify-center hover:bg-secondary-main/30 transition-colors disabled:opacity-50"
                  >
                    +
                  </button>
                  <span className="body-small text-secondary ml-s8">
                    ₹{product.price} × {formData.quantity} = ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                {errors.quantity && <p className="text-red-500 body-small mt-s6">{errors.quantity}</p>}
              </div>

              {/* ✅ Shuddhikaran Add-on */}
              <ShuddhikaranOption
                checked={shuddhikaranRequested}
                onChange={setShuddhikaranRequested}
                disabled={isSubmitting}
              />
            </div>

            {/* Delivery Address (keep your existing code) */}
            <div className="space-y-s16">
              <h3 className="heading-h6 text-main">Delivery Address</h3>

              <div className="bg-secondary-skin rounded-r16 p-s16 border border-secondary-dark">
                <div className="flex items-center gap-s8 mb-s16">
                  <span className="w-6 h-6 bg-primary-main text-background rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span className="body-small font-semibold text-main">Pin Your Exact Location</span>
                </div>

                {errors.location && (
                  <p className="body-small text-red-600 mb-s16">{errors.location}</p>
                )}

                {!mapAddress ? (
                  <button
                    type="button"
                    onClick={() => setShowMap(true)}
                    disabled={isSubmitting}
                    className={`flex items-center gap-s16 rounded-r20 border-2 ${errors.location ? 'border-red-500' : 'border-dashed border-primary-light'} bg-background px-s16 py-s16 w-full text-left hover:bg-secondary-main/20 transition-colors group disabled:opacity-50`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-main/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-main/20 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-main)" strokeWidth="2.2">
                        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="body-default font-semibold text-primary-main">📍 Pin your location on map</span>
                      <span className="body-small text-secondary">For precise delivery location</span>
                    </div>
                  </button>
                ) : (
                  <div className="rounded-r16 border border-green-300 bg-green-50 px-s16 py-s16 flex items-start gap-s16">
                    <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                    </div>
                    <div className="flex-1 flex flex-col gap-s6">
                      <span className="body-small font-semibold text-green-700">✓ Location pinned successfully</span>
                      <span className="body-small text-green-600 leading-relaxed">{mapAddress}</span>
                      <span className="body-small text-green-500/70 font-mono text-xs">
                        📍 {mapCoords?.lat.toFixed(6)}, {mapCoords?.lng.toFixed(6)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowMap(true)}
                      disabled={isSubmitting}
                      className="body-small font-medium text-primary-main hover:underline flex-shrink-0 disabled:opacity-50"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-secondary-skin rounded-r16 p-s16 border border-secondary-dark space-y-s16">
                <div className="flex items-center gap-s8">
                  <span className="w-6 h-6 bg-primary-main text-background rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span className="body-small font-semibold text-main">Complete Address Details</span>
                </div>

                <div className="grid grid-cols-3 gap-s16">
                  <div className="col-span-2">
                    <InputField
                      label="Complete Address *"
                      name="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      disabled={isSubmitting}
                      placeholder="House no., Street, Area, City, State"
                      error={errors.address}
                    />
                  </div>
                  <div>
                    <InputField
                      label="PIN Code *"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={(e) => handleInputChange("pinCode", e.target.value.replace(/\D/g, ""))}
                      disabled={isSubmitting}
                      placeholder="123456"
                      maxLength={6}
                      error={errors.pinCode}
                    />
                  </div>
                </div>

                <InputField
                  label="Landmark (Optional)"
                  name="landmark"
                  value={formData.landmark}
                  onChange={(e) => handleInputChange("landmark", e.target.value)}
                  disabled={isSubmitting}
                  placeholder="e.g., Near Metro Station, Opposite Mall"
                />
              </div>

              <div>
                <label className="block body-small font-medium text-main mb-s6">
                  Special Instructions (Optional)
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-s16 py-s8 border border-secondary-dark rounded-r8 focus:outline-none focus:border-primary-main transition-colors resize-none disabled:bg-gray-50 body-default"
                  rows={3}
                  placeholder="e.g. Leave at door, Call before delivery, etc."
                />
              </div>
            </div>

            {/* ✅ Updated Order Summary with Shuddhikaran */}
            <div className="bg-secondary-skin rounded-r16 p-s16 space-y-s16">
              <h4 className="heading-h6 text-main">Order Summary</h4>
              <div className="space-y-s8">
                <div className="flex justify-between">
                  <span className="body-default text-secondary">Product Price</span>
                  <span className="body-default text-main">₹{product.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-default text-secondary">Quantity</span>
                  <span className="body-default text-main">× {formData.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="body-default text-secondary">Subtotal</span>
                  <span className="body-default text-main">₹{subtotal.toLocaleString()}</span>
                </div>
                {shuddhikaranRequested && (
                  <div className="flex justify-between text-primary-main">
                    <span className="body-default flex items-center gap-s6">
                      <Sparkles size={14} />
                      Shuddhikaran
                    </span>
                    <span className="body-default font-medium">₹{SHUDDHIKARAN_PRICE}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="body-default text-secondary">Delivery Charges</span>
                  <span className="body-default text-green-600">Free</span>
                </div>
                {product.originalPrice && (
                  <div className="flex justify-between text-green-600">
                    <span className="body-default">Savings</span>
                    <span className="body-default font-medium">
                      ₹{((product.originalPrice - product.price) * formData.quantity).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="border-t border-secondary-dark pt-s8 flex justify-between">
                  <span className="heading-h6 text-main">Total Amount</span>
                  <span className="heading-h6 text-primary-main">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-s16 pt-s16">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-s8 justify-center">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay ₹{totalPrice.toLocaleString()}`
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
"use client";

import { CheckCircle, X, Calendar, Clock, MapPin, Phone, Package } from "lucide-react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function ConfirmationModal({ isOpen, onClose, bookingDetails }) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoHome = () => {
    onClose();
    router.push("/");
  };

  const handleViewBookings = () => {
    onClose();
    // ✅ Change to your actual orders/bookings route
    router.push("/profile/orders"); // or "/orders" or "/bookings"
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 relative animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce-once">
            <CheckCircle size={48} className="text-green-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-main mb-2">
          Booking Confirmed! 🎉
        </h2>
        <p className="text-center text-secondary mb-6">
          Your pooja has been successfully booked
        </p>

        {/* Booking Details */}
        <div className="space-y-4 bg-gray-50 p-4 sm:p-6 rounded-xl mb-6">
          <h3 className="font-semibold text-main mb-3 flex items-center gap-2">
            <Package size={18} />
            Booking Details
          </h3>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-primary-main mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-secondary">Date</p>
                <p className="font-medium text-main break-words">
                  {new Date(bookingDetails.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={20} className="text-primary-main mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-secondary">Time Slot</p>
                <p className="font-medium text-main">
                  {bookingDetails.timeSlot}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-primary-main mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-secondary">Address</p>
                <p className="font-medium text-main break-words">
                  {bookingDetails.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={20} className="text-primary-main mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-secondary">Contact</p>
                <p className="font-medium text-main">{bookingDetails.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking ID */}
        <div className="bg-primary-light p-4 rounded-lg mb-6 text-center">
          <p className="text-sm text-secondary mb-1">Booking ID</p>
          <p className="text-lg font-bold text-primary-main break-all">
            {bookingDetails.bookingId}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button onClick={handleGoHome} className="w-full">
            Go to Home
          </Button>
          <Button
            variant="outline"
            onClick={handleViewBookings}
            className="w-full"
          >
            View My Orders
          </Button>
        </div>

        {/* Note */}
        <p className="text-xs text-center text-secondary mt-4 break-words">
          A confirmation email has been sent to {bookingDetails.email}
        </p>
      </div>
    </div>
  );
}
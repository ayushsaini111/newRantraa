"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, MapPin, Phone, Mail, Download } from "lucide-react";
import Button from "@/components/ui/Button";

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Get userId from session or localStorage
      const userId = localStorage.getItem("userId");
      
      if (!userId) {
        router.push("/login");
        return;
      }

      const response = await fetch(`http://localhost:3001/api/bookings?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      CONFIRMED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-blue-100 text-blue-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading bookings...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="heading-h1 text-main mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <p className="text-xl text-secondary mb-6">No bookings yet</p>
            <Button onClick={() => router.push("/poojas")}>
              Browse Poojas
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                    <p className="text-sm text-secondary mt-2">
                      Booking ID: {booking.bookingId}
                    </p>
                  </div>
                  <p className="text-2xl font-bold">₹{booking.amount}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left */}
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      {booking.poojaImage && (
                        <div className="relative w-20 h-20 bg-gray-100 rounded-lg shrink-0">
                          <Image
                            src={booking.poojaImage}
                            alt={booking.poojaTitle}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-lg">{booking.poojaTitle}</h3>
                        <p className="text-sm text-secondary">{booking.poojaMode === "VIDEO_CALL" ? "Online" : "At Home"}</p>
                        <p className="text-sm text-secondary">{booking.duration}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-secondary">
                        <Calendar size={16} />
                        <span className="text-sm">
                          {new Date(booking.scheduledDate).toLocaleDateString("en-IN", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-secondary">
                        <Clock size={16} />
                        <span className="text-sm">{booking.timeSlot.replace(/_/g, " ")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-secondary">
                      <Phone size={16} className="mt-0.5" />
                      <span className="text-sm">{booking.customerPhone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-secondary">
                      <Mail size={16} className="mt-0.5" />
                      <span className="text-sm">{booking.customerEmail}</span>
                    </div>
                    {booking.address && (
                      <div className="flex items-start gap-2 text-secondary">
                        <MapPin size={16} className="mt-0.5" />
                        <span className="text-sm">
                          {`${booking.houseNo}, ${booking.address}${booking.landmark ? ', ' + booking.landmark : ''}, ${booking.pinCode}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download size={16} />
                    Download Receipt
                  </Button>
                  {booking.status === "CONFIRMED" && (
                    <Button>Join Video Call</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
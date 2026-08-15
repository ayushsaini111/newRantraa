"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Package, Calendar, Phone, MapPin, Clock, CheckCircle, XCircle,
  AlertCircle, ChevronDown, ChevronUp, RefreshCw, ArrowLeft,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const FILTERS = [
  { key: "ALL", label: "All", icon: "📋" },
  { key: "POOJA", label: "Poojas", icon: "🕉️" },
  { key: "PRODUCT", label: "Products", icon: "📦" },
  { key: "TALKTIME", label: "Plans", icon: "📱" },
];

const TIME_SLOTS = {
  SLOT_8_12: "8:00 AM - 12:00 PM",
  SLOT_12_15: "12:00 PM - 3:00 PM",
  SLOT_15_19: "3:00 PM - 7:00 PM",
  SLOT_19_22: "7:00 PM - 10:00 PM",
};

const STATUS_CONFIG = {
  CONFIRMED: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Confirmed" },
  PENDING: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle, label: "Pending" },
  PROCESSING: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "Processing" },
  SHIPPED: { color: "bg-purple-100 text-purple-800", icon: Package, label: "Shipped" },
  DELIVERED: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Delivered" },
  CANCELLED: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Cancelled" },
  REFUNDED: { color: "bg-gray-100 text-gray-800", icon: RefreshCw, label: "Refunded" },
  IN_PROGRESS: { color: "bg-blue-100 text-blue-800", icon: Clock, label: "In Progress" },
  COMPLETED: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Completed" },
  OUT_FOR_DELIVERY: { color: "bg-orange-100 text-orange-800", icon: Package, label: "Out" },
  IN_TRANSIT: { color: "bg-blue-100 text-blue-800", icon: Package, label: "Transit" },
  PICKED_UP: { color: "bg-purple-100 text-purple-800", icon: Package, label: "Picked" },
  ACTIVE: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Active" },
  EXPIRED: { color: "bg-gray-100 text-gray-800", icon: XCircle, label: "Expired" },
};

const TYPE_CONFIG = {
  POOJA: { color: "bg-orange-100 text-orange-800", icon: "🕉️", label: "Pooja" },
  PRODUCT: { color: "bg-purple-100 text-purple-800", icon: "📦", label: "Product" },
  TALKTIME: { color: "bg-blue-100 text-blue-800", icon: "📱", label: "Plan" },
};

// ─── Utility Functions ───────────────────────────────────────────────────────

const formatSeconds = (s) => {
  if (s >= 3600) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return s >= 60 ? `${Math.floor(s / 60)}m` : `${s}s`;
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", {
  day: "numeric", month: "short", year: "numeric"
}) : "N/A";

const formatDateTime = (d) => d ? new Date(d).toLocaleString("en-IN", {
  day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
}) : "N/A";

// ─── Shared Components ───────────────────────────────────────────────────────

const Badge = memo(({ type, status }) => {
  const config = type === "status" ? STATUS_CONFIG[status] : TYPE_CONFIG[status];
  if (!config) return null;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${config.color}`}>
      {typeof Icon === "string" ? Icon : <Icon size={11} />}
      {config.label}
    </span>
  );
});
Badge.displayName = "Badge";

const OrderImage = memo(({ src, alt, fallback }) => (
  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border">
    {src ? (
      <Image src={src} alt={alt} fill sizes="64px" className="object-cover" priority={false} />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-2xl">{fallback}</div>
    )}
  </div>
));
OrderImage.displayName = "OrderImage";

const DetailRow = memo(({ label, value, mono = false }) => value && (
  <div>
    <p className="text-xs font-semibold text-gray-700 mb-1">{label}</p>
    <p className={`text-xs text-gray-600 break-words ${mono ? "font-mono break-all" : ""}`}>{value}</p>
  </div>
));
DetailRow.displayName = "DetailRow";

// ─── Card Wrapper ────────────────────────────────────────────────────────────

const OrderCard = memo(({ order, children, expandedContent }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-3.5 sm:p-4">
        <div className="flex items-start gap-3">
          <OrderImage src={order.image} alt={order.title} fallback={TYPE_CONFIG[order.type]?.icon || "📋"} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{order.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">#{order.orderId}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <Badge status={order.type} />
                <Badge type="status" status={order.status} />
              </div>
            </div>
            {children}
          </div>
        </div>

        {expandedContent && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-800 py-1 border-t border-gray-100 transition-colors"
          >
            {expanded ? <><ChevronUp size={14} /> Less</> : <><ChevronDown size={14} /> More</>}
          </button>
        )}
      </div>

      {expanded && expandedContent && (
        <div className="border-t border-gray-100 p-3.5 sm:p-4 bg-gray-50 space-y-3">
          {expandedContent}
        </div>
      )}
    </div>
  );
});
OrderCard.displayName = "OrderCard";

// ─── Specific Order Cards ────────────────────────────────────────────────────

const PoojaCard = memo(({ order }) => {
  const { meta } = order;
  
  return (
    <OrderCard order={order} expandedContent={
      <>
        <div>
          <p className="text-xs font-semibold text-gray-700 mb-1.5">Contact</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>👤 {meta.customerName}</p>
            <p>📱 +91{meta.customerPhone}</p>
            <p className="break-all">✉️ {meta.customerEmail}</p>
          </div>
        </div>
        {meta.address && <DetailRow label="Address" value={meta.address} />}
        {meta.duration && <DetailRow label="Duration" value={meta.duration} />}
        {order.paymentId && <DetailRow label="Payment ID" value={order.paymentId} mono />}
        <DetailRow label="Ordered On" value={formatDateTime(order.createdAt)} />
      </>
    }>
      <div className="flex flex-wrap gap-2 sm:gap-3 text-xs text-gray-600 mb-2">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {formatDate(meta.scheduledDate)}
        </span>
        {meta.timeSlot && (
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {TIME_SLOTS[meta.timeSlot]}
          </span>
        )}
        <span>📍 {meta.mode === "VIDEO_CALL" ? "Online" : "Home"}</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-bold text-gray-900">₹{order.amount}</span>
        {order.discount > 0 && (
          <>
            <span className="text-xs text-gray-400 line-through">₹{order.originalPrice}</span>
            <span className="text-xs text-green-600 font-medium">−₹{order.discount}</span>
          </>
        )}
      </div>
    </OrderCard>
  );
});
PoojaCard.displayName = "PoojaCard";

const ProductCard = memo(({ order }) => {
  const { meta } = order;
  const daysLeft = meta.estimatedDelivery
    ? Math.ceil((new Date(meta.estimatedDelivery) - Date.now()) / 86400000)
    : null;

  return (
    <OrderCard order={order} expandedContent={
      <>
        <DetailRow label="Delivery Address" value={meta.address} />
        {meta.addressType === "coordinates" && meta.latitude && (
          <p className="text-xs text-gray-400 font-mono mt-1 break-all">
            GPS: {meta.latitude?.toFixed(6)}, {meta.longitude?.toFixed(6)}
          </p>
        )}
        {meta.specialRequests && <DetailRow label="Instructions" value={`"${meta.specialRequests}"`} />}
        {order.paymentId && <DetailRow label="Payment ID" value={order.paymentId} mono />}
        <DetailRow label="Ordered On" value={formatDateTime(order.createdAt)} />
      </>
    }>
      <div className="flex flex-wrap gap-2 items-center mb-2 text-xs">
        <span className="text-gray-600">Qty: {meta.quantity} × ₹{meta.unitPrice}</span>
        {meta.deliveryStatus && <Badge type="status" status={meta.deliveryStatus} />}
      </div>
      {meta.estimatedDelivery && !meta.deliveredAt && (
        <p className={`text-xs mb-1.5 ${daysLeft > 0 ? "text-blue-600" : "text-orange-600"}`}>
          {daysLeft > 0 ? `🚚 By ${formatDate(meta.estimatedDelivery)}` : "⚠️ Delayed"}
        </p>
      )}
      {meta.deliveredAt && (
        <p className="text-xs text-green-600 mb-1.5">✅ Delivered {formatDate(meta.deliveredAt)}</p>
      )}
      <p className="font-bold text-gray-900">₹{order.amount.toLocaleString()}</p>
    </OrderCard>
  );
});
ProductCard.displayName = "ProductCard";

const PlanCard = memo(({ order }) => {
  const { meta } = order;
  const daysLeft = meta.endDate ? Math.ceil((new Date(meta.endDate) - Date.now()) / 86400000) : 0;
  const used = (meta.seconds || 0) - (meta.remainingSeconds || 0);
  const progress = meta.seconds ? Math.max(0, Math.min(100, (meta.remainingSeconds / meta.seconds) * 100)) : 0;

  return (
    <OrderCard order={order} expandedContent={
      <>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <DetailRow label="Total" value={formatSeconds(meta.seconds)} />
          <DetailRow label="Used" value={formatSeconds(used)} />
          <DetailRow label="Valid" value={`${meta.validDays} days`} />
          <DetailRow label="Type" value={meta.planType || "Standard"} />
        </div>
        {meta.perDayLimit && <DetailRow label="Daily Limit" value={`${formatSeconds(meta.perDayLimit)}/day`} />}
        <DetailRow label="Valid Until" value={formatDate(meta.endDate)} />
        <DetailRow label="Purchased" value={formatDateTime(order.createdAt)} />
      </>
    }>
      {meta.isActive && (
        <div className="mb-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{formatSeconds(meta.remainingSeconds)} left</span>
            <span>{formatSeconds(meta.seconds)} total</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${progress > 20 ? "bg-blue-500" : "bg-red-500"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between flex-wrap gap-1">
        <p className="font-bold text-gray-900">₹{order.amount}</p>
        <p className={`text-xs ${meta.isActive && daysLeft <= 3 ? "text-red-600" : "text-gray-600"}`}>
          {meta.isActive
            ? daysLeft > 0 ? `${daysLeft}d left` : "Expires today!"
            : `Expired ${formatDate(meta.endDate)}`
          }
        </p>
      </div>
    </OrderCard>
  );
});
PlanCard.displayName = "PlanCard";

// ─── Other Components ────────────────────────────────────────────────────────

const EmptyState = memo(({ filter }) => {
  const configs = {
    ALL: { icon: "📋", title: "No orders yet", desc: "Your order history will appear here" },
    POOJA: { icon: "🕉️", title: "No pooja bookings", desc: "Book a pooja to see it here" },
    PRODUCT: { icon: "📦", title: "No product orders", desc: "Shop products to see orders" },
    TALKTIME: { icon: "📱", title: "No plans", desc: "Buy a plan to consult pandits" },
  };
  const config = configs[filter] || configs.ALL;

  return (
    <div className="text-center py-12 sm:py-16 px-4">
      <div className="text-5xl sm:text-6xl mb-4">{config.icon}</div>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{config.title}</h3>
      <p className="text-sm text-gray-500">{config.desc}</p>
    </div>
  );
});
EmptyState.displayName = "EmptyState";

const Skeleton = () => (
  <div className="bg-white rounded-2xl border p-3.5 sm:p-4 animate-pulse">
    <div className="flex gap-3">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function OrdersClient({ userId, session: serverSession }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [counts, setCounts] = useState({});
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState("");

  const currentUserId = session?.user?.id || userId;
  const currentUserEmail = session?.user?.email || serverSession?.user?.email || "";
  const currentUserName = session?.user?.name || serverSession?.user?.name || "";

  const fetchOrders = useCallback(async (selectedFilter, page = 1, append = false) => {
    if (!currentUserId) return;

    page === 1 ? setLoading(true) : setLoadingMore(true);
    setError("");

    try {
      const res = await fetch(
        `/backend/orders?filter=${selectedFilter}&page=${page}&limit=10`,
        {
          headers: {
            "x-user-id": currentUserId,
            "x-user-email": currentUserEmail,
            "x-user-name": currentUserName,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setOrders(prev => append ? [...prev, ...data.orders] : data.orders);
        setCounts(data.counts);
        setPagination(data.pagination);
      } else {
        setError("Failed to load orders");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentUserId, currentUserEmail, currentUserName]);

  useEffect(() => {
    fetchOrders(filter, 1, false);
  }, [filter, fetchOrders]);

  const renderCard = useMemo(() => ({
    POOJA: (order) => <PoojaCard key={order.id} order={order} />,
    PRODUCT: (order) => <ProductCard key={order.id} order={order} />,
    TALKTIME: (order) => <PlanCard key={order.id} order={order} />,
  }), []);

  return (
    <div className="min-h-screen mt-s104 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0">
              <ArrowLeft size={20} />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Orders</h1>
              <p className="text-xs text-gray-500">{counts.all ?? 0} total</p>
            </div>
            <button onClick={() => fetchOrders(filter, 1, false)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  filter === f.key ? "bg-[#8A5AB8] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.icon} {f.label}
                {counts[f.key.toLowerCase()] > 0 && f.key !== "ALL" && (
                  <span className={`px-1.5 py-0.5 rounded-full text-xs ${filter === f.key ? "bg-white/20" : "bg-white text-gray-600"}`}>
                    {counts[f.key.toLowerCase()]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
            <XCircle size={20} className="text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button onClick={() => fetchOrders(filter, 1, false)} className="text-xs text-red-600 underline mt-0.5">
                Retry
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {!loading && orders.length > 0 && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {orders.map((order) => renderCard[order.type]?.(order))}
            </div>

            {pagination.hasMore && (
              <button
                onClick={() => fetchOrders(filter, pagination.page + 1, true)}
                disabled={loadingMore}
                className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-2xl text-sm font-medium text-gray-600 hover:border-[#8A5AB8] hover:text-[#8A5AB8] transition-colors disabled:opacity-50"
              >
                {loadingMore ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  `Load ${pagination.total - orders.length} more`
                )}
              </button>
            )}

            {!pagination.hasMore && orders.length > 3 && (
              <p className="text-center text-xs text-gray-400 mt-6">All caught up 🎉</p>
            )}
          </>
        )}

        {!loading && !orders.length && !error && <EmptyState filter={filter} />}
      </div>
    </div>
  );
}
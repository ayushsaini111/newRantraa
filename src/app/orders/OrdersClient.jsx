"use client";

import { useState, useEffect, useCallback, useMemo, useRef, memo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Package, Calendar, Phone, MapPin, Clock, CheckCircle, XCircle,
  AlertCircle, ChevronDown, ChevronUp, RefreshCw, ArrowLeft,
  Sparkles, Smartphone, LayoutGrid, User, Mail, Truck, Zap,
} from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────────

const FILTERS = [
  { key: "ALL", label: "All", icon: LayoutGrid },
  { key: "POOJA", label: "Poojas", icon: Sparkles },
  { key: "PRODUCT", label: "Products", icon: Package },
  { key: "TALKTIME", label: "Plans", icon: Smartphone },
];

const TIME_SLOTS = {
  SLOT_8_12: "8:00 AM - 12:00 PM",
  SLOT_12_15: "12:00 PM - 3:00 PM",
  SLOT_15_19: "3:00 PM - 7:00 PM",
  SLOT_19_22: "7:00 PM - 10:00 PM",
};

// ✅ Re-themed using design tokens (primary-main / accent-main / red-main / secondary-*)
const STATUS_CONFIG = {
  CONFIRMED:        { style: "bg-primary-main/10 text-primary-main", icon: CheckCircle, label: "Confirmed" },
  COMPLETED:        { style: "bg-primary-main/10 text-primary-main", icon: CheckCircle, label: "Completed" },
  DELIVERED:        { style: "bg-primary-main/10 text-primary-main", icon: CheckCircle, label: "Delivered" },
  ACTIVE:           { style: "bg-primary-main/10 text-primary-main", icon: CheckCircle, label: "Active" },
  PENDING:          { style: "bg-accent-main/15 text-accent-main", icon: AlertCircle, label: "Pending" },
  PROCESSING:       { style: "bg-accent-main/15 text-accent-main", icon: Clock, label: "Processing" },
  IN_PROGRESS:      { style: "bg-accent-main/15 text-accent-main", icon: Clock, label: "In Progress" },
  SHIPPED:          { style: "bg-secondary-dark text-main", icon: Package, label: "Shipped" },
  OUT_FOR_DELIVERY: { style: "bg-accent-main/15 text-accent-main", icon: Truck, label: "Out for Delivery" },
  IN_TRANSIT:       { style: "bg-secondary-dark text-main", icon: Package, label: "In Transit" },
  PICKED_UP:        { style: "bg-secondary-dark text-main", icon: Package, label: "Picked Up" },
  CANCELLED:        { style: "bg-red-main/10 text-red-main", icon: XCircle, label: "Cancelled" },
  EXPIRED:          { style: "bg-red-main/10 text-red-main", icon: XCircle, label: "Expired" },
  REFUNDED:         { style: "bg-secondary-main/40 text-secondary", icon: RefreshCw, label: "Refunded" },
};

const TYPE_CONFIG = {
  POOJA:    { style: "bg-primary-main/10 text-primary-main", icon: Sparkles, label: "Pooja" },
  PRODUCT:  { style: "bg-accent-main/15 text-accent-main", icon: Package, label: "Product" },
  TALKTIME: { style: "bg-secondary-dark text-main", icon: Smartphone, label: "Plan" },
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
    <span className={`inline-flex items-center gap-1 px-s8 py-s6 rounded-full caption font-medium whitespace-nowrap ${config.style}`}>
      <Icon size={11} />
      {config.label}
    </span>
  );
});
Badge.displayName = "Badge";

const OrderImage = memo(({ src, alt, FallbackIcon }) => (
  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-r16 overflow-hidden bg-secondary-main/20 flex-shrink-0 border border-secondary-dark">
    {src ? (
      <Image src={src} alt={alt} fill sizes="64px" className="object-cover" priority={false} />
    ) : (
      <div className="w-full h-full flex items-center justify-center">
        <FallbackIcon size={22} className="text-secondary" />
      </div>
    )}
  </div>
));
OrderImage.displayName = "OrderImage";

const DetailRow = memo(({ label, value, mono = false, icon: Icon }) => value && (
  <div>
    <p className="caption font-semibold text-main mb-1 flex items-center gap-1">
      {Icon && <Icon size={11} className="text-secondary" />}
      {label}
    </p>
    <p className={`caption text-secondary break-words ${mono ? "font-mono break-all" : ""}`}>{value}</p>
  </div>
));
DetailRow.displayName = "DetailRow";

// ─── Card Wrapper ────────────────────────────────────────────────────────────

const OrderCard = memo(({ order, children, expandedContent }) => {
  const [expanded, setExpanded] = useState(false);
  const typeConfig = TYPE_CONFIG[order.type];

  return (
    <div className="bg-background rounded-r24 border border-secondary-dark overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-s16">
        <div className="flex items-start gap-s8">
          <OrderImage src={order.image} alt={order.title} FallbackIcon={typeConfig?.icon || Package} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-s8 mb-s8">
              <div className="min-w-0">
                <p className="body-default font-semibold  text-main w ">{order.title}</p>
                <p className="caption text-secondary mt-0.5">#{order.orderId}</p>
              </div>
              <div className="flex flex-col items-end gap-s6 shrink-0">
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
            className="mt-s16 w-full flex items-center justify-center gap-s6 caption text-secondary hover:text-main py-s6 border-t border-secondary-dark transition-colors"
          >
            {expanded ? <><ChevronUp size={14} /> Less</> : <><ChevronDown size={14} /> More</>}
          </button>
        )}
      </div>

      {expanded && expandedContent && (
        <div className="border-t border-secondary-dark p-s16 bg-secondary-main/10 space-y-s16">
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
          <p className="caption font-semibold text-main mb-s8">Contact</p>
          <div className="space-y-1 caption text-secondary">
            <p className="flex items-center gap-s6"><User size={11} /> {meta.customerName}</p>
            <p className="flex items-center gap-s6"><Phone size={11} /> +91{meta.customerPhone}</p>
            <p className="flex items-center gap-s6 break-all"><Mail size={11} /> {meta.customerEmail}</p>
          </div>
        </div>
        {meta.address && <DetailRow label="Address" value={meta.address} icon={MapPin} />}
        {meta.duration && <DetailRow label="Duration" value={meta.duration} icon={Clock} />}
        {order.paymentId && <DetailRow label="Payment ID" value={order.paymentId} mono />}
        <DetailRow label="Ordered On" value={formatDateTime(order.createdAt)} icon={Calendar} />
      </>
    }>
      <div className="flex flex-wrap gap-s16 caption text-secondary mb-s8">
        <span className="flex items-center gap-s6">
          <Calendar size={12} />
          {formatDate(meta.scheduledDate)}
        </span>
        {meta.timeSlot && (
          <span className="flex items-center gap-s6">
            <Clock size={12} />
            {TIME_SLOTS[meta.timeSlot]}
          </span>
        )}
        <span className="flex items-center gap-s6">
          <MapPin size={12} />
          {meta.mode === "VIDEO_CALL" ? "Online" : "Home"}
        </span>
      </div>
      <div className="flex items-center gap-s8 flex-wrap">
        <span className="body-default font-bold text-main">₹{order.amount}</span>
        {order.discount > 0 && (
          <>
            <span className="caption text-secondary line-through">₹{order.originalPrice}</span>
            <span className="caption text-primary-main font-medium">−₹{order.discount}</span>
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
        <DetailRow label="Delivery Address" value={meta.address} icon={MapPin} />
        {meta.addressType === "coordinates" && meta.latitude && (
          <p className="caption text-secondary/60 font-mono mt-1 break-all">
            GPS: {meta.latitude?.toFixed(6)}, {meta.longitude?.toFixed(6)}
          </p>
        )}
        {meta.specialRequests && <DetailRow label="Instructions" value={`"${meta.specialRequests}"`} />}
        {order.paymentId && <DetailRow label="Payment ID" value={order.paymentId} mono />}
        <DetailRow label="Ordered On" value={formatDateTime(order.createdAt)} icon={Calendar} />
      </>
    }>
      <div className="flex flex-wrap gap-s8 items-center mb-s8 caption">
        <span className="text-secondary">Qty: {meta.quantity} × ₹{meta.unitPrice}</span>
        {meta.deliveryStatus && <Badge type="status" status={meta.deliveryStatus} />}
      </div>
      {meta.estimatedDelivery && !meta.deliveredAt && (
        <p className={`caption mb-s6 flex items-center gap-s6 ${daysLeft > 0 ? "text-primary-main" : "text-accent-main"}`}>
          <Truck size={12} />
          {daysLeft > 0 ? `By ${formatDate(meta.estimatedDelivery)}` : "Delayed"}
        </p>
      )}
      {meta.deliveredAt && (
        <p className="caption text-primary-main mb-s6 flex items-center gap-s6">
          <CheckCircle size={12} /> Delivered {formatDate(meta.deliveredAt)}
        </p>
      )}
      <p className="body-default font-bold text-main">₹{order.amount.toLocaleString()}</p>
    </OrderCard>
  );
});
ProductCard.displayName = "ProductCard";

const PlanCard = memo(({ order }) => {
  const { meta } = order;
  const endOfExpiryDay = meta.endDate ? new Date(meta.endDate) : null;
  if (endOfExpiryDay) endOfExpiryDay.setHours(23, 59, 59, 999);
  const daysLeft = endOfExpiryDay ? Math.ceil((endOfExpiryDay - Date.now()) / 86400000) : 0;
  const used = (meta.seconds || 0) - (meta.remainingSeconds || 0);
  const progress = meta.seconds ? Math.max(0, Math.min(100, (meta.remainingSeconds / meta.seconds) * 100)) : 0;

  return (
    <OrderCard order={order} expandedContent={
      <>
        <div className="grid grid-cols-2 gap-s16">
          <DetailRow label="Total" value={formatSeconds(meta.seconds)} />
          <DetailRow label="Used" value={formatSeconds(used)} />
          <DetailRow label="Valid" value={`${meta.validDays} days`} />
          <DetailRow label="Type" value={meta.planType || "Standard"} />
        </div>
        {meta.perDayLimit && <DetailRow label="Daily Limit" value={`${formatSeconds(meta.perDayLimit)}/day`} icon={Zap} />}
        <DetailRow label="Valid Until" value={formatDate(meta.endDate)} icon={Calendar} />
        <DetailRow label="Purchased" value={formatDateTime(order.createdAt)} />
      </>
    }>
      {meta.isActive && (
        <div className="mb-s8">
          <div className="flex justify-between caption text-secondary mb-s6">
            <span>{formatSeconds(meta.remainingSeconds)} left</span>
            <span>{formatSeconds(meta.seconds)} total</span>
          </div>
          <div className="w-full h-2 bg-secondary-main/30 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${progress > 20 ? "bg-primary-main" : "bg-red-main"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between flex-wrap gap-s6">
        <p className="body-default font-bold text-main">₹{order.amount}</p>
        <p className={`caption ${meta.isActive && daysLeft <= 3 ? "text-red-main" : "text-secondary"}`}>
          {meta.isActive
            ? daysLeft > 0 ? `${daysLeft}d left` : "Expires today"
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
    ALL: { Icon: LayoutGrid, title: "No orders yet", desc: "Your order history will appear here" },
    POOJA: { Icon: Sparkles, title: "No pooja bookings", desc: "Book a pooja to see it here" },
    PRODUCT: { Icon: Package, title: "No product orders", desc: "Shop products to see orders" },
    TALKTIME: { Icon: Smartphone, title: "No plans", desc: "Buy a plan to consult pandits" },
  };
  const { Icon, title, desc } = configs[filter] || configs.ALL;

  return (
    <div className="text-center py-16 sm:py-20 px-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-s16 rounded-full bg-secondary-main/20 flex items-center justify-center">
        <Icon size={32} className="text-primary-main" strokeWidth={1.5} />
      </div>
      <h3 className="heading-h6 text-main mb-s8">{title}</h3>
      <p className="body-small text-secondary">{desc}</p>
    </div>
  );
});
EmptyState.displayName = "EmptyState";

const Skeleton = () => (
  <div className="bg-background rounded-r24 border border-secondary-dark p-s16 animate-pulse">
    <div className="flex gap-s16">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-r16 bg-secondary-main/30 shrink-0" />
      <div className="flex-1 space-y-s8">
        <div className="h-4 bg-secondary-main/30 rounded w-2/3" />
        <div className="h-3 bg-secondary-main/30 rounded w-1/3" />
        <div className="h-3 bg-secondary-main/30 rounded w-1/2" />
        <div className="h-4 bg-secondary-main/30 rounded w-1/4" />
      </div>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

export default function OrdersClient({
  userId, session: serverSession,
  initialOrders = [], initialCounts = {}, initialPagination = {},
}) {
  const { data: session } = useSession();
  const router = useRouter();

  // ✅ Pre-hydrated with server-fetched data — zero loading flash on first paint
  const [orders, setOrders] = useState(initialOrders);
  const [counts, setCounts] = useState(initialCounts);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");

  const isFirstRender = useRef(true);

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

  // ✅ Skip refetch on first mount — server already provided fresh "ALL" data
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (filter === "ALL") return;
    }
    fetchOrders(filter, 1, false);
  }, [filter, fetchOrders]);

  const renderCard = useMemo(() => ({
    POOJA: (order) => <PoojaCard key={order.id} order={order} />,
    PRODUCT: (order) => <ProductCard key={order.id} order={order} />,
    TALKTIME: (order) => <PlanCard key={order.id} order={order} />,
  }), []);

  return (
    <div className="min-h-screen mt-s104 sm:mt-s84 bg-secondary-skin/30">
      {/* Header */}
      <div className="bg-background border-b border-secondary-dark sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-s16 sm:px-s24 py-s16">
          <div className="flex items-center gap-s16">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary-main/30 transition-colors shrink-0"
            >
              <ArrowLeft size={20} className="text-main" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="heading-h5 text-main truncate">Orders</h1>
              <p className="caption text-secondary">{counts.all ?? 0} total</p>
            </div>
            <button
              onClick={() => fetchOrders(filter, 1, false)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-secondary-main/30 transition-colors shrink-0"
            >
              <RefreshCw size={18} className={`text-main ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-6xl mx-auto px-s16 sm:px-s24 pb-s16">
          <div className="flex gap-s8 overflow-x-auto hide-scrollbar -mx-1 px-1">
            {FILTERS.map((f) => {
              const Icon = f.icon;
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`flex items-center gap-s6 px-s16 py-s8 rounded-full caption font-medium whitespace-nowrap transition-all shrink-0 ${
                    active ? "bg-primary-main text-background shadow-sm" : "bg-secondary-main/20 text-secondary hover:bg-secondary-main/30"
                  }`}
                >
                  <Icon size={13} />
                  {f.label}
                  {counts[f.key.toLowerCase()] > 0 && f.key !== "ALL" && (
                    <span className={`px-s6 py-0.5 rounded-full caption ${active ? "bg-background/20" : "bg-background text-secondary"}`}>
                      {counts[f.key.toLowerCase()]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-s16 sm:px-s24 py-s16">
        {error && (
          <div className="bg-red-main/10 border border-red-main/20 rounded-r24 p-s16 mb-s16 flex items-center gap-s16">
            <XCircle size={20} className="text-red-main shrink-0" />
            <div>
              <p className="body-small font-medium text-red-main">{error}</p>
              <button onClick={() => fetchOrders(filter, 1, false)} className="caption text-red-main underline mt-1">
                Retry
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-s16">
            {[...Array(6)].map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {!loading && orders.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-s16">
              {orders.map((order) => renderCard[order.type]?.(order))}
            </div>

            {pagination.hasMore && (
              <button
                onClick={() => fetchOrders(filter, pagination.page + 1, true)}
                disabled={loadingMore}
                className="w-full mt-s16 py-s16 border-2 border-dashed border-secondary-dark rounded-r24 body-small font-medium text-secondary hover:border-primary-main hover:text-primary-main transition-colors disabled:opacity-50"
              >
                {loadingMore ? (
                  <span className="flex items-center justify-center gap-s8">
                    <RefreshCw size={16} className="animate-spin" />
                    Loading...
                  </span>
                ) : (
                  `Load ${pagination.total - orders.length} more`
                )}
              </button>
            )}

            {!pagination.hasMore && orders.length > 3 && (
              <p className="text-center caption text-secondary/60 mt-s24">You're all caught up</p>
            )}
          </>
        )}

        {!loading && !orders.length && !error && <EmptyState filter={filter} />}
      </div>
    </div>
  );
}
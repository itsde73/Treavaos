import { useState } from "react";
import {
  Truck, Phone, Globe, ShoppingBag, UtensilsCrossed,
  Timer, CheckCircle, XCircle, Clock, RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";

// ─── Types ───────────────────────────────────────────────────────────────────

type Platform = "Zomato" | "Swiggy" | "Own Website" | "Phone/WhatsApp" | "Counter Takeaway";
type OrderType = "delivery" | "pickup";
type OrderStatus =
  | "incoming"
  | "preparing"
  | "ready"
  | "packed"
  | "dispatched"
  | "delivered"
  | "rejected";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  platform: Platform;
  customer: string;
  phone: string;
  amount: number;
  status: OrderStatus;
  type: OrderType;
  items: OrderItem[];
  placedAt: Date;
  prepTime?: number;       // minutes
  acceptedAt?: Date;
  riderName?: string;
  token?: number;
  rejectReason?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const now = new Date();
const minsAgo = (m: number) => new Date(now.getTime() - m * 60_000);

const INITIAL_ORDERS: Order[] = [
  {
    id: "ZOM-4821",
    platform: "Zomato",
    customer: "Arjun Mehta",
    phone: "+91 98765 43210",
    amount: 1180,
    status: "incoming",
    type: "delivery",
    items: [
      { name: "Paneer Butter Masala", qty: 1, price: 320 },
      { name: "Dal Makhani", qty: 1, price: 280 },
      { name: "Butter Naan", qty: 4, price: 140 },
      { name: "Gulab Jamun", qty: 2, price: 120 },
      { name: "Lassi", qty: 2, price: 120 },
    ],
    placedAt: minsAgo(2),
  },
  {
    id: "SWG-7743",
    platform: "Swiggy",
    customer: "Priya Sharma",
    phone: "+91 87654 32109",
    amount: 870,
    status: "incoming",
    type: "delivery",
    items: [
      { name: "Chicken Biryani", qty: 1, price: 380 },
      { name: "Raita", qty: 1, price: 80 },
      { name: "Tandoori Roti", qty: 3, price: 90 },
      { name: "Cold Drink", qty: 2, price: 80 },
      { name: "Kheer", qty: 1, price: 120 },
      { name: "Paan Mukhwas", qty: 1, price: 40 },
    ],
    placedAt: minsAgo(4),
  },
  {
    id: "WEB-1092",
    platform: "Own Website",
    customer: "Rohit Verma",
    phone: "+91 76543 21098",
    amount: 650,
    status: "incoming",
    type: "pickup",
    items: [
      { name: "Chole Bhature", qty: 2, price: 260 },
      { name: "Aloo Tikki Chaat", qty: 1, price: 150 },
      { name: "Nimbu Pani", qty: 2, price: 80 },
      { name: "Gajar Halwa", qty: 1, price: 120 },
    ],
    placedAt: minsAgo(1),
    token: 14,
  },
  {
    id: "PHN-3314",
    platform: "Phone/WhatsApp",
    customer: "Sunita Patel",
    phone: "+91 65432 10987",
    amount: 1450,
    status: "preparing",
    type: "pickup",
    items: [
      { name: "Mutton Rogan Josh", qty: 1, price: 520 },
      { name: "Jeera Rice", qty: 2, price: 220 },
      { name: "Garlic Naan", qty: 4, price: 200 },
      { name: "Kulfi Falooda", qty: 2, price: 220 },
      { name: "Salad", qty: 1, price: 80 },
      { name: "Papad", qty: 2, price: 40 },
    ],
    placedAt: minsAgo(18),
    prepTime: 25,
    acceptedAt: minsAgo(17),
    token: 15,
  },
  {
    id: "ZOM-4799",
    platform: "Zomato",
    customer: "Kiran Reddy",
    phone: "+91 54321 09876",
    amount: 990,
    status: "preparing",
    type: "delivery",
    items: [
      { name: "Fish Curry", qty: 1, price: 420 },
      { name: "Steamed Rice", qty: 2, price: 180 },
      { name: "Prawn Masala", qty: 1, price: 390 },
    ],
    placedAt: minsAgo(22),
    prepTime: 30,
    acceptedAt: minsAgo(20),
    riderName: "Ramesh (Zomato)",
  },
  {
    id: "SWG-7701",
    platform: "Swiggy",
    customer: "Meena Iyer",
    phone: "+91 43210 98765",
    amount: 560,
    status: "ready",
    type: "delivery",
    items: [
      { name: "Masala Dosa", qty: 2, price: 240 },
      { name: "Idli Sambar", qty: 2, price: 180 },
      { name: "Filter Coffee", qty: 2, price: 100 },
    ],
    placedAt: minsAgo(35),
    prepTime: 20,
    acceptedAt: minsAgo(34),
    riderName: "Suresh (Swiggy)",
  },
  {
    id: "CTR-0051",
    platform: "Counter Takeaway",
    customer: "Walk-in Customer",
    phone: "—",
    amount: 320,
    status: "packed",
    type: "pickup",
    items: [
      { name: "Veg Thali", qty: 1, price: 220 },
      { name: "Buttermilk", qty: 2, price: 60 },
      { name: "Papad", qty: 2, price: 40 },
    ],
    placedAt: minsAgo(40),
    prepTime: 15,
    acceptedAt: minsAgo(39),
    token: 16,
  },
  {
    id: "WEB-1088",
    platform: "Own Website",
    customer: "Deepak Nair",
    phone: "+91 32109 87654",
    amount: 2100,
    status: "delivered",
    type: "delivery",
    items: [
      { name: "Chicken Tikka Masala", qty: 2, price: 860 },
      { name: "Lamb Seekh Kebab", qty: 4, price: 680 },
      { name: "Tandoori Roti", qty: 6, price: 180 },
      { name: "Gulab Jamun", qty: 4, price: 240 },
      { name: "Mango Lassi", qty: 2, price: 140 },
    ],
    placedAt: minsAgo(90),
    prepTime: 30,
    acceptedAt: minsAgo(88),
    riderName: "Vikram (Own Fleet)",
  },
  {
    id: "ZOM-4788",
    platform: "Zomato",
    customer: "Ananya Das",
    phone: "+91 21098 76543",
    amount: 480,
    status: "rejected",
    type: "delivery",
    items: [
      { name: "Egg Biryani", qty: 1, price: 320 },
      { name: "Raita", qty: 1, price: 80 },
      { name: "Soft Drink", qty: 1, price: 80 },
    ],
    placedAt: minsAgo(75),
    rejectReason: "Restaurant too busy",
  },
];

// ─── Platform Config ──────────────────────────────────────────────────────────

const PLATFORM_CONFIG: Record<
  Platform,
  { color: string; badgeClass: string; icon: React.ReactNode; accent: string }
> = {
  Zomato: {
    color: "text-red-600",
    badgeClass: "bg-red-100 text-red-700 border-red-200",
    icon: <ShoppingBag className="w-4 h-4" />,
    accent: "border-l-red-500",
  },
  Swiggy: {
    color: "text-orange-600",
    badgeClass: "bg-orange-100 text-orange-700 border-orange-200",
    icon: <Truck className="w-4 h-4" />,
    accent: "border-l-orange-500",
  },
  "Own Website": {
    color: "text-blue-600",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <Globe className="w-4 h-4" />,
    accent: "border-l-blue-500",
  },
  "Phone/WhatsApp": {
    color: "text-green-600",
    badgeClass: "bg-green-100 text-green-700 border-green-200",
    icon: <Phone className="w-4 h-4" />,
    accent: "border-l-green-500",
  },
  "Counter Takeaway": {
    color: "text-purple-600",
    badgeClass: "bg-purple-100 text-purple-700 border-purple-200",
    icon: <UtensilsCrossed className="w-4 h-4" />,
    accent: "border-l-purple-500",
  },
};

// ─── Aggregator Stats ─────────────────────────────────────────────────────────

const AGGREGATOR_STATS: {
  platform: Platform;
  ordersToday: number;
  revenueToday: number;
  acceptanceRate: number;
}[] = [
  { platform: "Zomato",           ordersToday: 38, revenueToday: 42800, acceptanceRate: 94 },
  { platform: "Swiggy",           ordersToday: 31, revenueToday: 36200, acceptanceRate: 91 },
  { platform: "Own Website",      ordersToday: 14, revenueToday: 22600, acceptanceRate: 98 },
  { platform: "Phone/WhatsApp",   ordersToday: 9,  revenueToday: 14500, acceptanceRate: 100 },
  { platform: "Counter Takeaway", ordersToday: 22, revenueToday: 18400, acceptanceRate: 100 },
];

const PREP_TIME_OPTIONS = [15, 20, 25, 30, 45, 60];

const REJECT_REASONS = [
  "Out of stock",
  "Restaurant too busy",
  "Items unavailable",
  "Other",
];

const STATUS_FLOW: OrderStatus[] = [
  "preparing", "ready", "packed", "dispatched", "delivered",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTimerState(order: Order): "cooking" | "ready" | "overdue" | null {
  if (!order.acceptedAt || !order.prepTime) return null;
  if (order.status === "ready" || order.status === "packed" ||
      order.status === "dispatched" || order.status === "delivered") return null;
  const elapsed = (now.getTime() - order.acceptedAt.getTime()) / 60_000;
  if (elapsed > order.prepTime) return "overdue";
  if (elapsed >= order.prepTime) return "ready";
  return "cooking";
}

function getRemainingMins(order: Order): number {
  if (!order.acceptedAt || !order.prepTime) return 0;
  const elapsed = (now.getTime() - order.acceptedAt.getTime()) / 60_000;
  return Math.max(0, Math.round(order.prepTime - elapsed));
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function nextStatus(current: OrderStatus): OrderStatus | null {
  const idx = STATUS_FLOW.indexOf(current);
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  incoming:   "Incoming",
  preparing:  "Preparing",
  ready:      "Ready",
  packed:     "Packed",
  dispatched: "Dispatched",
  delivered:  "Delivered",
  rejected:   "Rejected",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  incoming:   "bg-yellow-100 text-yellow-800 border-yellow-200",
  preparing:  "bg-blue-100 text-blue-800 border-blue-200",
  ready:      "bg-green-100 text-green-800 border-green-200",
  packed:     "bg-teal-100 text-teal-800 border-teal-200",
  dispatched: "bg-purple-100 text-purple-800 border-purple-200",
  delivered:  "bg-gray-100 text-gray-700 border-gray-200",
  rejected:   "bg-red-100 text-red-700 border-red-200",
};

// ─── Timer Badge ──────────────────────────────────────────────────────────────

function TimerBadge({ order }: { order: Order }) {
  const state = getTimerState(order);
  if (!state) return null;
  const remaining = getRemainingMins(order);

  if (state === "overdue")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">
        🔴 OVERDUE
      </span>
    );
  if (state === "ready")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">
        🟢 FOOD READY
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">
      🟡 COOKING · {remaining}m left
    </span>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

interface OrderCardProps {
  order: Order;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onAdvance?: (id: string) => void;
}

function OrderCard({ order, onAccept, onReject, onAdvance }: OrderCardProps) {
  const cfg = PLATFORM_CONFIG[order.platform];
  const next = nextStatus(order.status);

  return (
    <Card className={`shadow-sm border-l-4 ${cfg.accent}`}>
      <CardContent className="p-4 space-y-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-semibold text-sm">#{order.id}</span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium ${cfg.badgeClass}`}
            >
              {cfg.icon}
              {order.platform}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium ${STATUS_COLOR[order.status]}`}
            >
              {STATUS_LABEL[order.status]}
            </span>
            {order.type === "delivery" ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs">
                <Truck className="w-3 h-3" /> Delivery
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs">
                <UtensilsCrossed className="w-3 h-3" /> Pickup
                {order.token && (
                  <strong className="ml-1">Token #{order.token}</strong>
                )}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatTime(order.placedAt)}
          </span>
        </div>

        {/* Customer & amount */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">{order.customer}</p>
            <p className="text-xs text-muted-foreground">{order.phone}</p>
          </div>
          <p className="text-lg font-bold">₹{order.amount.toLocaleString("en-IN")}</p>
        </div>

        {/* Items */}
        <div className="bg-muted/40 rounded p-2 space-y-1">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span>
                {item.qty}× {item.name}
              </span>
              <span className="text-muted-foreground">₹{item.price}</span>
            </div>
          ))}
        </div>

        {/* Rider / Reject reason */}
        {order.riderName && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="w-3 h-3" />
            Rider: <span className="font-medium text-foreground">{order.riderName}</span>
          </div>
        )}
        {order.rejectReason && (
          <p className="text-xs text-red-600">Reason: {order.rejectReason}</p>
        )}

        {/* Prep timer */}
        {order.status !== "incoming" && order.status !== "rejected" && (
          <div className="flex items-center gap-2">
            {order.prepTime && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" /> Target: {order.prepTime}m
              </span>
            )}
            <TimerBadge order={order} />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          {order.status === "incoming" && (
            <>
              <Button
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => onAccept?.(order.id)}
              >
                <CheckCircle className="w-3 h-3 mr-1" /> Accept
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                onClick={() => onReject?.(order.id)}
              >
                <XCircle className="w-3 h-3 mr-1" /> Reject
              </Button>
            </>
          )}
          {order.status !== "incoming" &&
            order.status !== "delivered" &&
            order.status !== "rejected" &&
            next && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => onAdvance?.(order.id)}
              >
                <RefreshCw className="w-3 h-3 mr-1" /> Mark as {STATUS_LABEL[next]}
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Aggregator Dashboard Cards ───────────────────────────────────────────────

function AggregatorDashboard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {AGGREGATOR_STATS.map((stat) => {
        const cfg = PLATFORM_CONFIG[stat.platform];
        const avg = Math.round(stat.revenueToday / stat.ordersToday);
        return (
          <Card key={stat.platform} className={`shadow-sm border-t-4 ${cfg.accent.replace("border-l-", "border-t-")}`}>
            <CardContent className="p-4 space-y-3">
              <div className={`flex items-center gap-2 font-semibold text-sm ${cfg.color}`}>
                {cfg.icon}
                {stat.platform}
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                <div>
                  <p className="text-muted-foreground">Orders today</p>
                  <p className="text-xl font-bold text-foreground">{stat.ordersToday}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Revenue</p>
                  <p className="text-base font-semibold text-foreground">
                    ₹{(stat.revenueToday / 1000).toFixed(1)}K
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg order</p>
                  <p className="font-semibold text-foreground">₹{avg}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Acceptance</p>
                  <p className={`font-semibold ${stat.acceptanceRate >= 95 ? "text-green-600" : "text-amber-600"}`}>
                    {stat.acceptanceRate}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function OnlineOrders() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // Accept dialog
  const [acceptTarget, setAcceptTarget] = useState<string | null>(null);
  const [selectedPrepTime, setSelectedPrepTime] = useState<string>("20");

  // Reject dialog
  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");

  function handleOpenAccept(id: string) {
    setSelectedPrepTime("20");
    setAcceptTarget(id);
  }

  function handleConfirmAccept() {
    if (!acceptTarget) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === acceptTarget
          ? {
              ...o,
              status: "preparing",
              prepTime: parseInt(selectedPrepTime, 10),
              acceptedAt: new Date(),
            }
          : o,
      ),
    );
    setAcceptTarget(null);
  }

  function handleOpenReject(id: string) {
    setSelectedReason("");
    setRejectTarget(id);
  }

  function handleConfirmReject() {
    if (!rejectTarget || !selectedReason) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.id === rejectTarget
          ? { ...o, status: "rejected", rejectReason: selectedReason }
          : o,
      ),
    );
    setRejectTarget(null);
  }

  function handleAdvance(id: string) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next = nextStatus(o.status);
        return next ? { ...o, status: next } : o;
      }),
    );
  }

  const liveOrders    = orders.filter((o) => o.status === "incoming");
  const activeOrders  = orders.filter((o) =>
    ["preparing", "ready", "packed", "dispatched"].includes(o.status),
  );
  const historyOrders = orders.filter((o) =>
    ["delivered", "rejected"].includes(o.status),
  );

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Online Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage incoming orders across all platforms
          </p>
        </div>
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" /> Sync Orders
        </Button>
      </div>

      {/* Aggregator Dashboard */}
      <AggregatorDashboard />

      {/* Order Tabs */}
      <Tabs defaultValue="live">
        <TabsList>
          <TabsTrigger value="live">
            🔴 Live
            {liveOrders.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                {liveOrders.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="active">
            🟡 Active ({activeOrders.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            📋 History ({historyOrders.length})
          </TabsTrigger>
        </TabsList>

        {/* Live Tab */}
        <TabsContent value="live" className="mt-4">
          {liveOrders.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-muted-foreground">
                <Timer className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-lg font-medium">No incoming orders</p>
                <p className="text-sm mt-1">New orders will appear here in real-time.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {liveOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAccept={handleOpenAccept}
                  onReject={handleOpenReject}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Active Tab */}
        <TabsContent value="active" className="mt-4">
          {activeOrders.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-muted-foreground">
                <p className="text-lg font-medium">No active orders</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {activeOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAdvance={handleAdvance}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-4">
          {historyOrders.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center text-muted-foreground">
                <p className="text-lg font-medium">No order history yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {historyOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Accept Dialog */}
      <Dialog open={!!acceptTarget} onOpenChange={(open) => !open && setAcceptTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Accept Order #{acceptTarget}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="prep-time">Set Preparation Time</Label>
              <Select value={selectedPrepTime} onValueChange={setSelectedPrepTime}>
                <SelectTrigger id="prep-time">
                  <SelectValue placeholder="Select prep time" />
                </SelectTrigger>
                <SelectContent>
                  {PREP_TIME_OPTIONS.map((t) => (
                    <SelectItem key={t} value={String(t)}>
                      {t} minutes
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptTarget(null)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleConfirmAccept}
            >
              <CheckCircle className="w-4 h-4 mr-1" /> Confirm Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectTarget} onOpenChange={(open) => !open && setRejectTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reject Order #{rejectTarget}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="reject-reason">Reason for Rejection</Label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger id="reject-reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {REJECT_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!selectedReason}
              onClick={handleConfirmReject}
            >
              <XCircle className="w-4 h-4 mr-1" /> Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

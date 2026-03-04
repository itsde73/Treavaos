import { useState } from "react";
import { Clock, User, MapPin, MoreVertical, Filter, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

type OrderStatus = "pending" | "preparing" | "ready" | "served" | "billed" | "voided";

interface TimelineEntry {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

interface Order {
  id: string;
  table: string;
  type: string;
  items: number;
  itemsList: string[];
  kotNumber: string;
  amount: number;
  status: OrderStatus;
  waiter: string;
  time: string;
  placedAt: string;
  timeline: TimelineEntry[];
}

const initialOrders: Order[] = [
  {
    id: "#ORD-1245",
    table: "Table 5",
    type: "Dine-in",
    items: 5,
    itemsList: ["Butter Chicken", "Garlic Naan x2", "Dal Makhani", "Lassi"],
    kotNumber: "KOT-301",
    amount: 1250,
    status: "preparing",
    waiter: "John Doe",
    time: "10 min ago",
    placedAt: "12:45 PM",
    timeline: [
      { status: "pending", timestamp: "12:45 PM", note: "Order placed" },
      { status: "preparing", timestamp: "12:46 PM", note: "KOT sent to kitchen" },
    ],
  },
  {
    id: "#ORD-1246",
    table: "Table 12",
    type: "Dine-in",
    items: 3,
    itemsList: ["Paneer Tikka", "Roti x2", "Raita"],
    kotNumber: "KOT-302",
    amount: 890,
    status: "ready",
    waiter: "Sarah Smith",
    time: "5 min ago",
    placedAt: "12:50 PM",
    timeline: [
      { status: "pending", timestamp: "12:50 PM", note: "Order placed" },
      { status: "preparing", timestamp: "12:51 PM", note: "KOT sent to kitchen" },
      { status: "ready", timestamp: "12:55 PM", note: "Ready for pickup" },
    ],
  },
  {
    id: "#ORD-1247",
    table: "Delivery",
    type: "Delivery",
    items: 7,
    itemsList: ["Chicken Biryani", "Seekh Kebab x2", "Naan x3", "Gulab Jamun"],
    kotNumber: "KOT-303",
    amount: 2340,
    status: "preparing",
    waiter: "Mike Johnson",
    time: "15 min ago",
    placedAt: "12:40 PM",
    timeline: [
      { status: "pending", timestamp: "12:40 PM", note: "Order placed" },
      { status: "preparing", timestamp: "12:41 PM", note: "KOT sent to kitchen" },
    ],
  },
  {
    id: "#ORD-1248",
    table: "Takeaway",
    type: "Takeaway",
    items: 2,
    itemsList: ["Veg Burger", "Fries"],
    kotNumber: "KOT-304",
    amount: 450,
    status: "ready",
    waiter: "Emily Brown",
    time: "2 min ago",
    placedAt: "12:53 PM",
    timeline: [
      { status: "pending", timestamp: "12:53 PM", note: "Order placed" },
      { status: "preparing", timestamp: "12:54 PM", note: "KOT sent to kitchen" },
      { status: "ready", timestamp: "12:55 PM", note: "Ready for pickup" },
    ],
  },
];

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  served: "bg-purple-100 text-purple-800",
  billed: "bg-gray-100 text-gray-800",
  voided: "bg-red-100 text-red-800",
};

const LIFECYCLE: OrderStatus[] = ["pending", "preparing", "ready", "served", "billed"];

const VOID_REASONS = [
  "Wrong item",
  "Guest changed mind",
  "Quality issue",
  "Kitchen error",
];

function OrderCard({
  order,
  onViewDetails,
  onVoid,
  onAdvanceStatus,
}: {
  order: Order;
  onViewDetails: (order: Order) => void;
  onVoid: (order: Order) => void;
  onAdvanceStatus: (orderId: string) => void;
}) {
  const nextStatusIndex = LIFECYCLE.indexOf(order.status) + 1;
  const nextStatus = nextStatusIndex < LIFECYCLE.length ? LIFECYCLE[nextStatusIndex] : null;

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{order.id}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails(order)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>Print KOT</DropdownMenuItem>
              {nextStatus && (
                <DropdownMenuItem onClick={() => onAdvanceStatus(order.id)}>
                  Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onVoid(order)}
              >
                Void Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={statusColors[order.status]}>{order.status}</Badge>
          <Badge variant="outline">{order.type}</Badge>
        </div>
        <div className="space-y-1 text-sm">
          <div className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
            {order.kotNumber}
          </div>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-0.5">
            {order.itemsList.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {order.table}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="w-4 h-4" />
            {order.waiter}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            {order.time} · Placed {order.placedAt}
          </div>
        </div>
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {order.items} items
            </span>
            <span className="font-semibold">₹{order.amount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedTab, setSelectedTab] = useState("all");

  // Timeline dialog
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);

  // Void dialog
  const [voidOrder, setVoidOrder] = useState<Order | null>(null);
  const [voidReason, setVoidReason] = useState("");
  const [managerPin, setManagerPin] = useState("");
  const [voidError, setVoidError] = useState("");

  // NOTE: In production, manager PIN validation should be done server-side.
  const MANAGER_PIN = "1234";

  function getNow() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function advanceOrderState(o: Order): Order {
    const idx = LIFECYCLE.indexOf(o.status);
    if (idx < 0 || idx >= LIFECYCLE.length - 1) return o;
    const next = LIFECYCLE[idx + 1];
    return { ...o, status: next, timeline: [...o.timeline, { status: next, timestamp: getNow() }] };
  }

  function handleAdvanceStatus(orderId: string) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? advanceOrderState(o) : o))
    );
    if (detailsOrder?.id === orderId) {
      setDetailsOrder((prev) => (prev ? advanceOrderState(prev) : prev));
    }
  }

  function handleCloseVoidDialog() {
    setVoidOrder(null);
    setVoidReason("");
    setManagerPin("");
    setVoidError("");
  }

  function handleVoidConfirm() {
    if (managerPin !== MANAGER_PIN) {
      setVoidError("Incorrect manager PIN.");
      return;
    }
    if (!voidReason) {
      setVoidError("Please select a reason.");
      return;
    }
    const now = getNow();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === voidOrder?.id
          ? {
              ...o,
              status: "voided",
              timeline: [
                ...o.timeline,
                { status: "voided", timestamp: now, note: `Voided: ${voidReason}` },
              ],
            }
          : o
      )
    );
    handleCloseVoidDialog();
  }

  function handleOpenVoid(o: Order) {
    setVoidOrder(o);
    setVoidError("");
  }

  function renderOrderGrid(filtered: Order[]) {
    if (filtered.length === 0) {
      return (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">No orders found.</p>
          </CardContent>
        </Card>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onViewDetails={setDetailsOrder}
            onVoid={handleOpenVoid}
            onAdvanceStatus={handleAdvanceStatus}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Order Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all orders in real-time
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button>New Order</Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="dine-in">Dine-in</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="takeaway">Takeaway</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {renderOrderGrid(orders)}
        </TabsContent>

        <TabsContent value="dine-in" className="space-y-4">
          {renderOrderGrid(orders.filter((o) => o.type === "Dine-in"))}
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4">
          {renderOrderGrid(orders.filter((o) => o.type === "Delivery"))}
        </TabsContent>

        <TabsContent value="takeaway" className="space-y-4">
          {renderOrderGrid(orders.filter((o) => o.type === "Takeaway"))}
        </TabsContent>
      </Tabs>

      {/* Timeline / Details Dialog */}
      <Dialog open={!!detailsOrder} onOpenChange={(open) => !open && setDetailsOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Order Details — {detailsOrder?.id}
            </DialogTitle>
          </DialogHeader>
          {detailsOrder && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={statusColors[detailsOrder.status]}>{detailsOrder.status}</Badge>
                <Badge variant="outline">{detailsOrder.type}</Badge>
                <span className="text-sm text-muted-foreground">{detailsOrder.kotNumber}</span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" /> {detailsOrder.table}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" /> {detailsOrder.waiter}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Items</p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-0.5">
                  {detailsOrder.itemsList.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Order Timeline</p>
                <ol className="space-y-2">
                  {detailsOrder.timeline.map((entry, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      {i === detailsOrder.timeline.length - 1 ? (
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                      )}
                      <div>
                        <span className="font-medium capitalize">{entry.status}</span>
                        {entry.note && <span className="text-muted-foreground"> — {entry.note}</span>}
                        <div className="text-xs text-muted-foreground">{entry.timestamp}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              {(() => {
                const nextIdx = LIFECYCLE.indexOf(detailsOrder.status) + 1;
                if (nextIdx <= 0 || nextIdx >= LIFECYCLE.length || detailsOrder.status === "voided") return null;
                const nextLabel = LIFECYCLE[nextIdx].charAt(0).toUpperCase() + LIFECYCLE[nextIdx].slice(1);
                return (
                  <Button className="w-full" onClick={() => handleAdvanceStatus(detailsOrder.id)}>
                    Mark as {nextLabel}
                  </Button>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Void Order Dialog */}
      <Dialog open={!!voidOrder} onOpenChange={(open) => { if (!open) handleCloseVoidDialog(); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Void Order — {voidOrder?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="void-reason">Reason</Label>
              <Select value={voidReason} onValueChange={setVoidReason}>
                <SelectTrigger id="void-reason">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {VOID_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="manager-pin">Manager PIN</Label>
              <Input
                id="manager-pin"
                type="password"
                placeholder="Enter manager PIN"
                value={managerPin}
                onChange={(e) => setManagerPin(e.target.value)}
              />
            </div>
            {voidError && <p className="text-sm text-destructive">{voidError}</p>}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCloseVoidDialog}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleVoidConfirm}>
                Void Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>KOT</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Table/Location</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Waiter</TableHead>
                <TableHead>Time</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.kotNumber}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>{order.table}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>₹{order.amount}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>{order.waiter}</TableCell>
                  <TableCell>{order.time}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setDetailsOrder(order)}>
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

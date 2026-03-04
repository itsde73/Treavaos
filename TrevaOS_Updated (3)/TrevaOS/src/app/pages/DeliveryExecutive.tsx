import { useState } from "react";
import { Bike, Star, MapPin, Phone, Plus, Clock, Package, Timer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

type VehicleType = "Bike" | "Scooter" | "Bicycle";
type ExecutiveStatus = "on-delivery" | "available" | "off-duty";

interface ActiveOrder {
  orderNo: string;
  customerAddress: string;
  eta: string;
  assignedAt: string; // ISO timestamp
}

interface Executive {
  id: number;
  name: string;
  phone: string;
  status: ExecutiveStatus;
  vehicle: VehicleType;
  zone: string;
  completedToday: number;
  avgDeliveryTime: string;
  rating: number;
  activeOrder: ActiveOrder | null;
}

interface PendingOrder {
  id: string;
  orderNo: string;
  customerAddress: string;
  zone: string;
}

const initialExecutives: Executive[] = [
  {
    id: 1, name: "Ravi Kumar", phone: "+91 98765 11111", status: "on-delivery",
    vehicle: "Bike", zone: "North Zone", completedToday: 8, avgDeliveryTime: "22 min", rating: 4.8,
    activeOrder: { orderNo: "#4521", customerAddress: "12 MG Road, North Delhi", eta: "10 min", assignedAt: new Date(Date.now() - 18 * 60000).toISOString() },
  },
  {
    id: 2, name: "Suresh Yadav", phone: "+91 87654 22222", status: "available",
    vehicle: "Scooter", zone: "South Zone", completedToday: 12, avgDeliveryTime: "18 min", rating: 4.9,
    activeOrder: null,
  },
  {
    id: 3, name: "Mohan Das", phone: "+91 76543 33333", status: "on-delivery",
    vehicle: "Bicycle", zone: "East Zone", completedToday: 6, avgDeliveryTime: "28 min", rating: 4.6,
    activeOrder: { orderNo: "#4518", customerAddress: "5 Park Street, East Delhi", eta: "5 min", assignedAt: new Date(Date.now() - 25 * 60000).toISOString() },
  },
  {
    id: 4, name: "Arun Singh", phone: "+91 65432 44444", status: "off-duty",
    vehicle: "Bike", zone: "West Zone", completedToday: 0, avgDeliveryTime: "20 min", rating: 4.7,
    activeOrder: null,
  },
  {
    id: 5, name: "Kiran Patil", phone: "+91 54321 55555", status: "available",
    vehicle: "Scooter", zone: "Central", completedToday: 9, avgDeliveryTime: "15 min", rating: 4.5,
    activeOrder: null,
  },
];

const pendingOrdersData: PendingOrder[] = [
  { id: "p1", orderNo: "#4525", customerAddress: "88 Lajpat Nagar, South Delhi", zone: "South Zone" },
  { id: "p2", orderNo: "#4526", customerAddress: "33 Rohini Sector 7, North Delhi", zone: "North Zone" },
  { id: "p3", orderNo: "#4527", customerAddress: "9 Vasant Kunj, Central", zone: "Central" },
  { id: "p4", orderNo: "#4528", customerAddress: "21 Preet Vihar, East Delhi", zone: "East Zone" },
];

const statusStyle: Record<ExecutiveStatus, string> = {
  "on-delivery": "bg-blue-100 text-blue-700",
  "available": "bg-green-100 text-green-700",
  "off-duty": "bg-gray-100 text-gray-600",
};

const statusLabel: Record<ExecutiveStatus, string> = {
  "on-delivery": "On Delivery",
  "available": "Available",
  "off-duty": "Off Duty",
};

const vehicleIcon: Record<VehicleType, string> = {
  Bike: "🏍️",
  Scooter: "🛵",
  Bicycle: "🚲",
};

function getElapsed(isoTimestamp: string): string {
  const diffMs = Date.now() - new Date(isoTimestamp).getTime();
  const mins = Math.floor(diffMs / 60000);
  return mins < 1 ? "< 1 min" : `${mins} min`;
}

const ALL_ZONES = "All Zones";

export function DeliveryExecutive() {
  const [executives, setExecutives] = useState<Executive[]>(initialExecutives);
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>(pendingOrdersData);
  const [zoneFilter, setZoneFilter] = useState<string>(ALL_ZONES);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedExecId, setSelectedExecId] = useState<string>("");

  const zones = [ALL_ZONES, ...Array.from(new Set(executives.map(e => e.zone)))];
  const filteredExecutives = zoneFilter === ALL_ZONES
    ? executives
    : executives.filter(e => e.zone === zoneFilter);

  const activeDeliveries = executives.filter(e => e.status === "on-delivery" && e.activeOrder);

  function handleAssignOrder() {
    if (!selectedOrderId || !selectedExecId) return;
    const order = pendingOrders.find(o => o.id === selectedOrderId);
    const execId = parseInt(selectedExecId);
    if (!order) return;

    setExecutives(prev => prev.map(e =>
      e.id === execId
        ? {
            ...e,
            status: "on-delivery",
            activeOrder: {
              orderNo: order.orderNo,
              customerAddress: order.customerAddress,
              eta: "25 min",
              assignedAt: new Date().toISOString(),
            },
          }
        : e
    ));
    setPendingOrders(prev => prev.filter(o => o.id !== selectedOrderId));
    setSelectedOrderId("");
    setSelectedExecId("");
    setAssignDialogOpen(false);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Delivery Executives</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your delivery team</p>
        </div>
        <Button className="gap-2" onClick={() => setAssignDialogOpen(true)}>
          <Plus className="w-4 h-4" />Assign Order
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Executives", value: executives.length, color: "text-blue-600" },
          { label: "Available", value: executives.filter(e => e.status === "available").length, color: "text-green-600" },
          { label: "On Delivery", value: executives.filter(e => e.status === "on-delivery").length, color: "text-amber-600" },
          { label: "Deliveries Today", value: executives.reduce((a, e) => a + e.completedToday, 0), color: "text-purple-600" },
        ].map(s => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Zone filter */}
      <div className="flex items-center gap-3">
        <Label className="text-sm font-medium shrink-0">Filter by Zone:</Label>
        <Select value={zoneFilter} onValueChange={setZoneFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {zones.map(z => (
              <SelectItem key={z} value={z}>{z}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {zoneFilter !== ALL_ZONES && (
          <Button variant="outline" size="sm" onClick={() => setZoneFilter(ALL_ZONES)}>Clear</Button>
        )}
      </div>

      {/* Executive cards */}
      <div className="grid grid-cols-2 gap-4">
        {filteredExecutives.map(exec => (
          <Card key={exec.id} className="shadow-sm">
            <CardContent className="py-4 space-y-3">
              {/* Top row: avatar + info + status badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                    {vehicleIcon[exec.vehicle]}
                  </div>
                  <div>
                    <p className="font-semibold">{exec.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3" />{exec.phone}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />{exec.zone}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Vehicle: {exec.vehicle}</p>
                  </div>
                </div>
                <Badge className={`text-xs ${statusStyle[exec.status]}`}>
                  {statusLabel[exec.status]}
                </Badge>
              </div>

              {/* Active order info */}
              {exec.activeOrder && (
                <div className="bg-blue-50 rounded-md px-3 py-2 text-xs space-y-1">
                  <p className="font-medium text-blue-700 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />Current Order: {exec.activeOrder.orderNo}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{exec.activeOrder.customerAddress}
                  </p>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />ETA: {exec.activeOrder.eta}
                  </p>
                </div>
              )}

              {/* Performance metrics */}
              <div className="pt-2 border-t grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-green-600">{exec.completedToday}</p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-blue-600 flex items-center justify-center gap-0.5">
                    <Timer className="w-3.5 h-3.5" />{exec.avgDeliveryTime}
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Time</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-amber-600 flex items-center justify-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />{exec.rating}
                  </p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active deliveries panel */}
      {activeDeliveries.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />Active Deliveries
              <Badge className="bg-blue-100 text-blue-700 ml-1">{activeDeliveries.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {activeDeliveries.map(exec => (
                <div key={exec.id} className="py-3 grid grid-cols-5 gap-3 text-sm items-center">
                  <div className="font-medium">{exec.name}</div>
                  <div className="text-muted-foreground">{exec.activeOrder!.orderNo}</div>
                  <div className="text-muted-foreground flex items-center gap-1 col-span-2">
                    <MapPin className="w-3 h-3 shrink-0" />{exec.activeOrder!.customerAddress}
                  </div>
                  <div className="flex flex-col gap-0.5 text-right">
                    <span className="text-blue-600 font-medium flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />ETA: {exec.activeOrder!.eta}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                      <Timer className="w-3 h-3" />Elapsed: {getElapsed(exec.activeOrder!.assignedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assign Order Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Order to Executive</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Select Pending Order</Label>
              <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an order..." />
                </SelectTrigger>
                <SelectContent>
                  {pendingOrders.length === 0 && (
                    <SelectItem value="none" disabled>No pending orders</SelectItem>
                  )}
                  {pendingOrders.map(o => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.orderNo} — {o.customerAddress}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Select Executive</Label>
              <Select value={selectedExecId} onValueChange={setSelectedExecId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an executive..." />
                </SelectTrigger>
                <SelectContent>
                  {executives.filter(e => e.status === "available").map(e => (
                    <SelectItem key={e.id} value={String(e.id)}>
                      {e.name} — {e.zone} ({e.vehicle})
                    </SelectItem>
                  ))}
                  {executives.filter(e => e.status === "available").length === 0 && (
                    <SelectItem value="none" disabled>No available executives</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAssignOrder}
              disabled={!selectedOrderId || !selectedExecId}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

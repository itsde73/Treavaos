import { Bike, Star, MapPin, Phone, Plus, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const executives = [
  { id: 1, name: "Ravi Kumar", phone: "+91 98765 11111", status: "on-delivery", activeOrders: 2, completedToday: 8, rating: 4.8, zone: "North Zone" },
  { id: 2, name: "Suresh Yadav", phone: "+91 87654 22222", status: "available", activeOrders: 0, completedToday: 12, rating: 4.9, zone: "South Zone" },
  { id: 3, name: "Mohan Das", phone: "+91 76543 33333", status: "on-delivery", activeOrders: 1, completedToday: 6, rating: 4.6, zone: "East Zone" },
  { id: 4, name: "Arun Singh", phone: "+91 65432 44444", status: "offline", activeOrders: 0, completedToday: 0, rating: 4.7, zone: "West Zone" },
  { id: 5, name: "Kiran Patil", phone: "+91 54321 55555", status: "available", activeOrders: 0, completedToday: 9, rating: 4.5, zone: "Central" },
];

const statusStyle: Record<string, string> = {
  "on-delivery": "bg-blue-100 text-blue-700",
  "available": "bg-green-100 text-green-700",
  "offline": "bg-gray-100 text-gray-600",
};

export function DeliveryExecutive() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Delivery Executives</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your delivery team</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" />Add Executive</Button>
      </div>

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

      <div className="grid grid-cols-2 gap-4">
        {executives.map(exec => (
          <Card key={exec.id} className="shadow-sm">
            <CardContent className="py-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bike className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{exec.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" />{exec.phone}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{exec.zone}</p>
                  </div>
                </div>
                <Badge className={`text-xs ${statusStyle[exec.status]}`}>{exec.status}</Badge>
              </div>
              <div className="mt-3 pt-3 border-t grid grid-cols-3 gap-2 text-center">
                <div><p className="text-lg font-bold text-blue-600">{exec.activeOrders}</p><p className="text-xs text-muted-foreground">Active</p></div>
                <div><p className="text-lg font-bold text-green-600">{exec.completedToday}</p><p className="text-xs text-muted-foreground">Today</p></div>
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
    </div>
  );
}

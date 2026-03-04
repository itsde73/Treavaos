import { useState } from "react";
import { Bell, CheckCircle, Clock, User, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const requests = [
  { id: 1, table: "Table 3", type: "Order Request", message: "Ready to order", time: "2 min ago", status: "pending", priority: "high" },
  { id: 2, table: "Table 7", type: "Bill Request", message: "Please bring the bill", time: "5 min ago", status: "pending", priority: "high" },
  { id: 3, table: "Table 1", type: "Water Refill", message: "Need water refill", time: "8 min ago", status: "in-progress", priority: "medium" },
  { id: 4, table: "Table 12", type: "Extra Napkins", message: "Extra napkins needed", time: "12 min ago", status: "pending", priority: "low" },
  { id: 5, table: "Table 5", type: "Order Request", message: "Ready to order dessert", time: "15 min ago", status: "completed", priority: "medium" },
  { id: 6, table: "Table 9", type: "Complaint", message: "Food taking too long", time: "3 min ago", status: "pending", priority: "high" },
];

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

export function WaiterRequests() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Waiter Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time requests from tables</p>
        </div>
        <div className="flex items-center gap-2">
          {pending > 0 && <Badge className="bg-red-100 text-red-700 gap-1"><AlertCircle className="w-3 h-3" />{pending} Pending</Badge>}
          <Button variant="outline" size="sm">Mark All Done</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Pending", value: requests.filter(r => r.status === "pending").length, color: "text-yellow-600" },
          { label: "In Progress", value: requests.filter(r => r.status === "in-progress").length, color: "text-blue-600" },
          { label: "Completed", value: requests.filter(r => r.status === "completed").length, color: "text-green-600" },
          { label: "Avg Response", value: "4 min", color: "text-purple-600" },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-sm">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        {["all", "pending", "in-progress", "completed"].map((s) => (
          <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" onClick={() => setFilter(s)} className="capitalize">
            {s === "all" ? "All" : s}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((req) => (
          <Card key={req.id} className={`shadow-sm border-l-4 ${req.priority === "high" ? "border-l-red-400" : req.priority === "medium" ? "border-l-amber-400" : "border-l-green-400"}`}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{req.table}</span>
                      <span className="text-sm text-muted-foreground">·</span>
                      <span className="text-sm font-medium">{req.type}</span>
                      <Badge variant="outline" className={`text-xs ${priorityColors[req.priority]}`}>{req.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{req.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge className={`text-xs ${statusColors[req.status]}`}>{req.status}</Badge>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="w-3 h-3" />{req.time}</p>
                  </div>
                  {req.status !== "completed" && (
                    <div className="flex gap-2">
                      {req.status === "pending" && <Button size="sm" variant="outline">Assign</Button>}
                      <Button size="sm" className="gap-1"><CheckCircle className="w-3.5 h-3.5" />Done</Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

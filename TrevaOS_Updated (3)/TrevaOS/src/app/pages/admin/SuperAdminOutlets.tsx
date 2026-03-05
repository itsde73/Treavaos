import { Building2, Search, Filter, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { useState } from "react";

const PLATFORM_OUTLETS = [
  { id: 1, name: "Downtown Bistro", location: "MG Road, Bangalore", status: "active", plan: "Pro", monthlyRevenue: 485000, todayRevenue: 45231, todayOrders: 267, tables: 24, staff: 18, healthScore: 94, joinedDate: "2025-06-15", ownerName: "Rajesh Kumar", ownerEmail: "owner@downtown.com" },
  { id: 2, name: "Mall Express", location: "Phoenix Mall, Mumbai", status: "active", plan: "Enterprise", monthlyRevenue: 380000, todayRevenue: 38500, todayOrders: 198, tables: 16, staff: 12, healthScore: 88, joinedDate: "2025-08-20", ownerName: "Priya Sharma", ownerEmail: "owner@mall.com" },
  { id: 3, name: "Airport Lounge", location: "T2, Delhi Airport", status: "active", plan: "Enterprise", monthlyRevenue: 620000, todayRevenue: 52800, todayOrders: 312, tables: 32, staff: 28, healthScore: 96, joinedDate: "2025-04-10", ownerName: "Vikram Patel", ownerEmail: "owner@airport.com" },
  { id: 4, name: "Cloud Kitchen HQ", location: "HSR Layout, Bangalore", status: "trial", plan: "Basic", monthlyRevenue: 185000, todayRevenue: 18200, todayOrders: 145, tables: 0, staff: 8, healthScore: 72, joinedDate: "2026-02-01", ownerName: "Anita Desai", ownerEmail: "owner@cloudkitchen.com" },
  { id: 5, name: "Seaside Cafe", location: "Marine Drive, Mumbai", status: "active", plan: "Pro", monthlyRevenue: 290000, todayRevenue: 28400, todayOrders: 156, tables: 20, staff: 14, healthScore: 91, joinedDate: "2025-10-05", ownerName: "Suresh Nair", ownerEmail: "owner@seaside.com" },
  { id: 6, name: "Heritage Restaurant", location: "Connaught Place, Delhi", status: "inactive", plan: "Pro", monthlyRevenue: 0, todayRevenue: 0, todayOrders: 0, tables: 30, staff: 22, healthScore: 0, joinedDate: "2025-03-18", ownerName: "Meera Joshi", ownerEmail: "owner@heritage.com" },
];

const statusColors: Record<string, string> = {
  active:   "bg-green-100 text-green-700 border-green-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
  trial:    "bg-amber-100 text-amber-700 border-amber-200",
};

const planColors: Record<string, string> = {
  Basic:      "bg-blue-100 text-blue-700 border-blue-200",
  Pro:        "bg-purple-100 text-purple-700 border-purple-200",
  Enterprise: "bg-orange-100 text-orange-700 border-orange-200",
};

export function SuperAdminOutlets() {
  const [search, setSearch] = useState("");

  const filtered = PLATFORM_OUTLETS.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.location.toLowerCase().includes(search.toLowerCase()) ||
    o.ownerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Outlets</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage all outlets on the TrevaOS platform</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {PLATFORM_OUTLETS.filter(o => o.status === "active").length} Active
        </Badge>
      </div>

      {/* Search & filter bar */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search outlets, locations, owners..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Outlets table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-4 h-4" /> All Outlets ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Outlet</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Plan</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Monthly Rev.</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Today Orders</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Health</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Owner</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(outlet => (
                  <tr key={outlet.id} className="border-b last:border-0 hover:bg-muted/20 cursor-pointer transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{outlet.name}</p>
                      <p className="text-xs text-muted-foreground">{outlet.location}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs capitalize ${statusColors[outlet.status]}`}>
                        {outlet.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${planColors[outlet.plan]}`}>
                        {outlet.plan}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {outlet.monthlyRevenue > 0 ? `₹${(outlet.monthlyRevenue / 1000).toFixed(0)}K` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">{outlet.todayOrders || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {outlet.healthScore >= 90 ? <TrendingUp className="w-3 h-3 text-green-500" /> :
                         outlet.healthScore >= 60 ? <Activity className="w-3 h-3 text-amber-500" /> :
                         <TrendingDown className="w-3 h-3 text-red-500" />}
                        <span className={outlet.healthScore >= 90 ? "text-green-600" : outlet.healthScore >= 60 ? "text-amber-600" : "text-red-600"}>
                          {outlet.healthScore > 0 ? `${outlet.healthScore}%` : "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{outlet.ownerName}</p>
                      <p className="text-xs text-muted-foreground">{outlet.ownerEmail}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

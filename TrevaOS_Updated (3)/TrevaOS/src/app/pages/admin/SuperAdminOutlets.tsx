import { Building2, Search, Filter, TrendingUp, TrendingDown, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { PLATFORM_OUTLETS, STATUS_COLORS, PLAN_COLORS } from "./adminData";

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
                      <Badge variant="outline" className={`text-xs capitalize ${STATUS_COLORS[outlet.status]}`}>
                        {outlet.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${PLAN_COLORS[outlet.plan]}`}>
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

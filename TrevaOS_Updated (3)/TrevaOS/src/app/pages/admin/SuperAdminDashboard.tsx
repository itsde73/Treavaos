import { useState } from "react";
import {
  Building2, TrendingUp, ShoppingCart, CreditCard,
  AlertCircle, CheckCircle, Clock, ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  PLATFORM_OUTLETS, DEMO_TICKETS,
  STATUS_COLORS, PLAN_COLORS, PRIORITY_COLORS, TICKET_STATUS_COLORS,
} from "./adminData";

// ── Chart data ─────────────────────────────────────────────────────────────────

const REVENUE_TREND_DAILY = [
  { date: "Feb 27", revenue: 183231 },
  { date: "Feb 28", revenue: 197854 },
  { date: "Mar 01", revenue: 215300 },
  { date: "Mar 02", revenue: 189700 },
  { date: "Mar 03", revenue: 221400 },
  { date: "Mar 04", revenue: 198600 },
  { date: "Mar 05", revenue: 183131 },
];

const REVENUE_TREND_WEEKLY = [
  { date: "W1 Feb", revenue: 1245000 },
  { date: "W2 Feb", revenue: 1380000 },
  { date: "W3 Feb", revenue: 1290000 },
  { date: "W4 Feb", revenue: 1410000 },
  { date: "W1 Mar", revenue: 1189216 },
];

const REVENUE_TREND_MONTHLY = [
  { date: "Oct", revenue: 4850000 },
  { date: "Nov", revenue: 5200000 },
  { date: "Dec", revenue: 6100000 },
  { date: "Jan", revenue: 5600000 },
  { date: "Feb", revenue: 5960000 },
];

const OUTLET_REVENUE = PLATFORM_OUTLETS
  .filter(o => o.monthlyRevenue > 0)
  .map(o => ({ name: o.name.split(" ")[0], revenue: o.monthlyRevenue }));

const SUBSCRIPTION_DIST = [
  { name: "Basic", value: 1, color: "#60a5fa" },
  { name: "Pro", value: 3, color: "#a855f7" },
  { name: "Enterprise", value: 2, color: "#f97316" },
];

const RECENT_ALERTS = [
  { type: "info",    message: "New outlet signup: Cloud Kitchen HQ (Trial started)",         time: "2h ago" },
  { type: "warning", message: "Heritage Restaurant: Subscription payment overdue by 15 days", time: "5h ago" },
  { type: "error",   message: "Airport Lounge: High error rate detected on POS terminal",     time: "8h ago" },
  { type: "success", message: "Downtown Bistro: Successfully upgraded to Pro plan",           time: "1d ago" },
  { type: "info",    message: "Seaside Cafe: New staff members added (3)",                    time: "1d ago" },
];

const alertIconMap: Record<string, { icon: typeof AlertCircle; color: string }> = {
  error:   { icon: AlertCircle, color: "text-red-500"   },
  warning: { icon: AlertCircle, color: "text-amber-500" },
  success: { icon: CheckCircle, color: "text-green-500" },
  info:    { icon: Clock,       color: "text-blue-500"  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export function SuperAdminDashboard() {
  const [trendPeriod, setTrendPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  const trendData =
    trendPeriod === "daily"   ? REVENUE_TREND_DAILY   :
    trendPeriod === "weekly"  ? REVENUE_TREND_WEEKLY  : REVENUE_TREND_MONTHLY;

  const totalRevToday    = PLATFORM_OUTLETS.reduce((s, o) => s + o.todayRevenue, 0);
  const totalOrdersToday = PLATFORM_OUTLETS.reduce((s, o) => s + o.todayOrders, 0);
  const activeOutlets    = PLATFORM_OUTLETS.filter(o => o.status === "active").length;
  const activeSubs       = PLATFORM_OUTLETS.filter(o => o.status === "active").length;

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Platform Overview</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Real-time analytics across all TrevaOS outlets</p>
      </div>

      {/* ── Section 1: KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Outlets",      value: activeOutlets,                          sub: "+1 this month",    icon: Building2,    color: "text-blue-500",   bg: "bg-blue-50"   },
          { label: "Total Revenue Today", value: `₹${(totalRevToday / 1000).toFixed(1)}K`, sub: "+8.3% vs yesterday", icon: TrendingUp,   color: "text-green-500",  bg: "bg-green-50"  },
          { label: "Total Orders Today",  value: totalOrdersToday,                       sub: "Across all outlets", icon: ShoppingCart, color: "text-purple-500", bg: "bg-purple-50" },
          { label: "Active Subscriptions",value: activeSubs,                             sub: `${PLATFORM_OUTLETS.filter(o => o.status === "trial").length} on trial`, icon: CreditCard, color: "text-orange-500", bg: "bg-orange-50" },
        ].map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{kpi.label}</p>
              <p className="text-xs text-green-600 mt-1">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Section 2: Revenue Trend Chart ── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Platform Revenue Trend</CardTitle>
          <Tabs value={trendPeriod} onValueChange={v => setTrendPeriod(v as typeof trendPeriod)}>
            <TabsList className="h-7">
              <TabsTrigger value="daily"   className="text-xs px-3 h-6">Daily</TabsTrigger>
              <TabsTrigger value="weekly"  className="text-xs px-3 h-6">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs px-3 h-6">Monthly</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [`₹${(v / 1000).toFixed(1)}K`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Section 3: Outlet Performance Table ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Outlet Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  {["Outlet", "Status", "Plan", "Monthly Rev.", "Today's Rev.", "Today's Orders", "Health"].map(h => (
                    <th key={h} className={`px-4 py-3 font-medium text-muted-foreground ${["Monthly Rev.", "Today's Rev.", "Today's Orders", "Health"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLATFORM_OUTLETS.map(outlet => (
                  <tr key={outlet.id} className="border-b last:border-0 hover:bg-muted/20 cursor-pointer transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{outlet.name}</p>
                      <p className="text-xs text-muted-foreground">{outlet.location}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs capitalize ${STATUS_COLORS[outlet.status]}`}>{outlet.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${PLAN_COLORS[outlet.plan]}`}>{outlet.plan}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {outlet.monthlyRevenue > 0 ? `₹${(outlet.monthlyRevenue / 1000).toFixed(0)}K` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {outlet.todayRevenue > 0 ? `₹${(outlet.todayRevenue / 1000).toFixed(1)}K` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">{outlet.todayOrders || "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-semibold ${outlet.healthScore >= 90 ? "text-green-600" : outlet.healthScore >= 60 ? "text-amber-600" : "text-red-600"}`}>
                        {outlet.healthScore > 0 ? `${outlet.healthScore}%` : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Section 4: Two side-by-side charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue by Outlet (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={OUTLET_REVENUE} margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`₹${(v / 1000).toFixed(0)}K`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Subscription Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={SUBSCRIPTION_DIST} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {SUBSCRIPTION_DIST.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Section 5: Recent Activity ── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Platform Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {RECENT_ALERTS.map((alert, i) => {
            const { icon: Icon, color } = alertIconMap[alert.type] ?? alertIconMap.info;
            return (
              <div key={i} className="flex items-start gap-3 py-2 border-b last:border-0">
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
                <p className="text-sm flex-1">{alert.message}</p>
                <span className="text-xs text-muted-foreground flex-shrink-0">{alert.time}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ── Section 6: Support Tickets Panel ── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Recent Support Tickets</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
              {DEMO_TICKETS.filter(t => t.status === "open").length} Open
            </Badge>
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
              {DEMO_TICKETS.filter(t => t.status === "pending" || t.status === "in-progress").length} Pending
            </Badge>
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              {DEMO_TICKETS.filter(t => t.status === "resolved").length} Resolved
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {DEMO_TICKETS.map(ticket => (
              <div key={ticket.id} className="px-4 py-3 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">{ticket.id}</span>
                      <Badge variant="outline" className={`text-xs ${PRIORITY_COLORS[ticket.priority]}`}>{ticket.priority}</Badge>
                      <Badge variant="outline" className={`text-xs capitalize ${TICKET_STATUS_COLORS[ticket.status]}`}>
                        {ticket.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="font-medium text-sm">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ticket.outlet} · {ticket.created} · {ticket.assignee}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="sm" variant="outline" className="h-7 text-xs px-2">View</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs px-2">Assign</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

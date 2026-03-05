import { BarChart3, TrendingUp, Activity, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const MONTHLY_DATA = [
  { month: "Sep", revenue: 1450000, orders: 4200, outlets: 3 },
  { month: "Oct", revenue: 1620000, orders: 4700, outlets: 4 },
  { month: "Nov", revenue: 1780000, orders: 5100, outlets: 4 },
  { month: "Dec", revenue: 2100000, orders: 6200, outlets: 5 },
  { month: "Jan", revenue: 1850000, orders: 5400, outlets: 5 },
  { month: "Feb", revenue: 1960000, orders: 5800, outlets: 6 },
  { month: "Mar", revenue: 2080000, orders: 6100, outlets: 6 },
];

const OUTLET_GROWTH = [
  { month: "Sep", new: 1 },
  { month: "Oct", new: 1 },
  { month: "Nov", new: 0 },
  { month: "Dec", new: 1 },
  { month: "Jan", new: 0 },
  { month: "Feb", new: 1 },
  { month: "Mar", new: 0 },
];

export function SuperAdminAnalytics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Platform Analytics</h1>
        <p className="text-muted-foreground text-sm mt-0.5">In-depth analysis of platform performance</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Platform Revenue", value: "₹1.96Cr", change: "+12.4%", icon: TrendingUp, color: "text-green-500" },
          { label: "Total Orders (Feb)", value: "5,800", change: "+7.4%", icon: Activity, color: "text-blue-500" },
          { label: "Avg Orders/Outlet", value: "967", change: "+5.2%", icon: BarChart3, color: "text-purple-500" },
          { label: "Active Users", value: "102", change: "+8.1%", icon: Users, color: "text-orange-500" },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <k.icon className={`w-5 h-5 ${k.color}`} />
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">{k.change}</span>
              </div>
              <p className="text-xl font-bold">{k.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Platform Revenue Trend (7 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [`₹${(v/1000).toFixed(0)}K`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Orders vs Outlets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Monthly Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MONTHLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Outlet Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={OUTLET_GROWTH}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="new" name="New Outlets" fill="#22c55e" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

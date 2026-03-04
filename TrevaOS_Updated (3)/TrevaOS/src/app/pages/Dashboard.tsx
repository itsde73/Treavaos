import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  DollarSign,
  Package,
  AlertTriangle,
  Wine,
  Utensils,
  ShoppingCart,
  Truck,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const revenueData = [
  { date: "Mon", revenue: 24500, orders: 145 },
  { date: "Tue", revenue: 28900, orders: 168 },
  { date: "Wed", revenue: 32100, orders: 189 },
  { date: "Thu", revenue: 29800, orders: 175 },
  { date: "Fri", revenue: 38400, orders: 223 },
  { date: "Sat", revenue: 45200, orders: 267 },
  { date: "Sun", revenue: 41800, orders: 245 },
];

const orderTypeData = [
  { name: "Dine-in", value: 45, color: "#2563EB" },
  { name: "Delivery", value: 35, color: "#10B981" },
  { name: "Takeaway", value: 20, color: "#F59E0B" },
];

const outletPerformance = [
  { outlet: "Downtown", revenue: 125000, growth: 12 },
  { outlet: "Mall", revenue: 98000, growth: 8 },
  { outlet: "Airport", revenue: 156000, growth: 15 },
  { outlet: "Cloud Kitchen", revenue: 87000, growth: -3 },
];

const topItems = [
  { name: "Margherita Pizza", sold: 234, revenue: 46800 },
  { name: "Chicken Burger", sold: 189, revenue: 37800 },
  { name: "Caesar Salad", sold: 156, revenue: 31200 },
  { name: "Pasta Alfredo", sold: 145, revenue: 29000 },
  { name: "Chocolate Cake", sold: 134, revenue: 13400 },
];

const inventoryAlerts = [
  { item: "Tomatoes", current: 5, unit: "kg", status: "critical" },
  { item: "Cheese", current: 12, unit: "kg", status: "low" },
  { item: "Chicken", current: 8, unit: "kg", status: "low" },
  { item: "Olive Oil", current: 3, unit: "L", status: "critical" },
];

const sectionRevenueData = [
  { section: "Dine-In", revenue: 182400, orders: 423, growth: 14, color: "#2563EB", icon: "Utensils" },
  { section: "Bar", revenue: 74400, orders: 170, growth: 18, color: "#9333ea", icon: "Wine" },
  { section: "Takeaway", revenue: 48200, orders: 198, growth: 6, color: "#F59E0B", icon: "ShoppingCart" },
  { section: "Delivery", revenue: 63800, orders: 241, growth: -4, color: "#10B981", icon: "Truck" },
  { section: "Banquet", revenue: 94500, orders: 12, growth: 22, color: "#EF4444", icon: "Building2" },
  { section: "Online Order", revenue: 37100, orders: 156, growth: 9, color: "#06B6D4", icon: "Package" },
];

const sectionBarData = sectionRevenueData.map(s => ({ name: s.section, revenue: s.revenue, orders: s.orders }));

const staffPerformance = [
  { name: "John Doe", orders: 89, revenue: 22450, rating: 4.8 },
  { name: "Sarah Smith", orders: 76, revenue: 19800, rating: 4.9 },
  { name: "Mike Johnson", orders: 67, revenue: 17340, rating: 4.7 },
  { name: "Emily Brown", orders: 54, revenue: 14580, rating: 4.6 },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Report</Button>
          <Button>View Details</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Today's Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">₹45,231</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">+12.5%</span>
              <span className="text-sm text-muted-foreground">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">267</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">+8.2%</span>
              <span className="text-sm text-muted-foreground">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Customers
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">1,234</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">-2.4%</span>
              <span className="text-sm text-muted-foreground">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Order
            </CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">₹169</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">+5.1%</span>
              <span className="text-sm text-muted-foreground">from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Revenue Overview</CardTitle>
            <Tabs defaultValue="week" className="w-auto">
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ fill: "#2563EB" }}
              />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: "#10B981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Type Breakdown */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Order Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={orderTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {orderTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Outlet Performance */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Outlet Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={outletPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="outlet" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="revenue" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Items */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Top Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.sold} sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{item.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Inventory Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {inventoryAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div>
                    <p className="font-medium">{alert.item}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.current} {alert.unit} remaining
                    </p>
                  </div>
                  <Badge
                    variant={
                      alert.status === "critical" ? "destructive" : "secondary"
                    }
                  >
                    {alert.status === "critical" ? "Critical" : "Low Stock"}
                  </Badge>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section-wise Revenue */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              Revenue by Section
            </CardTitle>
            <span className="text-sm text-muted-foreground">Today's breakdown</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {sectionRevenueData.map((section) => (
              <div key={section.section} className="text-center p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: section.color + "18" }}>
                  {section.icon === "Utensils" && <Utensils className="w-5 h-5" style={{ color: section.color }} />}
                  {section.icon === "Wine" && <Wine className="w-5 h-5" style={{ color: section.color }} />}
                  {section.icon === "ShoppingCart" && <ShoppingCart className="w-5 h-5" style={{ color: section.color }} />}
                  {section.icon === "Truck" && <Truck className="w-5 h-5" style={{ color: section.color }} />}
                  {section.icon === "Building2" && <Building2 className="w-5 h-5" style={{ color: section.color }} />}
                  {section.icon === "Package" && <Package className="w-5 h-5" style={{ color: section.color }} />}
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{section.section}</p>
                <p className="text-base font-bold" style={{ color: section.color }}>₹{(section.revenue / 1000).toFixed(1)}k</p>
                <p className="text-xs text-muted-foreground">{section.orders} orders</p>
                <div className={`flex items-center justify-center gap-0.5 mt-1 text-xs font-medium ${section.growth >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {section.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(section.growth)}%
                </div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sectionBarData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {sectionBarData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={sectionRevenueData[index].color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Staff Performance */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Staff Performance Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {staffPerformance.map((staff, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-card"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {staff.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <Badge variant="secondary">⭐ {staff.rating}</Badge>
                </div>
                <p className="font-medium mb-1">{staff.name}</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>{staff.orders} orders</p>
                  <p className="font-semibold text-foreground">
                    ₹{staff.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

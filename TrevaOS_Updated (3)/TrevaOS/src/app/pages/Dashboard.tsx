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
  Trophy,
  MapPin,
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
import { useStaff } from "../context/StaffContext";

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

// ── HQ / All-Outlets mock data ────────────────────────────────────────────────

const hqOutlets = [
  {
    id: 1, name: "Downtown Bistro", address: "MG Road, Bangalore",
    status: "open" as const, revenue: 125000, orders: 423, avgTicket: 295,
    tablesOccupied: 18, tablesTotal: 24, staff: 12,
    trend: 12, color: "#2563EB",
  },
  {
    id: 2, name: "Mall Express", address: "Phoenix Mall, Mumbai",
    status: "open" as const, revenue: 98000, orders: 567, avgTicket: 173,
    tablesOccupied: 14, tablesTotal: 16, staff: 8,
    trend: 8, color: "#10B981",
  },
  {
    id: 3, name: "Airport Lounge", address: "T2, Delhi Airport",
    status: "pre-open" as const, revenue: 156000, orders: 312, avgTicket: 500,
    tablesOccupied: 16, tablesTotal: 20, staff: 6,
    trend: 15, color: "#F59E0B",
  },
  {
    id: 4, name: "Cloud Kitchen HQ", address: "HSR Layout, Bangalore",
    status: "open" as const, revenue: 87000, orders: 445, avgTicket: 195,
    tablesOccupied: 0, tablesTotal: 0, staff: 5,
    trend: -3, color: "#EF4444",
  },
];

const hqWeeklyRevenue = [
  { date: "Mon", downtown: 18000, mall: 14000, airport: 22000, cloud: 12000 },
  { date: "Tue", downtown: 21000, mall: 16500, airport: 25000, cloud: 13500 },
  { date: "Wed", downtown: 23000, mall: 15000, airport: 28000, cloud: 11000 },
  { date: "Thu", downtown: 19500, mall: 17000, airport: 24000, cloud: 12500 },
  { date: "Fri", downtown: 28000, mall: 20000, airport: 32000, cloud: 15000 },
  { date: "Sat", downtown: 34000, mall: 24000, airport: 38000, cloud: 17000 },
  { date: "Sun", downtown: 31000, mall: 22000, airport: 35000, cloud: 16000 },
];

const hqSectionRevenue = [
  { name: "Dine-in",  value: 210000, color: "#2563EB" },
  { name: "Delivery", value: 145000, color: "#10B981" },
  { name: "Takeaway", value: 82000,  color: "#F59E0B" },
  { name: "Bar",      value: 129000, color: "#9333EA" },
];

const hqAlerts = [
  { outlet: "Downtown Bistro",  item: "Tomatoes",  current: 5,  unit: "kg",  status: "critical" },
  { outlet: "Mall Express",     item: "Chicken",   current: 8,  unit: "kg",  status: "low"      },
  { outlet: "Airport Lounge",   item: "Olive Oil", current: 3,  unit: "L",   status: "critical" },
  { outlet: "Cloud Kitchen HQ", item: "Cheese",    current: 12, unit: "kg",  status: "low"      },
];

export function Dashboard() {
  const { currentStaff } = useStaff();
  const isAdminOrManager = currentStaff.role === "Admin" || currentStaff.role === "Manager";
  const topOutlet = hqOutlets.reduce((a, b) => (a.revenue > b.revenue ? a : b));
  const totalStaff = hqOutlets.reduce((s, o) => s + o.staff, 0);

  const thisOutletContent = (
    <div className="space-y-6">
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

  if (!isAdminOrManager) {
    return (
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Report</Button>
            <Button>View Details</Button>
          </div>
        </div>
        {thisOutletContent}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Report</Button>
          <Button>View Details</Button>
        </div>
      </div>

      <Tabs defaultValue="outlet">
        <TabsList>
          <TabsTrigger value="outlet">This Outlet</TabsTrigger>
          <TabsTrigger value="hq">HQ Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="outlet" className="mt-4">
          {thisOutletContent}
        </TabsContent>

        <TabsContent value="hq" className="mt-4 space-y-6">
          {/* Top Performing Outlet */}
          <Card className="shadow-sm border-amber-200 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Top Performing Outlet Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">🏆</div>
                <div>
                  <p className="text-xl font-bold">{topOutlet.name}</p>
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />{topOutlet.address}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-bold text-amber-600">₹{(topOutlet.revenue / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-muted-foreground">{topOutlet.orders} orders · avg ₹{topOutlet.avgTicket}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Outlet Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {hqOutlets.map((outlet) => (
              <Card key={outlet.id} className="shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <CardTitle className="text-sm font-bold leading-tight">{outlet.name}</CardTitle>
                      <p className="text-xs text-muted-foreground flex items-center gap-0.5 mt-0.5">
                        <MapPin className="w-3 h-3" />{outlet.address}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs shrink-0 ${
                        outlet.status === "open" ? "bg-green-100 text-green-700" :
                        outlet.status === "pre-open" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}
                    >
                      {outlet.status === "open" ? "🟢 Open" : outlet.status === "pre-open" ? "🟡 Pre-Open" : "🔴 Closed"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-muted rounded-lg p-2">
                      <p className="font-bold text-sm">₹{(outlet.revenue / 1000).toFixed(0)}K</p>
                      <p className="text-muted-foreground">Revenue</p>
                    </div>
                    <div className="bg-muted rounded-lg p-2">
                      <p className="font-bold text-sm">{outlet.orders}</p>
                      <p className="text-muted-foreground">Orders</p>
                    </div>
                    <div className="bg-muted rounded-lg p-2">
                      <p className="font-bold text-sm">₹{outlet.avgTicket}</p>
                      <p className="text-muted-foreground">Avg Ticket</p>
                    </div>
                    <div className="bg-muted rounded-lg p-2">
                      <p className="font-bold text-sm">{outlet.staff}</p>
                      <p className="text-muted-foreground">Staff on Duty</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Tables: {outlet.tablesOccupied}/{outlet.tablesTotal}</span>
                    <span className={`flex items-center gap-0.5 font-medium ${outlet.trend >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {outlet.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(outlet.trend)}% vs yesterday
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Combined Revenue Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Weekly Revenue — All Outlets</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={hqWeeklyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="date" stroke="#64748B" />
                  <YAxis stroke="#64748B" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, undefined]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="downtown" name="Downtown Bistro" stroke="#2563EB" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="mall" name="Mall Express" stroke="#10B981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="airport" name="Airport Lounge" stroke="#F59E0B" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cloud" name="Cloud Kitchen HQ" stroke="#EF4444" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Outlet Comparison Bar Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Outlet Revenue Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={hqOutlets.map(o => ({ name: o.name.split(" ")[0], revenue: o.revenue, fill: o.color }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#64748B" />
                    <YAxis stroke="#64748B" tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                      {hqOutlets.map((outlet, index) => (
                        <Cell key={`cell-${index}`} fill={outlet.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Section-wise Revenue Pie Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Revenue by Order Type (All Outlets)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={hqSectionRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ₹${(value/1000).toFixed(0)}K`}
                      outerRadius={90}
                      dataKey="value"
                    >
                      {hqSectionRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alerts Panel */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  Combined Inventory Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {hqAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <p className="font-medium text-sm">{alert.item}</p>
                        <p className="text-xs text-muted-foreground">{alert.outlet} · {alert.current} {alert.unit} remaining</p>
                      </div>
                      <Badge variant={alert.status === "critical" ? "destructive" : "secondary"}>
                        {alert.status === "critical" ? "Critical" : "Low Stock"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Staff Summary */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  Staff Summary — All Outlets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold">{totalStaff}</p>
                    <p className="text-sm text-muted-foreground">Total On-Duty</p>
                  </div>
                  <div className="bg-muted rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold">{hqOutlets.length}</p>
                    <p className="text-sm text-muted-foreground">Active Outlets</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {hqOutlets.map((outlet) => (
                    <div key={outlet.id} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                      <span className="font-medium">{outlet.name}</span>
                      <span className="text-muted-foreground">{outlet.staff} staff on duty</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

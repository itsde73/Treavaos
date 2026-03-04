import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Grid3x3,
  MenuSquare,
  Package,
  Users,
  UserCheck,
  Truck,
  BarChart3,
  DollarSign,
  Settings,
  Check,
} from "lucide-react";

const modules = [
  { name: "Dashboard", icon: LayoutDashboard, color: "text-blue-600" },
  { name: "POS / Billing", icon: ShoppingCart, color: "text-green-600" },
  { name: "Order Management", icon: ClipboardList, color: "text-purple-600" },
  { name: "Table Management", icon: Grid3x3, color: "text-orange-600" },
  { name: "Menu Management", icon: MenuSquare, color: "text-pink-600" },
  { name: "Inventory", icon: Package, color: "text-amber-600" },
  { name: "Staff & Roles", icon: Users, color: "text-cyan-600" },
  { name: "CRM & Customers", icon: UserCheck, color: "text-indigo-600" },
  { name: "Online Orders", icon: Truck, color: "text-teal-600" },
  { name: "Reports & Analytics", icon: BarChart3, color: "text-red-600" },
  { name: "Finance", icon: DollarSign, color: "text-emerald-600" },
  { name: "Settings", icon: Settings, color: "text-gray-600" },
];

const features = [
  "Multi-outlet support with centralized management",
  "Real-time order tracking and KOT system",
  "Comprehensive inventory management",
  "Staff attendance and performance tracking",
  "Customer loyalty and CRM system",
  "Integration with delivery aggregators",
  "Advanced reporting and analytics",
  "GST and tax compliance",
  "Role-based access control",
  "Responsive design (Desktop, Tablet, Mobile)",
  "Dark mode support",
  "Customizable notifications",
];

const designSystem = [
  { name: "Color Palette", value: "Professional Blue (#2563EB)" },
  { name: "Typography", value: "Inter Font Family" },
  { name: "Grid System", value: "8px base unit" },
  { name: "Border Radius", value: "8-12px rounded corners" },
  { name: "Shadows", value: "Soft, subtle shadows" },
  { name: "Background", value: "#F8FAFC neutral" },
];

export function SystemOverview() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
          <ShoppingCart className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-4xl font-bold mb-3">RestaurantOS</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Full-Scale SaaS Restaurant ERP & POS System
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">Enterprise Ready</Badge>
          <Badge className="bg-green-100 text-green-800">Cloud Based</Badge>
          <Badge className="bg-purple-100 text-purple-800">Multi-Outlet</Badge>
        </div>
      </div>

      <Separator />

      {/* Modules Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Core Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {modules.map((module, index) => {
              const Icon = module.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <Icon className={`w-5 h-5 ${module.color}`} />
                  <span className="text-sm font-medium">{module.name}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Design System */}
      <Card>
        <CardHeader>
          <CardTitle>Design System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {designSystem.map((item, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted">
                <p className="text-sm font-medium mb-1">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Target Users */}
      <Card>
        <CardHeader>
          <CardTitle>Target Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              "Single Restaurant Owners",
              "Multi-Outlet Chains",
              "Cloud Kitchens",
              "Enterprise QSR Brands",
            ].map((user, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium">{user}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              "React 18",
              "TypeScript",
              "Tailwind CSS v4",
              "React Router",
              "Recharts",
              "Radix UI",
              "Lucide Icons",
              "Inter Font",
            ].map((tech, index) => (
              <Badge key={index} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold mb-3">
          Ready to Transform Your Restaurant Operations?
        </h2>
        <p className="text-muted-foreground mb-6">
          Scalable to 1000+ outlets with enterprise-grade features
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">
            View Demo
          </Button>
        </div>
      </div>
    </div>
  );
}

import { TrendingUp, ShoppingBag, Users, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function MobileManagerView() {
  return (
    <div className="max-w-md mx-auto p-4 space-y-4 bg-background min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Manager Dashboard</h1>
        <p className="text-sm text-muted-foreground">Downtown Branch</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs text-muted-foreground">Today's Sales</span>
            </div>
            <p className="text-xl font-semibold">₹45,231</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Orders</span>
            </div>
            <p className="text-xl font-semibold">267</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Staff On Duty</span>
            </div>
            <p className="text-xl font-semibold">18</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-muted-foreground">Alerts</span>
            </div>
            <p className="text-xl font-semibold">4</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Recent Alerts</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm font-medium text-red-800">Low Stock Alert</p>
              <p className="text-xs text-red-600 mt-1">Tomatoes - 5kg remaining</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm font-medium text-blue-800">New Order #1245</p>
              <p className="text-xs text-blue-600 mt-1">Table 5 - ₹1,250</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Truck, DollarSign, TrendingUp, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const aggregators = [
  { name: "Zomato", orders: 145, revenue: 45600, commission: 6840, status: "active" },
  { name: "Swiggy", orders: 132, revenue: 42300, commission: 6345, status: "active" },
  { name: "UberEats", orders: 98, revenue: 31200, commission: 4680, status: "active" },
];

const onlineOrders = [
  { id: "#ZOM-1234", platform: "Zomato", customer: "John Doe", amount: 890, status: "preparing", time: "5 min ago" },
  { id: "#SWG-5678", platform: "Swiggy", customer: "Sarah Smith", amount: 1250, status: "ready", time: "2 min ago" },
  { id: "#UBR-9012", platform: "UberEats", customer: "Mike Johnson", amount: 670, status: "picked", time: "8 min ago" },
];

const statusColors: any = {
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  picked: "bg-purple-100 text-purple-800",
  delivered: "bg-gray-100 text-gray-800",
};

export function OnlineOrders() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Online Orders</h1>
          <p className="text-muted-foreground mt-1">
            Manage orders from delivery aggregators
          </p>
        </div>
        <Button variant="outline">Sync Orders</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-semibold mt-1">375</p>
              </div>
              <Truck className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-semibold mt-1">₹1.19L</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commission</p>
                <p className="text-2xl font-semibold mt-1">₹17.8K</p>
              </div>
              <TrendingUp className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Orders</p>
                <p className="text-2xl font-semibold mt-1">23</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Aggregator Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aggregators.map((aggregator, index) => (
              <div key={index} className="p-4 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Truck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{aggregator.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        {aggregator.status}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Orders</p>
                    <p className="text-lg font-semibold mt-1">{aggregator.orders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-lg font-semibold mt-1">₹{aggregator.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Commission (15%)</p>
                    <p className="text-lg font-semibold mt-1 text-red-600">
                      -₹{aggregator.commission.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {onlineOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.platform}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>₹{order.amount}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.time}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

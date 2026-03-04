import { useState } from "react";
import { Clock, User, MapPin, MoreVertical, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const orders = [
  {
    id: "#ORD-1245",
    table: "Table 5",
    type: "Dine-in",
    items: 5,
    amount: 1250,
    status: "preparing",
    waiter: "John Doe",
    time: "10 min ago",
  },
  {
    id: "#ORD-1246",
    table: "Table 12",
    type: "Dine-in",
    items: 3,
    amount: 890,
    status: "ready",
    waiter: "Sarah Smith",
    time: "5 min ago",
  },
  {
    id: "#ORD-1247",
    table: "Delivery",
    type: "Delivery",
    items: 7,
    amount: 2340,
    status: "preparing",
    waiter: "Mike Johnson",
    time: "15 min ago",
  },
  {
    id: "#ORD-1248",
    table: "Takeaway",
    type: "Takeaway",
    items: 2,
    amount: 450,
    status: "ready",
    waiter: "Emily Brown",
    time: "2 min ago",
  },
];

const statusColors: any = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  delivered: "bg-gray-100 text-gray-800",
};

export function OrderManagement() {
  const [selectedTab, setSelectedTab] = useState("all");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Order Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all orders in real-time
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button>New Order</Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="dine-in">Dine-in</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="takeaway">Takeaway</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {orders.map((order) => (
              <Card key={order.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{order.id}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Print KOT</DropdownMenuItem>
                        <DropdownMenuItem>Mark Ready</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                    <Badge variant="outline">{order.type}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {order.table}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      {order.waiter}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {order.time}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {order.items} items
                      </span>
                      <span className="font-semibold">₹{order.amount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dine-in">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Dine-in orders will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Delivery orders will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="takeaway">
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Takeaway orders will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Table/Location</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Waiter</TableHead>
                <TableHead>Time</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>{order.table}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>₹{order.amount}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.waiter}</TableCell>
                  <TableCell>{order.time}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
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

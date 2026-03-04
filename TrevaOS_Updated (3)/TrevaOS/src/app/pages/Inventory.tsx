import { AlertTriangle, Package, TrendingDown, FileText } from "lucide-react";
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
import { Progress } from "../components/ui/progress";

const inventory = [
  { id: 1, name: "Tomatoes", current: 5, min: 10, max: 50, unit: "kg", status: "critical" },
  { id: 2, name: "Cheese", current: 12, min: 15, max: 40, unit: "kg", status: "low" },
  { id: 3, name: "Chicken", current: 25, min: 20, max: 60, unit: "kg", status: "good" },
  { id: 4, name: "Olive Oil", current: 3, min: 8, max: 25, unit: "L", status: "critical" },
  { id: 5, name: "Flour", current: 45, min: 30, max: 100, unit: "kg", status: "good" },
  { id: 6, name: "Onions", current: 18, min: 15, max: 50, unit: "kg", status: "good" },
];

const purchaseOrders = [
  { id: "PO-001", supplier: "Fresh Farm Co.", items: 5, amount: 12500, status: "pending", date: "2024-03-02" },
  { id: "PO-002", supplier: "Dairy Best", items: 3, amount: 8900, status: "received", date: "2024-03-01" },
  { id: "PO-003", supplier: "Meat Masters", items: 4, amount: 15600, status: "pending", date: "2024-03-02" },
];

const statusColors: any = {
  critical: "bg-red-100 text-red-800",
  low: "bg-yellow-100 text-yellow-800",
  good: "bg-green-100 text-green-800",
};

export function Inventory() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Inventory & Purchase</h1>
          <p className="text-muted-foreground mt-1">
            Track stock levels and manage purchase orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Add Supplier</Button>
          <Button>New Purchase Order</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-semibold mt-1">156</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-semibold mt-1">12</p>
              </div>
              <TrendingDown className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-semibold mt-1">4</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PO Pending</p>
                <p className="text-2xl font-semibold mt-1">8</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Stock Levels</TabsTrigger>
          <TabsTrigger value="purchase">Purchase Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="wastage">Wastage</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min Level</TableHead>
                    <TableHead>Max Level</TableHead>
                    <TableHead>Stock %</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const percentage = (item.current / item.max) * 100;
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.current} {item.unit}</TableCell>
                        <TableCell>{item.min} {item.unit}</TableCell>
                        <TableCell>{item.max} {item.unit}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={percentage} className="w-20" />
                            <span className="text-sm">{percentage.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[item.status]}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Reorder
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.id}</TableCell>
                      <TableCell>{po.supplier}</TableCell>
                      <TableCell>{po.items}</TableCell>
                      <TableCell>₹{po.amount.toLocaleString()}</TableCell>
                      <TableCell>{po.date}</TableCell>
                      <TableCell>
                        <Badge variant={po.status === "received" ? "secondary" : "outline"}>
                          {po.status}
                        </Badge>
                      </TableCell>
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
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Supplier management will appear here
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wastage">
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Wastage tracking will appear here
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

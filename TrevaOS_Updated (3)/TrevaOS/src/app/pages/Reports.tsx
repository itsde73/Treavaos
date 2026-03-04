import { useState } from "react";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import { useLocation } from "react-router";

const itemPerformance = [
  { item: "Paneer Tikka", category: "Starters", sold: 234, price: 289, revenue: 67626 },
  { item: "Chicken Tikka", category: "Starters", sold: 189, price: 329, revenue: 62181 },
  { item: "Hara Bhara Kebab", category: "Starters", sold: 156, price: 249, revenue: 38844 },
  { item: "Veg Spring Rolls", category: "Starters", sold: 145, price: 219, revenue: 31755 },
  { item: "Chilli Chicken", category: "Starters", sold: 134, price: 309, revenue: 41406 },
  { item: "Margherita Pizza", category: "Main Course", sold: 112, price: 349, revenue: 39088 },
  { item: "Butter Chicken", category: "Indian Main Course", sold: 98, price: 389, revenue: 38122 },
  { item: "Chicken Burger", category: "Main Course", sold: 87, price: 199, revenue: 17313 },
];

const categoryData = [
  { category: "Starters", sold: 498, revenue: 148500 },
  { category: "Soups", sold: 134, revenue: 20100 },
  { category: "Indian Main Course", sold: 345, revenue: 134100 },
  { category: "Chinese", sold: 278, revenue: 97300 },
  { category: "Italian", sold: 234, revenue: 78200 },
  { category: "Breads", sold: 412, revenue: 41200 },
  { category: "Rice & Biryani", sold: 189, revenue: 56700 },
  { category: "Desserts", sold: 156, revenue: 23400 },
];

const deliveryApps = [
  { app: "Swiggy", orders: 145, revenue: 48260, fees: 9650, commission: 14480, commissionRate: "30%", netRevenue: 24130 },
  { app: "Zomato", orders: 118, revenue: 39220, fees: 7840, commission: 11766, commissionRate: "30%", netRevenue: 19614 },
  { app: "Direct App", orders: 67, revenue: 22290, fees: 1340, commission: 0, commissionRate: "0%", netRevenue: 20950 },
];

const cancelledOrders = [
  { id: "Order #128", orderDate: "03/03/2026 06:45 PM", cancelledDate: "03/03/2026 06:52 PM", customer: "Raj Kumar\n9876543210", table: "Table: OT04", reason: "Customer changed mind", by: "John (Manager)", amount: 4338.70 },
  { id: "Order #115", orderDate: "03/03/2026 02:30 PM", cancelledDate: "03/03/2026 02:38 PM", customer: "Priya Sharma\n9988776655", table: "Table: OT01", reason: "Wrong order taken", by: "Sarah (Captain)", amount: 1200.00 },
];

const removedKotItems = [
  { kotId: "KOT #245", item: "Chicken Tikka", qty: 1, reason: "Out of stock", removedBy: "Chef Ramesh", time: "07:34 PM", table: "Table 5" },
  { kotId: "KOT #238", item: "Prawn Curry", qty: 2, reason: "Customer request", removedBy: "John (Captain)", time: "06:12 PM", table: "Table 12" },
  { kotId: "KOT #231", item: "Pasta Alfredo", qty: 1, reason: "Wrong item added", removedBy: "Sarah (Captain)", time: "01:45 PM", table: "Table 3" },
];

const taxReport = [
  { date: "03/03/2026", orders: 28, charges: 48200, cgst: 2410, sgst: 2410, totalTax: 4820, cash: 18200, upi: 22000, card: 8000, bankTransfer: 0, total: 48200 },
  { date: "02/03/2026", orders: 31, charges: 52800, cgst: 2640, sgst: 2640, totalTax: 5280, cash: 21000, upi: 24800, card: 7000, bankTransfer: 0, total: 52800 },
  { date: "01/03/2026", orders: 24, charges: 41200, cgst: 2060, sgst: 2060, totalTax: 4120, cash: 16200, upi: 18000, card: 7000, bankTransfer: 0, total: 41200 },
];

const refundReport = [
  { id: "REF#012", orderNo: "Order #122", date: "03/03/2026", customer: "Amit Shah", amount: 850, reason: "Wrong item delivered", status: "completed" },
  { id: "REF#011", orderNo: "Order #108", date: "01/03/2026", customer: "Priya Nair", amount: 1200, reason: "Quality issue", status: "completed" },
  { id: "REF#010", orderNo: "Order #98", date: "28/02/2026", customer: "Vikram Roy", amount: 450, reason: "Late delivery", status: "pending" },
];

const loyaltyData = [
  { customer: "Rahul Mehta", points: 2450, tier: "Gold", redemptions: 3, saved: 735 },
  { customer: "Priya Sharma", points: 1820, tier: "Silver", redemptions: 2, saved: 364 },
  { customer: "Amit Gupta", points: 3100, tier: "Platinum", redemptions: 5, saved: 1550 },
  { customer: "Sunita Rao", points: 980, tier: "Bronze", redemptions: 1, saved: 98 },
];

const duePayments = [
  { date: "03/03/2026", orderNo: "Order #130", customer: "Corporate - TechCorp", amount: 12500, received: 5000, due: 7500, status: "partial" },
  { date: "02/03/2026", orderNo: "Order #119", customer: "Ravi Shankar", amount: 3200, received: 3200, due: 0, status: "paid" },
  { date: "01/03/2026", orderNo: "Order #105", customer: "Hotel Supplies Ltd", amount: 8800, received: 0, due: 8800, status: "unpaid" },
];

const periodOptions = ["Today", "Yesterday", "Current Week", "Last Week", "Current Month", "Custom"];

function FilterBar({ showSearch = false, showUserFilter = false }: { showSearch?: boolean; showUserFilter?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3 p-4 border rounded-xl bg-muted/30 mb-4">
      <select className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9">
        {periodOptions.map(p => <option key={p}>{p}</option>)}
      </select>
      <div className="flex items-center gap-2">
        <input type="date" defaultValue="2026-03-02" className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9" />
        <span className="text-muted-foreground text-sm">To</span>
        <input type="date" defaultValue="2026-03-08" className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9" />
      </div>
      <div className="flex items-center gap-2">
        <input type="time" defaultValue="00:00" className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9" />
        <span className="text-muted-foreground text-sm">To</span>
        <input type="time" defaultValue="23:59" className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9" />
      </div>
      {showSearch && <input className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9 flex-1 min-w-40" placeholder="Search your menu item here..." />}
      {showUserFilter && (
        <select className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9">
          <option>All Users</option><option>John (Captain)</option><option>Sarah (Captain)</option>
        </select>
      )}
      <Button variant="outline" size="sm" className="gap-1.5 h-9 ml-auto">
        <Download className="w-4 h-4" /> Export
      </Button>
    </div>
  );
}

function useReportTab() {
  const location = useLocation();
  const path = location.pathname;
  if (path.includes("/items")) return "items";
  if (path.includes("/categories")) return "categories";
  if (path.includes("/delivery")) return "delivery";
  if (path.includes("/expenses")) return "expenses";
  if (path.includes("/pos-machine")) return "pos-machine";
  if (path.includes("/cancelled")) return "cancelled";
  if (path.includes("/removed-kot")) return "removed-kot";
  if (path.includes("/tax")) return "tax";
  if (path.includes("/refunds")) return "refunds";
  if (path.includes("/loyalty")) return "loyalty";
  if (path.includes("/due-payments")) return "due-payments";
  return "sales";
}

export function Reports() {
  const defaultTab = useReportTab();

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-3xl font-semibold">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">Analyze performance and generate reports</p>
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList className="flex-wrap h-auto gap-0.5 justify-start">
          <TabsTrigger value="sales" className="text-xs">Sales Report</TabsTrigger>
          <TabsTrigger value="items" className="text-xs">Item Report</TabsTrigger>
          <TabsTrigger value="categories" className="text-xs">Category Report</TabsTrigger>
          <TabsTrigger value="delivery" className="text-xs">Delivery App</TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs">Expense Reports</TabsTrigger>
          <TabsTrigger value="pos-machine" className="text-xs">POS Machine</TabsTrigger>
          <TabsTrigger value="cancelled" className="text-xs">Cancelled Orders</TabsTrigger>
          <TabsTrigger value="removed-kot" className="text-xs">Removed KOT</TabsTrigger>
          <TabsTrigger value="tax" className="text-xs">Tax Report</TabsTrigger>
          <TabsTrigger value="refunds" className="text-xs">Refund Report</TabsTrigger>
          <TabsTrigger value="loyalty" className="text-xs">Loyalty Reports</TabsTrigger>
          <TabsTrigger value="due-payments" className="text-xs">Due Payments</TabsTrigger>
        </TabsList>

        {/* SALES REPORT */}
        <TabsContent value="sales" className="space-y-4 mt-4">
          <div>
            <h2 className="text-xl font-semibold">Sales Report</h2>
            <p className="text-sm text-muted-foreground">Check and track your restaurant's earnings <span className="font-medium">(Sales Data From 02/03/2026 To 08/03/2026, Time Period Each Day 12:00 AM - 11:59 PM)</span></p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: "Total Sales", value: "₹1,42,200", sub: "Orders: 122", color: "#64748B" },
              { label: "Traditional Payments", value: "₹84,400", sub: "Cash · Card · UPI · Bank Transfer", color: "#6366F1" },
              { label: "Payment Gateways", value: "₹57,800", sub: "Swiggy · Zomato · Direct", color: "#10B981" },
              { label: "Additional Amounts", value: "₹6,200", sub: "Charges · Taxes · Discount · Tip", color: "#EF4444" },
              { label: "Tax Breakdown", value: "₹12,798", sub: "Tax Mode: Order · Total Collection: ₹12,798", color: "#8B5CF6" },
              { label: "Outstanding Payments", value: "₹8,200", sub: "Outstanding Orders: 3 · Received: ₹2,400", color: "#F59E0B" },
            ].map((s, i) => (
              <Card key={i} className="shadow-sm" style={{ borderTop: `3px solid ${s.color}` }}>
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                  <p className="text-lg font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <FilterBar showUserFilter />
          <Card className="shadow-sm">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Charges</TableHead>
                    <TableHead>Service Charge</TableHead>
                    <TableHead>CGST (2.5%)</TableHead>
                    <TableHead>SGST (2.5%)</TableHead>
                    <TableHead>Total Tax Amount</TableHead>
                    <TableHead>Cash</TableHead>
                    <TableHead>UPI</TableHead>
                    <TableHead>Card</TableHead>
                    <TableHead>Bank Transfer</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Outstanding Received</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead className="font-bold">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxReport.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium whitespace-nowrap">{row.date}</TableCell>
                      <TableCell>{row.orders}</TableCell>
                      <TableCell>₹{row.charges.toLocaleString()}</TableCell>
                      <TableCell>₹0</TableCell>
                      <TableCell>₹{row.cgst.toLocaleString()}</TableCell>
                      <TableCell>₹{row.sgst.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-purple-700">₹{row.totalTax.toLocaleString()}</TableCell>
                      <TableCell>₹{row.cash.toLocaleString()}</TableCell>
                      <TableCell>₹{row.upi.toLocaleString()}</TableCell>
                      <TableCell>₹{row.card.toLocaleString()}</TableCell>
                      <TableCell>₹{row.bankTransfer}</TableCell>
                      <TableCell>₹0</TableCell>
                      <TableCell>₹0</TableCell>
                      <TableCell>₹0</TableCell>
                      <TableCell>₹0</TableCell>
                      <TableCell className="font-bold">₹{row.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ITEM REPORT */}
        <TabsContent value="items" className="space-y-4 mt-4">
          <div>
            <h2 className="text-xl font-semibold">Item Report</h2>
            <p className="text-sm text-muted-foreground">View detailed sales and performance of items <span className="font-medium">(Sales Data From 02/03/2026 To 08/03/2026, Time Period Each Day 12:00 AM - 11:59 PM)</span></p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card style={{ borderTop: "3px solid #6366F1" }} className="shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Sum of Total Revenue</p>
                <p className="text-3xl font-bold mt-1">₹3,36,134</p>
              </CardContent>
            </Card>
            <Card style={{ borderTop: "3px solid #10B981" }} className="shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">Total Quantity Sold</p>
                <p className="text-3xl font-bold mt-1">1,155</p>
              </CardContent>
            </Card>
          </div>
          <FilterBar showSearch showUserFilter />
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Item Category Name</TableHead>
                    <TableHead className="cursor-pointer select-none">Quantity Sold ↓</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Total Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemPerformance.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.item}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.sold}</TableCell>
                      <TableCell>₹{item.price.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">₹{item.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CATEGORY REPORT */}
        <TabsContent value="categories" className="space-y-4 mt-4">
          <div>
            <h2 className="text-xl font-semibold">Category Report</h2>
            <p className="text-sm text-muted-foreground">See sales by category to understand performance <span className="font-medium">(Sales Data From 02/03/2026 To 08/03/2026, Time Period Each Day 12:00 AM - 11:59 PM)</span></p>
          </div>
          <FilterBar />
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Category</TableHead>
                    <TableHead>Quantity Sold</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryData.map((cat, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{cat.category}</TableCell>
                      <TableCell>{cat.sold}</TableCell>
                      <TableCell className="font-semibold">₹{cat.revenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell>Total</TableCell>
                    <TableCell>{categoryData.reduce((a, c) => a + c.sold, 0)}</TableCell>
                    <TableCell>₹{categoryData.reduce((a, c) => a + c.revenue, 0).toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DELIVERY APP REPORT */}
        <TabsContent value="delivery" className="space-y-4 mt-4">
          <div>
            <h2 className="text-xl font-semibold">Delivery App Report</h2>
            <p className="text-sm text-muted-foreground">Track orders and commissions from delivery platforms <span className="font-medium">(Sales Data From 02/03/2026 To 08/03/2026, Time Period Each Day 12:00 AM - 11:59 PM)</span></p>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: "Total Orders", value: String(deliveryApps.reduce((a,d)=>a+d.orders,0)), color: "#6366F1" },
              { label: "Total Revenue", value: `₹${deliveryApps.reduce((a,d)=>a+d.revenue,0).toLocaleString()}`, color: "#64748B" },
              { label: "Total Commission", value: `₹${deliveryApps.reduce((a,d)=>a+d.commission,0).toLocaleString()}`, color: "#EF4444" },
              { label: "Total Delivery Fees", value: `₹${deliveryApps.reduce((a,d)=>a+d.fees,0).toLocaleString()}`, color: "#8B5CF6" },
              { label: "Net Revenue", value: `₹${deliveryApps.reduce((a,d)=>a+d.netRevenue,0).toLocaleString()}`, color: "#10B981" },
            ].map((s,i) => (
              <Card key={i} className="shadow-sm" style={{ borderTop: `3px solid ${s.color}` }}>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold mt-1">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 p-4 border rounded-xl bg-muted/30">
            <select className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9">{periodOptions.map(p=><option key={p}>{p}</option>)}</select>
            <input type="date" defaultValue="2026-03-02" className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9" />
            <span className="text-muted-foreground text-sm self-center">To</span>
            <input type="date" defaultValue="2026-03-08" className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9" />
            <input type="time" defaultValue="00:00" className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9" />
            <span className="text-muted-foreground text-sm self-center">To</span>
            <input type="time" defaultValue="23:59" className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9" />
            <select className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9">
              <option>All Delivery Apps</option><option>Swiggy</option><option>Zomato</option><option>Direct App</option>
            </select>
          </div>
          <Card className="shadow-sm">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Delivery App</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Total Delivery Fees</TableHead>
                    <TableHead>Avg Order Value</TableHead>
                    <TableHead>Commission Rate</TableHead>
                    <TableHead>Total Commission</TableHead>
                    <TableHead>Net Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryApps.map((app,i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{app.app}</TableCell>
                      <TableCell>{app.orders}</TableCell>
                      <TableCell>₹{app.revenue.toLocaleString()}</TableCell>
                      <TableCell>₹{app.fees.toLocaleString()}</TableCell>
                      <TableCell>₹{(app.revenue/app.orders).toFixed(0)}</TableCell>
                      <TableCell>{app.commissionRate}</TableCell>
                      <TableCell className="text-red-600">₹{app.commission.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-green-600">₹{app.netRevenue.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EXPENSE REPORTS */}
        <TabsContent value="expenses" className="space-y-4 mt-4">
          <Tabs defaultValue="outstanding">
            <TabsList>
              <TabsTrigger value="outstanding">Outstanding Payment Report</TabsTrigger>
              <TabsTrigger value="summary">Expense Summary Report</TabsTrigger>
            </TabsList>
            <TabsContent value="outstanding" className="mt-4 space-y-4">
              <h2 className="text-xl font-semibold">Outstanding Payment Report</h2>
              <div className="flex flex-wrap gap-3 p-4 border rounded-xl bg-muted/30">
                <select className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9">{periodOptions.map(p=><option key={p}>{p}</option>)}</select>
                <input type="date" defaultValue="2026-03-02" className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9" />
                <span className="text-muted-foreground text-sm self-center">To</span>
                <input type="date" defaultValue="2026-03-08" className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9" />
                <Button variant="outline" size="sm" className="gap-1.5 h-9 ml-auto"><Download className="w-4 h-4" /> Export</Button>
              </div>
              <Card className="shadow-sm"><CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow><TableHead>Payment Due</TableHead><TableHead>Due Date</TableHead><TableHead>Payment Status</TableHead></TableRow></TableHeader>
                  <TableBody><TableRow><TableCell colSpan={3} className="text-center py-12 text-muted-foreground">No reports Found</TableCell></TableRow></TableBody>
                </Table>
              </CardContent></Card>
            </TabsContent>
            <TabsContent value="summary" className="mt-4 space-y-4">
              <h2 className="text-xl font-semibold">Expense Summary Report</h2>
              <FilterBar />
              <Card className="shadow-sm"><CardContent className="p-6 text-center text-muted-foreground">No expense summary data for the selected period.</CardContent></Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* POS MACHINE */}
        <TabsContent value="pos-machine" className="space-y-4 mt-4">
          <div>
            <h2 className="text-xl font-semibold">POS Machine Report</h2>
            <p className="text-sm text-muted-foreground">Branch: Downtown</p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[{label:"Total Machines",value:"2"},{label:"Total Orders",value:"267"},{label:"Net Sales",value:"₹1,04,200"},{label:"Avg Order Value",value:"₹390"}].map((s,i) => (
              <Card key={i} className="shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></CardContent></Card>
            ))}
          </div>
          <FilterBar />
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-base">Machine Performance</CardTitle></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow><TableHead>Machine Name</TableHead><TableHead>Total Orders</TableHead><TableHead>Net Sales</TableHead><TableHead>Cash</TableHead><TableHead>UPI</TableHead><TableHead>Card</TableHead><TableHead>Avg Order Value</TableHead></TableRow></TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Default POS Terminal</TableCell>
                    <TableCell>267</TableCell><TableCell>₹1,04,200</TableCell>
                    <TableCell>₹42,400</TableCell><TableCell>₹38,600</TableCell><TableCell>₹23,200</TableCell><TableCell>₹390</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CANCELLED ORDER REPORT */}
        <TabsContent value="cancelled" className="space-y-4 mt-4">
          <div>
            <h2 className="text-xl font-semibold">Cancelled Order Report</h2>
            <p className="text-sm text-muted-foreground">Audit report for cancelled orders showing cancellation reasons and cancelled by</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card style={{ borderTop: "3px solid #EF4444" }} className="shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Cancelled Orders</p><p className="text-3xl font-bold mt-1">{cancelledOrders.length}</p></CardContent></Card>
            <Card style={{ borderTop: "3px solid #F59E0B" }} className="shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Cancelled Amount</p><p className="text-3xl font-bold mt-1">₹{cancelledOrders.reduce((a,o)=>a+o.amount,0).toFixed(2)}</p></CardContent></Card>
            <Card style={{ borderTop: "3px solid #6366F1" }} className="shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Top Cancelled Reasons</p><p className="text-lg font-semibold mt-1">Customer changed mind (1)</p></CardContent></Card>
          </div>
          <div className="flex flex-wrap gap-3 p-4 border rounded-xl bg-muted/30">
            <select className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9">{periodOptions.map(p=><option key={p}>{p}</option>)}</select>
            <input type="date" defaultValue="2026-03-02" className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9" />
            <span className="text-muted-foreground text-sm self-center">To</span>
            <input type="date" defaultValue="2026-03-08" className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9" />
            <input type="time" defaultValue="00:00" className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9" />
            <span className="text-muted-foreground text-sm self-center">To</span>
            <input type="time" defaultValue="23:59" className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9" />
            <select className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9"><option>All Cancellation Reasons</option><option>Customer changed mind</option><option>Wrong order taken</option><option>Out of stock</option></select>
            <select className="text-sm border rounded-lg px-3 py-1.5 bg-background h-9"><option>All Users</option></select>
            <Button variant="outline" size="sm" className="gap-1.5 h-9 ml-auto"><Download className="w-4 h-4" /> Export</Button>
          </div>
          <Card className="shadow-sm">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Order Number</TableHead><TableHead>Order Date</TableHead><TableHead>Cancelled Date</TableHead>
                  <TableHead>Customer</TableHead><TableHead>Table/Waiter</TableHead><TableHead>Cancellation Reason</TableHead>
                  <TableHead>Cancelled By</TableHead><TableHead className="text-right">Amount</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {cancelledOrders.map((order,i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{order.orderDate}</TableCell>
                      <TableCell className="text-sm whitespace-nowrap">{order.cancelledDate}</TableCell>
                      <TableCell className="text-sm whitespace-pre-line">{order.customer}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{order.table}</Badge></TableCell>
                      <TableCell className="max-w-40"><Badge className="bg-red-50 text-red-800 text-xs font-normal">{order.reason}</Badge></TableCell>
                      <TableCell className="text-sm">{order.by}</TableCell>
                      <TableCell className="text-right font-semibold">₹{order.amount.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-semibold bg-muted/30">
                    <TableCell colSpan={7} className="text-right">Total:</TableCell>
                    <TableCell className="text-right">₹{cancelledOrders.reduce((a,o)=>a+o.amount,0).toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REMOVED KOT ITEM REPORT */}
        <TabsContent value="removed-kot" className="space-y-4 mt-4">
          <div>
            <h2 className="text-xl font-semibold">Removed KOT Item Report</h2>
            <p className="text-sm text-muted-foreground">Track all items removed from KOTs with reasons and responsible staff</p>
          </div>
          <FilterBar showUserFilter />
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>KOT ID</TableHead><TableHead>Item</TableHead><TableHead>Qty</TableHead>
                  <TableHead>Reason</TableHead><TableHead>Removed By</TableHead><TableHead>Time</TableHead><TableHead>Table</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {removedKotItems.map((item,i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.kotId}</TableCell>
                      <TableCell>{item.item}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell><Badge className="bg-amber-50 text-amber-800 text-xs font-normal">{item.reason}</Badge></TableCell>
                      <TableCell className="text-sm">{item.removedBy}</TableCell>
                      <TableCell className="text-sm">{item.time}</TableCell>
                      <TableCell className="text-sm">{item.table}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAX REPORT */}
        <TabsContent value="tax" className="space-y-4 mt-4">
          <div>
            <h2 className="text-xl font-semibold">Tax Report</h2>
            <p className="text-sm text-muted-foreground">Detailed tax breakdown — CGST & SGST by date</p>
          </div>
          <FilterBar showUserFilter />
          <Card className="shadow-sm">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Date</TableHead><TableHead>Total Orders</TableHead><TableHead>Charges</TableHead>
                  <TableHead>CGST (2.5%)</TableHead><TableHead>SGST (2.5%)</TableHead><TableHead>Total Tax Amount</TableHead>
                  <TableHead>Cash</TableHead><TableHead>UPI</TableHead><TableHead>Card</TableHead><TableHead>Bank Transfer</TableHead>
                  <TableHead>Due</TableHead><TableHead>Total</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {taxReport.map((row,i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium whitespace-nowrap">{row.date}</TableCell>
                      <TableCell>{row.orders}</TableCell><TableCell>₹{row.charges.toLocaleString()}</TableCell>
                      <TableCell>₹{row.cgst.toLocaleString()}</TableCell><TableCell>₹{row.sgst.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-purple-700">₹{row.totalTax.toLocaleString()}</TableCell>
                      <TableCell>₹{row.cash.toLocaleString()}</TableCell><TableCell>₹{row.upi.toLocaleString()}</TableCell>
                      <TableCell>₹{row.card.toLocaleString()}</TableCell><TableCell>₹{row.bankTransfer}</TableCell>
                      <TableCell>₹0</TableCell><TableCell className="font-bold">₹{row.total.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REFUND REPORT */}
        <TabsContent value="refunds" className="space-y-4 mt-4">
          <h2 className="text-xl font-semibold">Refund Report</h2>
          <div className="grid grid-cols-3 gap-4">
            <Card style={{ borderTop: "3px solid #EF4444" }} className="shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Refunds</p><p className="text-3xl font-bold mt-1">{refundReport.length}</p></CardContent></Card>
            <Card style={{ borderTop: "3px solid #F59E0B" }} className="shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Refunded Amount</p><p className="text-3xl font-bold mt-1">₹{refundReport.reduce((a,r)=>a+r.amount,0).toLocaleString()}</p></CardContent></Card>
            <Card style={{ borderTop: "3px solid #6366F1" }} className="shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Pending Refunds</p><p className="text-3xl font-bold mt-1">{refundReport.filter(r=>r.status==="pending").length}</p></CardContent></Card>
          </div>
          <FilterBar />
          <Card className="shadow-sm"><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Refund ID</TableHead><TableHead>Order No</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead><TableHead>Amount</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {refundReport.map((r,i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{r.id}</TableCell><TableCell>{r.orderNo}</TableCell>
                    <TableCell>{r.date}</TableCell><TableCell>{r.customer}</TableCell>
                    <TableCell className="font-semibold text-red-600">₹{r.amount}</TableCell>
                    <TableCell className="text-sm">{r.reason}</TableCell>
                    <TableCell><Badge className={r.status==="completed"?"bg-green-100 text-green-800":"bg-amber-100 text-amber-800"}>{r.status.charAt(0).toUpperCase()+r.status.slice(1)}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        {/* LOYALTY REPORTS */}
        <TabsContent value="loyalty" className="space-y-4 mt-4">
          <h2 className="text-xl font-semibold">Loyalty Reports</h2>
          <div className="grid grid-cols-4 gap-4">
            {[{label:"Total Members",value:"248"},{label:"Points Issued",value:"1,24,500"},{label:"Points Redeemed",value:"42,300"},{label:"Total Savings Given",value:"₹4,230"}].map((s,i) => (
              <Card key={i} className="shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-2xl font-bold mt-1">{s.value}</p></CardContent></Card>
            ))}
          </div>
          <FilterBar />
          <Card className="shadow-sm"><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Points Balance</TableHead><TableHead>Tier</TableHead><TableHead>Total Redemptions</TableHead><TableHead>Total Saved</TableHead></TableRow></TableHeader>
              <TableBody>
                {loyaltyData.map((l,i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{l.customer}</TableCell>
                    <TableCell>{l.points.toLocaleString()}</TableCell>
                    <TableCell><Badge className={l.tier==="Platinum"?"bg-slate-800 text-white":l.tier==="Gold"?"bg-amber-100 text-amber-800":l.tier==="Silver"?"bg-slate-100 text-slate-700":"bg-orange-100 text-orange-700"}>{l.tier}</Badge></TableCell>
                    <TableCell>{l.redemptions}</TableCell>
                    <TableCell className="font-semibold text-green-600">₹{l.saved.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        {/* DUE PAYMENTS */}
        <TabsContent value="due-payments" className="space-y-4 mt-4">
          <h2 className="text-xl font-semibold">Due Payments Received Report</h2>
          <div className="grid grid-cols-3 gap-4">
            <Card style={{ borderTop: "3px solid #EF4444" }} className="shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Due Orders</p><p className="text-3xl font-bold mt-1">3</p></CardContent></Card>
            <Card style={{ borderTop: "3px solid #F59E0B" }} className="shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Due Amount</p><p className="text-3xl font-bold mt-1">₹24,500</p></CardContent></Card>
            <Card style={{ borderTop: "3px solid #10B981" }} className="shadow-sm"><CardContent className="p-4"><p className="text-xs text-muted-foreground">Amount Received</p><p className="text-3xl font-bold mt-1">₹8,200</p></CardContent></Card>
          </div>
          <FilterBar />
          <Card className="shadow-sm"><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Order No</TableHead><TableHead>Customer</TableHead><TableHead>Total Amount</TableHead><TableHead>Amount Received</TableHead><TableHead>Amount Due</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {duePayments.map((p,i) => (
                  <TableRow key={i}>
                    <TableCell>{p.date}</TableCell><TableCell className="font-medium">{p.orderNo}</TableCell><TableCell>{p.customer}</TableCell>
                    <TableCell>₹{p.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600">₹{p.received.toLocaleString()}</TableCell>
                    <TableCell className="text-red-600 font-semibold">₹{p.due.toLocaleString()}</TableCell>
                    <TableCell><Badge className={p.status==="paid"?"bg-green-100 text-green-800":p.status==="partial"?"bg-amber-100 text-amber-800":"bg-red-100 text-red-800"}>{p.status.charAt(0).toUpperCase()+p.status.slice(1)}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

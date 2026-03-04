import { Landmark, DollarSign, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const denominations = [
  { note: "₹2000", count: 5, total: 10000 },
  { note: "₹500", count: 20, total: 10000 },
  { note: "₹200", count: 15, total: 3000 },
  { note: "₹100", count: 30, total: 3000 },
  { note: "₹50", count: 20, total: 1000 },
  { note: "₹20", count: 15, total: 300 },
  { note: "₹10", count: 25, total: 250 },
  { note: "Coins", count: 100, total: 150 },
];

const approvals = [
  { id: 1, type: "Cash Out", amount: 500, reason: "Vegetable purchase", requestedBy: "Ravi (Steward)", time: "14:30", status: "pending" },
  { id: 2, type: "Petty Cash", amount: 200, reason: "Cleaning supplies", requestedBy: "Sunita (Cleaner)", time: "12:15", status: "approved" },
  { id: 3, type: "Cash Out", amount: 1000, reason: "Gas cylinder", requestedBy: "Ram (Cook)", time: "10:00", status: "approved" },
];

const shifts = [
  { shift: "Morning (6AM–2PM)", cashier: "Anita Sharma", openingBalance: 5000, closingBalance: 18500, sales: 14200, expenses: 700 },
  { shift: "Afternoon (2PM–10PM)", cashier: "Vijay Kumar", openingBalance: 18500, closingBalance: 42300, sales: 25100, expenses: 1300 },
];

export function CashRegister() {
  const totalInDrawer = denominations.reduce((a, d) => a + d.total, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Cash Register</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage cash drawer, shifts, and approvals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Open Shift</Button>
          <Button size="sm">Close Day (Z Report)</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Cash in Drawer", value: `₹${totalInDrawer.toLocaleString()}`, color: "text-green-600", icon: DollarSign },
          { label: "Today's Cash Sales", value: "₹14,580", color: "text-blue-600", icon: ArrowUpRight },
          { label: "Cash Out (Expenses)", value: "₹2,000", color: "text-red-600", icon: ArrowDownRight },
          { label: "Pending Approvals", value: approvals.filter(a => a.status === "pending").length, color: "text-amber-600", icon: AlertCircle },
        ].map(s => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="denominations">
        <TabsList>
          <TabsTrigger value="denominations">Denominations</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="shifts">Shift Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="denominations" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Current Drawer Denominations</span>
                <span className="text-lg font-bold text-green-600">Total: ₹{totalInDrawer.toLocaleString()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {denominations.map(d => (
                  <div key={d.note} className="bg-muted/40 rounded-lg p-3 text-center">
                    <p className="font-bold text-base">{d.note}</p>
                    <p className="text-xs text-muted-foreground mt-1">× {d.count} pcs</p>
                    <p className="font-semibold text-sm text-green-600 mt-1">₹{d.total.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-4">Update Count</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="mt-4">
          <div className="space-y-3">
            {approvals.map(a => (
              <Card key={a.id} className="shadow-sm">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{a.type}</span>
                          <Badge variant="outline" className="text-xs">₹{a.amount}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{a.reason} · Requested by {a.requestedBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge className={`text-xs ${a.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{a.status}</Badge>
                        <p className="text-xs text-muted-foreground mt-1"><Clock className="w-3 h-3 inline mr-0.5" />{a.time}</p>
                      </div>
                      {a.status === "pending" && (
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="outline" className="h-7 text-xs text-red-500">Reject</Button>
                          <Button size="sm" className="h-7 text-xs gap-1"><CheckCircle className="w-3 h-3" />Approve</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shifts" className="mt-4">
          <div className="space-y-4">
            {shifts.map((s, i) => (
              <Card key={i} className="shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm">{s.shift} · {s.cashier}</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div><p className="text-xs text-muted-foreground">Opening Balance</p><p className="font-semibold">₹{s.openingBalance.toLocaleString()}</p></div>
                    <div><p className="text-xs text-muted-foreground">Cash Sales</p><p className="font-semibold text-green-600">+₹{s.sales.toLocaleString()}</p></div>
                    <div><p className="text-xs text-muted-foreground">Cash Out</p><p className="font-semibold text-red-600">-₹{s.expenses.toLocaleString()}</p></div>
                    <div><p className="text-xs text-muted-foreground">Closing Balance</p><p className="font-semibold text-blue-600">₹{s.closingBalance.toLocaleString()}</p></div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 text-xs h-7">View Full Report</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

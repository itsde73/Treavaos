import { useState } from "react";
import { CreditCard, Smartphone, Banknote, TrendingUp, ArrowDownRight, ArrowUpRight, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// ── existing mock data ──────────────────────────────────────────────────────
const transactions = [
  { id: "TXN-001", order: "#1245", amount: 1850, mode: "UPI",  time: "14:32", status: "success", customer: "Rahul S." },
  { id: "TXN-002", order: "#1244", amount: 3200, mode: "Card", time: "14:10", status: "success", customer: "Priya M." },
  { id: "TXN-003", order: "#1243", amount:  650, mode: "Cash", time: "13:55", status: "success", customer: "Walk-in" },
  { id: "TXN-004", order: "#1242", amount: 4500, mode: "UPI",  time: "13:30", status: "failed",  customer: "Amit P." },
  { id: "TXN-005", order: "#1241", amount: 1200, mode: "Card", time: "13:15", status: "success", customer: "Sneha G." },
  { id: "TXN-006", order: "#1240", amount:  980, mode: "Cash", time: "12:50", status: "success", customer: "Walk-in" },
];

const paymentMix = [
  { name: "UPI",    value: 45, color: "#3b82f6" },
  { name: "Card",   value: 32, color: "#10b981" },
  { name: "Cash",   value: 18, color: "#f59e0b" },
  { name: "Wallet", value:  5, color: "#8b5cf6" },
];

const dailyData = [
  { day: "Mon", amount: 42000 },
  { day: "Tue", amount: 56000 },
  { day: "Wed", amount: 48000 },
  { day: "Thu", amount: 63000 },
  { day: "Fri", amount: 78000 },
  { day: "Sat", amount: 92000 },
  { day: "Sun", amount: 85000 },
];

const duePayments = [
  { customer: "Raj Enterprises",  amount: 15000, dueDate: "2026-03-05", days:  3 },
  { customer: "Sunrise Caterers", amount:  8500, dueDate: "2026-03-02", days: -1 },
  { customer: "ABC Events",       amount: 22000, dueDate: "2026-03-10", days:  7 },
];

// ── tip tracking mock data ──────────────────────────────────────────────────
const tipData = [
  { staff: "Ramesh K.",  role: "Waiter",    shift: "Morning (8–16)",  tips: 480, orders: 12 },
  { staff: "Sunita D.",  role: "Waiter",    shift: "Morning (8–16)",  tips: 350, orders:  9 },
  { staff: "Manoj P.",   role: "Bartender", shift: "Evening (16–24)", tips: 920, orders: 18 },
  { staff: "Geeta R.",   role: "Waiter",    shift: "Evening (16–24)", tips: 640, orders: 14 },
  { staff: "Vikram S.",  role: "Captain",   shift: "Morning (8–16)",  tips: 510, orders: 11 },
];

const tipPoolConfig = [
  { label: "Pool Type",      value: "Pooled" },
  { label: "Distribution",   value: "Proportional to hours worked" },
  { label: "Eligible Roles", value: "Waiter, Bartender, Captain" },
  { label: "Frequency",      value: "End of each shift" },
];

// ── refund mock data ────────────────────────────────────────────────────────
const initialRefunds = [
  { id: "REF-001", order: "#1230", amount:  850, reason: "Wrong item served",    status: "Approved", approvedBy: "Mgr. Anil" },
  { id: "REF-002", order: "#1235", amount: 1500, reason: "Customer dissatisfied", status: "Pending", approvedBy: "—" },
  { id: "REF-003", order: "#1220", amount: 3200, reason: "Duplicate charge",     status: "Approved", approvedBy: "Mgr. Anil" },
  { id: "REF-004", order: "#1238", amount:  600, reason: "Item out of stock",    status: "Rejected", approvedBy: "Mgr. Sunita" },
  { id: "REF-005", order: "#1241", amount: 2100, reason: "Payment error",        status: "Pending",  approvedBy: "—" },
];

// ── settlement mock data ────────────────────────────────────────────────────
const settlementData = [
  { mode: "Cash",   expected: 12400, actual: 12250 },
  { mode: "UPI",    expected: 34600, actual: 34600 },
  { mode: "Card",   expected: 28900, actual: 28750 },
  { mode: "Wallet", expected:  4800, actual:  4780 },
];
const VARIANCE_THRESHOLD = 200;

// ── failed payments mock data ───────────────────────────────────────────────
const initialFailed = [
  { id: "TXN-004", order: "#1242", amount: 4500, mode: "UPI",  time: "13:30", customer: "Amit P.",   reason: "Insufficient balance", retried: false },
  { id: "TXN-009", order: "#1237", amount: 2200, mode: "Card", time: "11:45", customer: "Neha V.",   reason: "Card declined",        retried: false },
  { id: "TXN-013", order: "#1231", amount: 1800, mode: "UPI",  time: "10:20", customer: "Suresh M.", reason: "Network timeout",      retried: false },
  { id: "TXN-017", order: "#1228", amount: 3600, mode: "Card", time: "09:05", customer: "Kavya R.",  reason: "Invalid CVV",          retried: true  },
];

// ── helpers ─────────────────────────────────────────────────────────────────
const refundStatusColor: Record<string, string> = {
  Approved: "bg-green-100 text-green-700",
  Pending:  "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-700",
};

export function Payments() {
  // refund dialog state
  const [refundOpen, setRefundOpen]         = useState(false);
  const [refundAmount, setRefundAmount]     = useState("");
  const [refundReason, setRefundReason]     = useState("");
  const [refundOrder, setRefundOrder]       = useState("");
  const [managerPin, setManagerPin]         = useState("");
  const [pinError, setPinError]             = useState(false);
  const [refunds, setRefunds]               = useState(initialRefunds);

  // settlement date range state
  const [settleDateFrom, setSettleDateFrom] = useState("2026-03-01");
  const [settleDateTo, setSettleDateTo]     = useState("2026-03-07");

  // failed payments state
  const [failedTxns, setFailedTxns]         = useState(initialFailed);

  function handleProcessRefund() {
    if (managerPin !== "1234") { setPinError(true); return; }
    const newRefund = {
      id:         `REF-00${refunds.length + 1}`,
      order:      refundOrder || "#—",
      amount:     Number(refundAmount) || 0,
      reason:     refundReason,
      status:     "Approved",
      approvedBy: "Mgr. Demo",
    };
    setRefunds([newRefund, ...refunds]);
    setRefundOpen(false);
    setRefundAmount(""); setRefundReason(""); setRefundOrder(""); setManagerPin(""); setPinError(false);
  }

  function handleRetry(id: string) {
    setFailedTxns(prev => prev.map(t => t.id === id ? { ...t, retried: true } : t));
  }

  const totalVariance = settlementData.reduce((s, r) => s + Math.abs(r.expected - r.actual), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Payments</h1>
          <p className="text-muted-foreground text-sm mt-1">Payment overview and transaction history</p>
        </div>
        <Button variant="outline" size="sm">Export Report</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: "₹12,380", change: "+8.2%", up: true,  icon: TrendingUp, color: "text-green-600" },
          { label: "UPI Payments",    value: "₹5,571",  change: "45%",   up: true,  icon: Smartphone, color: "text-blue-600" },
          { label: "Card Payments",   value: "₹3,962",  change: "32%",   up: false, icon: CreditCard, color: "text-purple-600" },
          { label: "Cash Collected",  value: "₹2,228",  change: "18%",   up: false, icon: Banknote,   color: "text-amber-600" },
        ].map(s => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                {s.up ? <ArrowUpRight className="w-3 h-3 text-green-500" /> : <ArrowDownRight className="w-3 h-3 text-muted-foreground" />}
                {s.change} of total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="flex-wrap gap-1">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="due">Due Payments</TabsTrigger>
          <TabsTrigger value="tips">Tip Tracking</TabsTrigger>
          <TabsTrigger value="refunds">Refund Management</TabsTrigger>
          <TabsTrigger value="settlement">Settlement</TabsTrigger>
          <TabsTrigger value="failed">Failed Payments</TabsTrigger>
        </TabsList>

        {/* ── existing: Transactions ── */}
        <TabsContent value="transactions" className="mt-4">
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <table className="w-full">
                <thead><tr className="border-b bg-muted/30">{["Txn ID","Order","Customer","Amount","Mode","Time","Status"].map(h=><th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>)}</tr></thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{t.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{t.order}</td>
                      <td className="px-4 py-3 text-sm">{t.customer}</td>
                      <td className="px-4 py-3 text-sm font-semibold">₹{t.amount.toLocaleString()}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{t.mode}</Badge></td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{t.time}</td>
                      <td className="px-4 py-3"><Badge className={`text-xs ${t.status === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{t.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── existing: Analytics ── */}
        <TabsContent value="analytics" className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="shadow-sm"><CardHeader><CardTitle className="text-sm">Daily Revenue (This Week)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={dailyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" tick={{fontSize:11}} /><YAxis tick={{fontSize:11}} tickFormatter={v => `₹${v/1000}k`} /><Tooltip formatter={(v: any) => `₹${v.toLocaleString()}`} /><Bar dataKey="amount" fill="#3b82f6" radius={[4,4,0,0]} /></BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="shadow-sm"><CardHeader><CardTitle className="text-sm">Payment Mode Mix</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart><Pie data={paymentMix} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">{paymentMix.map((e,i)=><Cell key={i} fill={e.color} />)}</Pie><Tooltip formatter={(v: any) => `${v}%`} /></PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {paymentMix.map(p => <div key={p.name} className="flex items-center gap-1 text-xs"><div className="w-2 h-2 rounded-full" style={{background:p.color}} />{p.name} {p.value}%</div>)}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── existing: Due Payments ── */}
        <TabsContent value="due" className="mt-4">
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <table className="w-full">
                <thead><tr className="border-b bg-muted/30">{["Customer","Amount Due","Due Date","Days","Action"].map(h=><th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>)}</tr></thead>
                <tbody>
                  {duePayments.map((d,i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 text-sm font-medium">{d.customer}</td>
                      <td className="px-4 py-3 text-sm font-bold text-red-600">₹{d.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{d.dueDate}</td>
                      <td className="px-4 py-3"><Badge className={`text-xs ${d.days < 0 ? "bg-red-100 text-red-700" : d.days <= 3 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>{d.days < 0 ? `${Math.abs(d.days)}d overdue` : `in ${d.days}d`}</Badge></td>
                      <td className="px-4 py-3"><Button size="sm" className="h-7 text-xs">Record Payment</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── NEW: Tip Tracking ── */}
        <TabsContent value="tips" className="mt-4 space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">Tips Collected — Today (per staff per shift)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    {["Staff","Role","Shift","Orders","Tips Collected","Avg / Order"].map(h =>
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {tipData.map((row, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 text-sm font-medium">{row.staff}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{row.role}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{row.shift}</td>
                      <td className="px-4 py-3 text-sm">{row.orders}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-700">₹{row.tips}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">₹{(row.tips / row.orders).toFixed(0)}</td>
                    </tr>
                  ))}
                  <tr className="bg-muted/30 font-semibold">
                    <td colSpan={4} className="px-4 py-3 text-sm">Total</td>
                    <td className="px-4 py-3 text-sm text-green-700">₹{tipData.reduce((s, r) => s + r.tips, 0)}</td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-sm">Tip Pool Configuration</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {tipPoolConfig.map(cfg => (
                  <div key={cfg.label} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm text-muted-foreground">{cfg.label}</span>
                    <Badge variant="outline" className="text-xs font-medium">{cfg.value}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-sm">Shift Distribution Summary</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { shift: "Morning (8–16)",  total: tipData.filter(t => t.shift.startsWith("Morning")).reduce((s, r) => s + r.tips, 0),  staff: tipData.filter(t => t.shift.startsWith("Morning")).length },
                  { shift: "Evening (16–24)", total: tipData.filter(t => t.shift.startsWith("Evening")).reduce((s, r) => s + r.tips, 0), staff: tipData.filter(t => t.shift.startsWith("Evening")).length },
                ].map(s => (
                  <div key={s.shift} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{s.shift}</p>
                      <p className="text-xs text-muted-foreground">{s.staff} staff members</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-700">₹{s.total}</p>
                      <p className="text-xs text-muted-foreground">₹{(s.total / s.staff).toFixed(0)} / person</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── NEW: Refund Management ── */}
        <TabsContent value="refunds" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{refunds.filter(r => r.status === "Pending").length} pending refund(s) awaiting approval</p>
            <Button size="sm" onClick={() => setRefundOpen(true)}>+ Process Refund</Button>
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    {["Refund ID","Order #","Amount","Reason","Status","Approved By"].map(h =>
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {refunds.map(r => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{r.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{r.order}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-red-600">₹{r.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground max-w-[180px] truncate">{r.reason}</td>
                      <td className="px-4 py-3"><Badge className={`text-xs ${refundStatusColor[r.status]}`}>{r.status}</Badge></td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{r.approvedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Dialog open={refundOpen} onOpenChange={open => { setRefundOpen(open); if (!open) setPinError(false); }}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Process Refund</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1">
                  <Label htmlFor="ref-order">Order #</Label>
                  <Input id="ref-order" placeholder="#1245" value={refundOrder} onChange={e => setRefundOrder(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ref-amount">Refund Amount (₹)</Label>
                  <Input id="ref-amount" type="number" placeholder="0" value={refundAmount} onChange={e => setRefundAmount(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ref-reason">Reason</Label>
                  <Select onValueChange={setRefundReason}>
                    <SelectTrigger id="ref-reason">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wrong item served">Wrong item served</SelectItem>
                      <SelectItem value="Duplicate charge">Duplicate charge</SelectItem>
                      <SelectItem value="Customer dissatisfied">Customer dissatisfied</SelectItem>
                      <SelectItem value="Item out of stock">Item out of stock</SelectItem>
                      <SelectItem value="Payment error">Payment error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="mgr-pin">Manager PIN</Label>
                  <Input
                    id="mgr-pin"
                    type="password"
                    maxLength={4}
                    placeholder="••••"
                    value={managerPin}
                    onChange={e => { setManagerPin(e.target.value); setPinError(false); }}
                  />
                  {pinError && <p className="text-xs text-red-600 mt-1">Incorrect PIN. Please try again.</p>}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setRefundOpen(false); setPinError(false); }}>Cancel</Button>
                <Button onClick={handleProcessRefund} disabled={!refundAmount || !refundReason || managerPin.length < 4}>
                  Approve Refund
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* ── NEW: Settlement ── */}
        <TabsContent value="settlement" className="mt-4 space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">End-of-Day Settlement</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">From</Label>
                  <Input type="date" className="h-7 text-xs w-36" value={settleDateFrom} onChange={e => setSettleDateFrom(e.target.value)} />
                  <Label className="text-xs text-muted-foreground">To</Label>
                  <Input type="date" className="h-7 text-xs w-36" value={settleDateTo} onChange={e => setSettleDateTo(e.target.value)} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    {["Payment Mode","Expected (₹)","Actual (₹)","Variance (₹)","Status"].map(h =>
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {settlementData.map(row => {
                    const variance = row.actual - row.expected;
                    const absVar   = Math.abs(variance);
                    const exceeded = absVar > VARIANCE_THRESHOLD;
                    return (
                      <tr key={row.mode} className="border-b last:border-0 hover:bg-muted/20">
                        <td className="px-4 py-3 text-sm font-medium">{row.mode}</td>
                        <td className="px-4 py-3 text-sm">₹{row.expected.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">₹{row.actual.toLocaleString()}</td>
                        <td className={`px-4 py-3 text-sm font-semibold ${exceeded ? "text-red-600" : "text-green-600"}`}>
                          {variance < 0 ? "-" : "+"}₹{absVar.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={`text-xs ${exceeded ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                            {exceeded ? "Variance!" : "Balanced"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-muted/30 font-semibold">
                    <td className="px-4 py-3 text-sm">Total</td>
                    <td className="px-4 py-3 text-sm">₹{settlementData.reduce((s, r) => s + r.expected, 0).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">₹{settlementData.reduce((s, r) => s + r.actual, 0).toLocaleString()}</td>
                    <td className={`px-4 py-3 text-sm ${totalVariance > VARIANCE_THRESHOLD ? "text-red-600" : "text-green-600"}`}>
                      ₹{totalVariance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${totalVariance > VARIANCE_THRESHOLD ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {totalVariance > VARIANCE_THRESHOLD ? "Review Required" : "OK"}
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Variance threshold: ₹{VARIANCE_THRESHOLD}. Rows highlighted in red exceed this threshold.
          </p>
        </TabsContent>

        {/* ── NEW: Failed Payments ── */}
        <TabsContent value="failed" className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            {failedTxns.filter(t => !t.retried).length} unresolved failed transaction(s)
          </p>
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/30">
                    {["Txn ID","Order","Customer","Amount","Mode","Time","Failure Reason","Action"].map(h =>
                      <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {failedTxns.map(t => (
                    <tr key={t.id} className={`border-b last:border-0 hover:bg-muted/20 ${t.retried ? "opacity-50" : ""}`}>
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{t.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{t.order}</td>
                      <td className="px-4 py-3 text-sm">{t.customer}</td>
                      <td className="px-4 py-3 text-sm font-semibold">₹{t.amount.toLocaleString()}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{t.mode}</Badge></td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{t.time}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />{t.reason}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {t.retried
                          ? <Badge className="text-xs bg-blue-100 text-blue-700">Retried</Badge>
                          : <Button size="sm" variant="outline" className="h-7 text-xs gap-1" onClick={() => handleRetry(t.id)}><RefreshCw className="w-3 h-3" /> Retry</Button>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

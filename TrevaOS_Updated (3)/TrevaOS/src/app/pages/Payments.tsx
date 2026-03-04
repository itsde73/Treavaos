import { CreditCard, Smartphone, Banknote, TrendingUp, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const transactions = [
  { id: "TXN-001", order: "#1245", amount: 1850, mode: "UPI", time: "14:32", status: "success", customer: "Rahul S." },
  { id: "TXN-002", order: "#1244", amount: 3200, mode: "Card", time: "14:10", status: "success", customer: "Priya M." },
  { id: "TXN-003", order: "#1243", amount: 650, mode: "Cash", time: "13:55", status: "success", customer: "Walk-in" },
  { id: "TXN-004", order: "#1242", amount: 4500, mode: "UPI", time: "13:30", status: "failed", customer: "Amit P." },
  { id: "TXN-005", order: "#1241", amount: 1200, mode: "Card", time: "13:15", status: "success", customer: "Sneha G." },
  { id: "TXN-006", order: "#1240", amount: 980, mode: "Cash", time: "12:50", status: "success", customer: "Walk-in" },
];

const paymentMix = [
  { name: "UPI", value: 45, color: "#3b82f6" },
  { name: "Card", value: 32, color: "#10b981" },
  { name: "Cash", value: 18, color: "#f59e0b" },
  { name: "Wallet", value: 5, color: "#8b5cf6" },
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
  { customer: "Raj Enterprises", amount: 15000, dueDate: "2026-03-05", days: 3 },
  { customer: "Sunrise Caterers", amount: 8500, dueDate: "2026-03-02", days: -1 },
  { customer: "ABC Events", amount: 22000, dueDate: "2026-03-10", days: 7 },
];

export function Payments() {
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
          { label: "Today's Revenue", value: "₹12,380", change: "+8.2%", up: true, icon: TrendingUp, color: "text-green-600" },
          { label: "UPI Payments", value: "₹5,571", change: "45%", up: true, icon: Smartphone, color: "text-blue-600" },
          { label: "Card Payments", value: "₹3,962", change: "32%", up: false, icon: CreditCard, color: "text-purple-600" },
          { label: "Cash Collected", value: "₹2,228", change: "18%", up: false, icon: Banknote, color: "text-amber-600" },
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
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="due">Due Payments</TabsTrigger>
        </TabsList>
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
      </Tabs>
    </div>
  );
}

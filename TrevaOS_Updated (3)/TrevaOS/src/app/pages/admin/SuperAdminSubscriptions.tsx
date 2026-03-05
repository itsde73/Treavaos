import { CreditCard, TrendingUp, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

const SUBSCRIPTIONS = [
  { outlet: "Downtown Bistro", plan: "Pro", status: "active", nextBilling: "2026-04-01", amount: 4999, seats: 18 },
  { outlet: "Mall Express", plan: "Enterprise", status: "active", nextBilling: "2026-04-01", amount: 9999, seats: 12 },
  { outlet: "Airport Lounge", plan: "Enterprise", status: "active", nextBilling: "2026-04-10", amount: 9999, seats: 28 },
  { outlet: "Cloud Kitchen HQ", plan: "Basic", status: "trial", nextBilling: "2026-03-15", amount: 1999, seats: 8 },
  { outlet: "Seaside Cafe", plan: "Pro", status: "active", nextBilling: "2026-04-05", amount: 4999, seats: 14 },
  { outlet: "Heritage Restaurant", plan: "Pro", status: "overdue", nextBilling: "2026-02-18", amount: 4999, seats: 22 },
];

const planColors: Record<string, string> = {
  Basic:      "bg-blue-100 text-blue-700 border-blue-200",
  Pro:        "bg-purple-100 text-purple-700 border-purple-200",
  Enterprise: "bg-orange-100 text-orange-700 border-orange-200",
};

const statusColors: Record<string, string> = {
  active:  "bg-green-100 text-green-700 border-green-200",
  trial:   "bg-amber-100 text-amber-700 border-amber-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
};

export function SuperAdminSubscriptions() {
  const totalMRR = SUBSCRIPTIONS.filter(s => s.status === "active").reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Subscriptions & Billing</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage platform subscription plans and billing</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total MRR", value: `₹${(totalMRR / 1000).toFixed(1)}K`, icon: TrendingUp, color: "text-green-500" },
          { label: "Active Subs", value: SUBSCRIPTIONS.filter(s => s.status === "active").length, icon: CheckCircle, color: "text-blue-500" },
          { label: "Trial Accounts", value: SUBSCRIPTIONS.filter(s => s.status === "trial").length, icon: Users, color: "text-amber-500" },
          { label: "Overdue", value: SUBSCRIPTIONS.filter(s => s.status === "overdue").length, icon: CreditCard, color: "text-red-500" },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="pt-4 flex items-center gap-3">
              <k.icon className={`w-8 h-8 ${k.color}`} />
              <div>
                <p className="text-xl font-bold">{k.value}</p>
                <p className="text-sm text-muted-foreground">{k.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subscriptions table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> All Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Outlet</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Plan</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Amount/mo</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Seats</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Next Billing</th>
                </tr>
              </thead>
              <tbody>
                {SUBSCRIPTIONS.map(s => (
                  <tr key={s.outlet} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium">{s.outlet}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs ${planColors[s.plan]}`}>{s.plan}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs capitalize ${statusColors[s.status]}`}>{s.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">₹{s.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{s.seats}</td>
                    <td className="px-4 py-3 text-muted-foreground">{s.nextBilling}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

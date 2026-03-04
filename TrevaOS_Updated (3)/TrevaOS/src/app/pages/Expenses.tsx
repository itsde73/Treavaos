import { useState } from "react";
import { Wallet, Plus, TrendingUp, FileText, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const expenses = [
  { id: 1, title: "Vegetable Purchase", category: "Raw Material", amount: 4500, date: "2026-03-03", paidBy: "Cash", approvedBy: "Manager", status: "approved" },
  { id: 2, title: "Gas Cylinder", category: "Utilities", amount: 1800, date: "2026-03-02", paidBy: "Cash", approvedBy: "Manager", status: "approved" },
  { id: 3, title: "Staff Uniforms", category: "Staff", amount: 12000, date: "2026-03-01", paidBy: "Bank Transfer", approvedBy: "Owner", status: "approved" },
  { id: 4, title: "Kitchen Equipment Repair", category: "Maintenance", amount: 5500, date: "2026-02-28", paidBy: "Cash", approvedBy: "Pending", status: "pending" },
  { id: 5, title: "Packaging Material", category: "Packaging", amount: 2300, date: "2026-02-27", paidBy: "Cash", approvedBy: "Manager", status: "approved" },
];

const categories = [
  { name: "Raw Material", count: 12, total: 48000, color: "bg-orange-100 text-orange-700" },
  { name: "Utilities", count: 5, total: 12000, color: "bg-blue-100 text-blue-700" },
  { name: "Staff", count: 3, total: 35000, color: "bg-purple-100 text-purple-700" },
  { name: "Maintenance", count: 7, total: 18500, color: "bg-red-100 text-red-700" },
  { name: "Packaging", count: 8, total: 9200, color: "bg-green-100 text-green-700" },
  { name: "Marketing", count: 2, total: 15000, color: "bg-pink-100 text-pink-700" },
];

export function Expenses() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expenses</h1>
          <p className="text-muted-foreground text-sm mt-1">Track and manage restaurant expenses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Add Category</Button>
          <Button className="gap-2"><Plus className="w-4 h-4" />Add Expense</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "This Month", value: "₹1,37,700", sub: "+12% vs last month", color: "text-blue-600" },
          { label: "Today", value: "₹6,300", sub: "3 expenses", color: "text-green-600" },
          { label: "Pending Approval", value: "1", sub: "₹5,500 pending", color: "text-amber-600" },
          { label: "Largest Category", value: "Raw Material", sub: "₹48,000", color: "text-purple-600" },
        ].map(s => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="list">
        <TabsList><TabsTrigger value="list">Expense List</TabsTrigger><TabsTrigger value="categories">Categories</TabsTrigger></TabsList>
        <TabsContent value="list" className="mt-4">
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <table className="w-full">
                <thead><tr className="border-b bg-muted/30">{["Title","Category","Amount","Date","Paid By","Status",""].map(h=><th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>)}</tr></thead>
                <tbody>
                  {expenses.map(e => (
                    <tr key={e.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3 text-sm font-medium">{e.title}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{e.category}</Badge></td>
                      <td className="px-4 py-3 text-sm font-semibold">₹{e.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{e.date}</td>
                      <td className="px-4 py-3 text-sm">{e.paidBy}</td>
                      <td className="px-4 py-3"><Badge className={`text-xs ${e.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{e.status}</Badge></td>
                      <td className="px-4 py-3"><Button size="sm" variant="ghost" className="text-xs h-7">Edit</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories" className="mt-4">
          <div className="grid grid-cols-3 gap-4">
            {categories.map(cat => (
              <Card key={cat.name} className="shadow-sm">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`text-xs ${cat.color}`}><Tag className="w-3 h-3 mr-1" />{cat.name}</Badge>
                    <Button size="sm" variant="ghost" className="text-xs h-7">Edit</Button>
                  </div>
                  <p className="text-xl font-bold">₹{cat.total.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.count} expenses this month</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

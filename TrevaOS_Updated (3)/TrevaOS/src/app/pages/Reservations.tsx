import { useState } from "react";
import { CalendarCheck, Clock, Users, Phone, Plus, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";

const reservations = [
  { id: 1, name: "Rahul Sharma", phone: "+91 98765 43210", pax: 4, date: "2026-03-03", time: "19:00", table: "Table 5", status: "confirmed", occasion: "Birthday" },
  { id: 2, name: "Priya Mehta", phone: "+91 87654 32109", pax: 2, date: "2026-03-03", time: "20:00", table: "Table 2", status: "confirmed", occasion: "" },
  { id: 3, name: "Amit Patel", phone: "+91 76543 21098", pax: 6, date: "2026-03-03", time: "19:30", table: "Table 8", status: "pending", occasion: "Anniversary" },
  { id: 4, name: "Sneha Gupta", phone: "+91 65432 10987", pax: 3, date: "2026-03-03", time: "21:00", table: "Table 4", status: "cancelled", occasion: "" },
  { id: 5, name: "Vikram Singh", phone: "+91 54321 09876", pax: 8, date: "2026-03-04", time: "19:00", table: "Private Room", status: "confirmed", occasion: "Corporate" },
];

const statusStyle: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
};

export function Reservations() {
  const [search, setSearch] = useState("");
  const filtered = reservations.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reservations</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage table bookings and guest reservations</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" />New Reservation</Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Today's Reservations", value: reservations.filter(r => r.date === "2026-03-03").length, color: "text-blue-600" },
          { label: "Confirmed", value: reservations.filter(r => r.status === "confirmed").length, color: "text-green-600" },
          { label: "Pending", value: reservations.filter(r => r.status === "pending").length, color: "text-yellow-600" },
          { label: "Total Covers", value: reservations.reduce((a, r) => a + r.pax, 0), color: "text-purple-600" },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-sm">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Input placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} className="w-72 h-9 text-sm" />
        <Button variant="outline" size="sm">Today</Button>
        <Button variant="outline" size="sm">Tomorrow</Button>
        <Button variant="outline" size="sm">This Week</Button>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                {["Guest", "Date & Time", "Pax", "Table", "Occasion", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{r.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground"><CalendarCheck className="w-3.5 h-3.5" />{r.date}</div>
                    <div className="flex items-center gap-1 text-muted-foreground mt-0.5"><Clock className="w-3.5 h-3.5" />{r.time}</div>
                  </td>
                  <td className="px-4 py-3"><span className="flex items-center gap-1 text-sm"><Users className="w-3.5 h-3.5 text-muted-foreground" />{r.pax}</span></td>
                  <td className="px-4 py-3 text-sm font-medium">{r.table}</td>
                  <td className="px-4 py-3">{r.occasion ? <Badge variant="outline" className="text-xs">{r.occasion}</Badge> : <span className="text-muted-foreground text-xs">—</span>}</td>
                  <td className="px-4 py-3"><Badge className={`text-xs ${statusStyle[r.status]}`}>{r.status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {r.status !== "cancelled" && <Button size="sm" variant="outline" className="h-7 px-2 text-xs">Edit</Button>}
                      {r.status === "pending" && <Button size="sm" className="h-7 px-2 text-xs gap-1"><Check className="w-3 h-3" />Confirm</Button>}
                      {r.status !== "cancelled" && <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-red-500"><X className="w-3 h-3" /></Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

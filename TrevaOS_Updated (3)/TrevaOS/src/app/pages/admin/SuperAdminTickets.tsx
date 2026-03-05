import { Ticket, Search, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useState } from "react";

const DEMO_TICKETS = [
  { id: "TKT-001", outlet: "Downtown Bistro", subject: "POS terminal not connecting to printer", priority: "high", status: "open", created: "2026-03-04", assignee: "Support Team" },
  { id: "TKT-002", outlet: "Mall Express", subject: "Need to add new payment gateway", priority: "medium", status: "in-progress", created: "2026-03-03", assignee: "Integration Team" },
  { id: "TKT-003", outlet: "Airport Lounge", subject: "Menu sync issue between outlets", priority: "low", status: "resolved", created: "2026-03-01", assignee: "Support Team" },
  { id: "TKT-004", outlet: "Cloud Kitchen HQ", subject: "Monthly billing discrepancy", priority: "high", status: "open", created: "2026-03-05", assignee: "Billing Team" },
  { id: "TKT-005", outlet: "Downtown Bistro", subject: "Request for custom report format", priority: "low", status: "pending", created: "2026-03-02", assignee: "Product Team" },
];

const priorityColors: Record<string, string> = {
  high:   "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low:    "bg-blue-100 text-blue-700 border-blue-200",
};

const statusColors: Record<string, string> = {
  open:        "bg-red-100 text-red-700 border-red-200",
  "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
  pending:     "bg-amber-100 text-amber-700 border-amber-200",
  resolved:    "bg-green-100 text-green-700 border-green-200",
};

export function SuperAdminTickets() {
  const [search, setSearch] = useState("");

  const filtered = DEMO_TICKETS.filter(t =>
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.outlet.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  const open     = DEMO_TICKETS.filter(t => t.status === "open").length;
  const inProg   = DEMO_TICKETS.filter(t => t.status === "in-progress").length;
  const resolved = DEMO_TICKETS.filter(t => t.status === "resolved").length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Support Tickets</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Manage support requests from all outlets</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Open", value: open,     icon: AlertCircle, color: "text-red-500"  },
          { label: "In Progress", value: inProg, icon: Clock, color: "text-blue-500" },
          { label: "Resolved", value: resolved, icon: CheckCircle, color: "text-green-500" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className="pt-4 flex items-center gap-3">
              <s.icon className={`w-8 h-8 ${s.color}`} />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search tickets..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {/* Tickets list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Ticket className="w-4 h-4" /> Tickets ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filtered.map(ticket => (
              <div key={ticket.id} className="px-4 py-3 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">{ticket.id}</span>
                      <Badge variant="outline" className={`text-xs ${priorityColors[ticket.priority]}`}>{ticket.priority}</Badge>
                      <Badge variant="outline" className={`text-xs capitalize ${statusColors[ticket.status]}`}>{ticket.status.replace("-", " ")}</Badge>
                    </div>
                    <p className="font-medium text-sm">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ticket.outlet} · {ticket.created} · {ticket.assignee}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button size="sm" variant="outline" className="h-7 text-xs px-2">View</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs px-2">Assign</Button>
                    {ticket.status !== "resolved" && (
                      <Button size="sm" variant="outline" className="h-7 text-xs px-2">Close</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

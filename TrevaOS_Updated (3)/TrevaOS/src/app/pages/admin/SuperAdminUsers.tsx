import { Users, Search, Shield, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { useState } from "react";

const DEMO_USERS = [
  { id: "u-1", name: "TrevaOS Admin", email: "admin@trevaos.com", role: "super_admin", status: "active", joinedDate: "2025-01-01", outlets: [] },
  { id: "u-2", name: "Rajesh Kumar", email: "owner@downtown.com", role: "outlet_owner", status: "active", joinedDate: "2025-06-15", outlets: ["Downtown Bistro"] },
  { id: "u-3", name: "Priya Sharma", email: "owner@mall.com", role: "outlet_owner", status: "active", joinedDate: "2025-08-20", outlets: ["Mall Express"] },
  { id: "u-4", name: "Vikram Patel", email: "owner@airport.com", role: "outlet_owner", status: "active", joinedDate: "2025-04-10", outlets: ["Airport Lounge"] },
  { id: "u-5", name: "Anita Desai", email: "owner@cloudkitchen.com", role: "outlet_owner", status: "trial", joinedDate: "2026-02-01", outlets: ["Cloud Kitchen HQ"] },
  { id: "u-6", name: "Suresh Nair", email: "owner@seaside.com", role: "outlet_owner", status: "active", joinedDate: "2025-10-05", outlets: ["Seaside Cafe"] },
  { id: "u-7", name: "Meera Joshi", email: "owner@heritage.com", role: "outlet_owner", status: "inactive", joinedDate: "2025-03-18", outlets: ["Heritage Restaurant"] },
];

const statusColors: Record<string, string> = {
  active:   "bg-green-100 text-green-700 border-green-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
  trial:    "bg-amber-100 text-amber-700 border-amber-200",
};

export function SuperAdminUsers() {
  const [search, setSearch] = useState("");

  const filtered = DEMO_USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage all platform users</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm px-3 py-1 bg-purple-50 text-purple-700 border-purple-200">
            {DEMO_USERS.filter(u => u.role === "super_admin").length} Admins
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
            {DEMO_USERS.filter(u => u.role === "outlet_owner").length} Owners
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4" /> All Users ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Outlets</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {user.role === "super_admin" ? <Shield className="w-3.5 h-3.5 text-purple-500" /> : <Store className="w-3.5 h-3.5 text-blue-500" />}
                        <span className="text-xs font-medium">
                          {user.role === "super_admin" ? "Super Admin" : "Outlet Owner"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-xs capitalize ${statusColors[user.status]}`}>{user.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {user.outlets.length > 0 ? user.outlets.join(", ") : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{user.joinedDate}</td>
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

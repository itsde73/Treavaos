import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard, Building2, Ticket, CreditCard, Users,
  BarChart3, Settings, LogOut, Bell, Store, ChevronLeft, ChevronRight, Shield,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { name: "Dashboard",            href: "/admin",               icon: LayoutDashboard },
  { name: "Outlets",              href: "/admin/outlets",        icon: Building2       },
  { name: "Support Tickets",      href: "/admin/tickets",        icon: Ticket          },
  { name: "Subscriptions",        href: "/admin/subscriptions",  icon: CreditCard      },
  { name: "Users",                href: "/admin/users",          icon: Users           },
  { name: "Platform Analytics",   href: "/admin/analytics",      icon: BarChart3       },
  { name: "Platform Settings",    href: "/admin/settings",       icon: Settings        },
];

export function SuperAdminLayout() {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const isActive = (href: string) => {
    if (href === "/admin") return location.pathname === "/admin";
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* ── Sidebar ── */}
      <aside className={`${collapsed ? "w-[60px]" : "w-60"} border-r border-border bg-slate-900 flex flex-col flex-shrink-0 transition-all duration-200`}>
        {/* Logo */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-white/10 flex-shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Store className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <span className="font-bold text-white text-sm">TrevaOS</span>
                <p className="text-[10px] text-slate-400 leading-none">Admin Panel</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost" size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white hover:bg-white/10 w-7 h-7 flex-shrink-0 ml-auto"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </Button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-sm font-medium
                  ${active
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-2 border-t border-white/10">
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 text-xs">
              <Shield className="w-3 h-3" /> Super Admin
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="w-8 h-8 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
            </Button>

            {/* Admin info */}
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  {authUser ? authUser.name.slice(0, 2).toUpperCase() : "AD"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold leading-none">{authUser?.name ?? "Admin"}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{authUser?.email ?? ""}</p>
              </div>
            </div>

            {/* Quick logout */}
            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleLogout} title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

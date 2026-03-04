import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard, UtensilsCrossed, Bell, CalendarCheck, ShoppingCart,
  ClipboardList, Users, UserCheck, Bike, CreditCard, BarChart3,
  Sparkles, Landmark, Package, ChefHat, Settings as SettingsIcon, Search,
  ChevronLeft, ChevronRight, Store, ChevronDown, ChevronUp, User, LogOut,
  Moon, Sun, Grid3x3, Wallet, ShieldAlert, RefreshCw,
} from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useStaff, DEMO_STAFF, type RolePermissions } from "../context/StaffContext";

const ROLE_COLORS: Record<string, string> = {
  Admin:     "bg-red-100 text-red-700 border-red-200",
  Manager:   "bg-purple-100 text-purple-700 border-purple-200",
  Captain:   "bg-blue-100 text-blue-700 border-blue-200",
  Steward:   "bg-cyan-100 text-cyan-700 border-cyan-200",
  Cashier:   "bg-green-100 text-green-700 border-green-200",
  Chef:      "bg-orange-100 text-orange-700 border-orange-200",
  Bartender: "bg-violet-100 text-violet-700 border-violet-200",
};

// All nav items — permKey matches RolePermissions keys in StaffContext
const navigation: any[] = [
  { name: "Dashboard",          href: "/",                   icon: LayoutDashboard,  permKey: "dashboard"      },
  { name: "Menu",               icon: UtensilsCrossed,       permKey: "menu",        children: [
    { name: "Menus",                   href: "/menu"                  },
    { name: "Menu Items",              href: "/menu/items"            },
    { name: "Item Categories",         href: "/menu/categories"       },
    { name: "Modifier Groups",         href: "/menu/modifier-groups"  },
    { name: "Item Modifiers",          href: "/menu/modifiers"        },
  ]},
  { name: "Tables",             icon: Grid3x3,               permKey: "tables",      children: [
    { name: "Areas",                   href: "/tables/areas"          },
    { name: "Tables",                  href: "/tables"                },
    { name: "QR Codes",                href: "/tables/qr-codes"       },
  ]},
  { name: "Waiter Requests",    href: "/waiter-requests",    icon: Bell,             permKey: "waiterRequests" },
  { name: "Reservations",       href: "/reservations",       icon: CalendarCheck,    permKey: "reservations"   },
  { name: "POS",                href: "/pos",                icon: ShoppingCart,     permKey: "pos"            },
  // Bar is an area within Tables + a tab in Kitchens — not a separate sidebar item
  { name: "Orders",             href: "/orders",             icon: ClipboardList,    permKey: "orders"         },
  { name: "Customers",          href: "/crm",                icon: Users,            permKey: "customers"      },
  { name: "Staff",              href: "/staff",              icon: UserCheck,        permKey: "staff"          },
  { name: "Delivery Executive", href: "/delivery",           icon: Bike,             permKey: "delivery"       },
  { name: "Expenses",           icon: Wallet,                permKey: "expenses",    children: [
    { name: "Expense List",            href: "/expenses"              },
    { name: "Expense Categories",      href: "/expenses/categories"   },
  ]},
  { name: "Payments",           icon: CreditCard,            permKey: "payments",    children: [
    { name: "Payment Overview",        href: "/payments"              },
    { name: "Transactions",            href: "/payments/transactions" },
    { name: "Due Payments",            href: "/payments/due"          },
  ]},
  { name: "Reports",            icon: BarChart3,             permKey: "reports",     children: [
    { name: "Sales Report",            href: "/reports"               },
    { name: "Item Report",             href: "/reports/items"         },
    { name: "Category Report",         href: "/reports/categories"    },
    { name: "Delivery App Report",     href: "/reports/delivery"      },
    { name: "Expense Reports",         href: "/reports/expenses"      },
    { name: "POS Machine Report",      href: "/reports/pos-machine"   },
    { name: "Cancelled Order Report",  href: "/reports/cancelled"     },
    { name: "Removed KOT Item Report", href: "/reports/removed-kot"   },
    { name: "Tax Report",              href: "/reports/tax"           },
    { name: "Refund Report",           href: "/reports/refunds"       },
    { name: "Loyalty Reports",         href: "/reports/loyalty"       },
    { name: "Due Payments Received",   href: "/reports/due-payments"  },
  ]},
  { name: "AI Assistant",       href: "/ai-assistant",       icon: Sparkles,         permKey: "aiAssistant"    },
  { name: "Cash Register",      icon: Landmark,              permKey: "cashRegister", children: [
    { name: "Register Dashboard",      href: "/cash-register"              },
    { name: "Cash Register",           href: "/cash-register/manage"       },
    { name: "Reports",                 href: "/cash-register/reports"      },
    { name: "Approvals",               href: "/cash-register/approvals"    },
    { name: "Denominations",           href: "/cash-register/denominations"},
    { name: "Register Settings",       href: "/cash-register/settings"     },
  ]},
  { name: "Inventory",          icon: Package,               permKey: "inventory",   children: [
    { name: "Dashboard",               href: "/inventory"                  },
    { name: "Units",                   href: "/inventory/units"            },
    { name: "Inventory Items",         href: "/inventory/items"            },
    { name: "Inventory Item Categories",href: "/inventory/categories"      },
    { name: "Inventory Stocks",        href: "/inventory/stocks"           },
    { name: "Inventory Movements",     href: "/inventory/movements"        },
    { name: "Recipes",                 href: "/inventory/recipes"          },
    { name: "Batch Recipes",           href: "/inventory/batch-recipes"    },
    { name: "Batch Inventory",         href: "/inventory/batch"            },
    { name: "Purchase Orders",         href: "/inventory/purchase-orders"  },
    { name: "Suppliers",               href: "/inventory/suppliers"        },
    { name: "Reports",                 href: "/inventory/reports"          },
    { name: "Batch Reports",           href: "/inventory/batch-reports"    },
    { name: "Settings",                href: "/inventory/settings"         },
  ]},
  { name: "Kitchens",           icon: ChefHat,               permKey: "kitchens",    children: [
    { name: "Kitchen Settings",        href: "/kitchens/settings"          },
    { name: "All Kitchen KOT",         href: "/kitchens/kot"               },
    { name: "Default Kitchen",         href: "/kitchens/default"           },
  ]},
  { name: "Settings",           href: "/settings",           icon: SettingsIcon,     permKey: "settings"       },
];

const outlets = [
  { id: 1, name: "Demo - Hyd" },
  { id: 2, name: "Mall Branch" },
  { id: 3, name: "Airport Branch" },
];

export function Layout() {
  const { currentStaff, permissions, setCurrentStaff } = useStaff();
  const [sidebarCollapsed, setSidebarCollapsed]     = useState(false);
  const [expandedGroups, setExpandedGroups]         = useState(["Tables", "Kitchens"]);
  const [selectedOutlet, setSelectedOutlet]         = useState(outlets[0]);
  const [darkMode, setDarkMode]                     = useState(false);
  const [showStaffSwitch, setShowStaffSwitch]       = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  const isGroupActive = (item: any) => item.children?.some((c: any) => isActive(c.href)) ?? false;

  const toggleGroup = (name: string) =>
    setExpandedGroups(prev => prev.includes(name) ? prev.filter(g => g !== name) : [...prev, name]);

  // Filter navigation by current staff's permissions
  const visibleNav = navigation.filter(item =>
    permissions[item.permKey as keyof RolePermissions] === true
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-screen bg-background">

        {/* ── Sidebar ── */}
        <aside className={`${sidebarCollapsed ? "w-[60px]" : "w-60"} border-r border-sidebar-border bg-sidebar transition-all duration-200 flex flex-col flex-shrink-0`}>
          {/* Logo row */}
          <div className="h-14 flex items-center justify-between px-3 border-b border-sidebar-border flex-shrink-0">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <Store className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-sidebar-foreground text-sm">TrevaOS</span>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-sidebar-foreground hover:bg-sidebar-accent w-7 h-7 flex-shrink-0 ml-auto">
              {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </Button>
          </div>

          {/* Staff mini-card — click to switch */}
          {!sidebarCollapsed && (
            <button onClick={() => setShowStaffSwitch(true)}
              className="mx-2 my-2 flex items-center gap-2 p-2 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors text-left w-[calc(100%-16px)]">
              <Avatar className="w-7 h-7 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">{currentStaff.avatar}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate leading-none mb-1">{currentStaff.name}</p>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${ROLE_COLORS[currentStaff.role]}`}>
                  {currentStaff.role}
                </Badge>
              </div>
              <RefreshCw className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            </button>
          )}

          {/* Role-filtered navigation */}
          <nav className="flex-1 overflow-y-auto py-1 px-1.5 space-y-0.5">
            {visibleNav.map((item: any) => {
              const Icon = item.icon;
              const hasChildren = !!item.children;
              const groupActive = isGroupActive(item);
              const isExpanded = expandedGroups.includes(item.name);

              if (!hasChildren) {
                const active = item.href ? isActive(item.href) : false;
                return (
                  <Link key={item.name} to={item.href} title={sidebarCollapsed ? item.name : undefined}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-sm font-medium
                      ${active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              }

              return (
                <div key={item.name}>
                  <button onClick={() => !sidebarCollapsed && toggleGroup(item.name)}
                    title={sidebarCollapsed ? item.name : undefined}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-sm font-medium
                      ${groupActive ? "text-primary" : "text-sidebar-foreground"} hover:bg-sidebar-accent`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
                      </>
                    )}
                  </button>
                  {!sidebarCollapsed && isExpanded && (
                    <div className="ml-4 mt-0.5 border-l border-border pl-2.5 space-y-0.5">
                      {item.children.map((child: any) => {
                        const childActive = isActive(child.href);
                        return (
                          <Link key={child.href} to={child.href}
                            className={`block px-2 py-1.5 rounded-md text-xs transition-colors
                              ${childActive ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}>
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 flex-1">
              {/* Outlet switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 h-8 text-xs">
                    <Store className="w-3.5 h-3.5" />{selectedOutlet.name}<ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Switch Outlet</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {outlets.map(o => (
                    <DropdownMenuItem key={o.id} onClick={() => setSelectedOutlet(o)} className="flex items-center justify-between">
                      <span>{o.name}</span>
                      {o.id === selectedOutlet.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input type="search" placeholder="Search orders, items, customers..." className="pl-8 h-8 text-sm" />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              <Button variant="ghost" size="icon" className="relative w-8 h-8">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full" />
              </Button>

              {/* Staff account dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 pl-2 pr-3 h-8">
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">{currentStaff.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                      <p className="text-xs font-semibold leading-none">{currentStaff.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{currentStaff.role}</p>
                    </div>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    <p className="font-semibold">{currentStaff.name}</p>
                    <Badge variant="outline" className={`text-xs mt-1 ${ROLE_COLORS[currentStaff.role]}`}>{currentStaff.role}</Badge>
                    {currentStaff.section && <p className="text-xs text-muted-foreground mt-0.5">Section: {currentStaff.section}</p>}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem><User className="w-4 h-4 mr-2" />Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowStaffSwitch(true)}>
                    <RefreshCw className="w-4 h-4 mr-2" />Switch Staff View
                  </DropdownMenuItem>
                  {permissions.settings && (
                    <DropdownMenuItem asChild>
                      <Link to="/settings"><SettingsIcon className="w-4 h-4 mr-2" />Settings</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive"><LogOut className="w-4 h-4 mr-2" />Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* ── Staff Switcher Modal ── */}
      <Dialog open={showStaffSwitch} onOpenChange={setShowStaffSwitch}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />Switch Staff View
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground -mt-1 mb-3">
            Select a staff member to preview their role-based access.
            The sidebar and POS actions update instantly based on their permissions
            (configured in <strong>Settings → Roles</strong>).
          </p>

          <div className="space-y-2">
            {DEMO_STAFF.map(staff => (
              <button key={staff.id}
                onClick={() => { setCurrentStaff(staff); setShowStaffSwitch(false); }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all hover:shadow-sm text-left
                  ${currentStaff.id === staff.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                <Avatar className="w-9 h-9 flex-shrink-0">
                  <AvatarFallback className="bg-muted font-bold text-sm">{staff.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{staff.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {staff.section ? `Section: ${staff.section}` : "No fixed section"}
                  </p>
                </div>
                <Badge variant="outline" className={`text-xs flex-shrink-0 ${ROLE_COLORS[staff.role]}`}>
                  {staff.role}
                </Badge>
                {currentStaff.id === staff.id && (
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              This is a demo switcher. In production, each staff member logs in with their own credentials and sees only their permitted modules.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

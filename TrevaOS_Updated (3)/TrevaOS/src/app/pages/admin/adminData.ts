// Shared demo data for the Super Admin panel

export const PLATFORM_OUTLETS = [
  { id: 1, name: "Downtown Bistro", location: "MG Road, Bangalore", status: "active", plan: "Pro", monthlyRevenue: 485000, todayRevenue: 45231, todayOrders: 267, tables: 24, staff: 18, healthScore: 94, joinedDate: "2025-06-15", ownerName: "Rajesh Kumar", ownerEmail: "owner@downtown.com" },
  { id: 2, name: "Mall Express", location: "Phoenix Mall, Mumbai", status: "active", plan: "Enterprise", monthlyRevenue: 380000, todayRevenue: 38500, todayOrders: 198, tables: 16, staff: 12, healthScore: 88, joinedDate: "2025-08-20", ownerName: "Priya Sharma", ownerEmail: "owner@mall.com" },
  { id: 3, name: "Airport Lounge", location: "T2, Delhi Airport", status: "active", plan: "Enterprise", monthlyRevenue: 620000, todayRevenue: 52800, todayOrders: 312, tables: 32, staff: 28, healthScore: 96, joinedDate: "2025-04-10", ownerName: "Vikram Patel", ownerEmail: "owner@airport.com" },
  { id: 4, name: "Cloud Kitchen HQ", location: "HSR Layout, Bangalore", status: "trial", plan: "Basic", monthlyRevenue: 185000, todayRevenue: 18200, todayOrders: 145, tables: 0, staff: 8, healthScore: 72, joinedDate: "2026-02-01", ownerName: "Anita Desai", ownerEmail: "owner@cloudkitchen.com" },
  { id: 5, name: "Seaside Cafe", location: "Marine Drive, Mumbai", status: "active", plan: "Pro", monthlyRevenue: 290000, todayRevenue: 28400, todayOrders: 156, tables: 20, staff: 14, healthScore: 91, joinedDate: "2025-10-05", ownerName: "Suresh Nair", ownerEmail: "owner@seaside.com" },
  { id: 6, name: "Heritage Restaurant", location: "Connaught Place, Delhi", status: "inactive", plan: "Pro", monthlyRevenue: 0, todayRevenue: 0, todayOrders: 0, tables: 30, staff: 22, healthScore: 0, joinedDate: "2025-03-18", ownerName: "Meera Joshi", ownerEmail: "owner@heritage.com" },
] as const;

export type PlatformOutlet = typeof PLATFORM_OUTLETS[number];

export const DEMO_TICKETS = [
  { id: "TKT-001", outlet: "Downtown Bistro", subject: "POS terminal not connecting to printer", priority: "high", status: "open", created: "2026-03-04", assignee: "Support Team" },
  { id: "TKT-002", outlet: "Mall Express", subject: "Need to add new payment gateway", priority: "medium", status: "in-progress", created: "2026-03-03", assignee: "Integration Team" },
  { id: "TKT-003", outlet: "Airport Lounge", subject: "Menu sync issue between outlets", priority: "low", status: "resolved", created: "2026-03-01", assignee: "Support Team" },
  { id: "TKT-004", outlet: "Cloud Kitchen HQ", subject: "Monthly billing discrepancy", priority: "high", status: "open", created: "2026-03-05", assignee: "Billing Team" },
  { id: "TKT-005", outlet: "Downtown Bistro", subject: "Request for custom report format", priority: "low", status: "pending", created: "2026-03-02", assignee: "Product Team" },
] as const;

export type DemoTicket = typeof DEMO_TICKETS[number];

export const STATUS_COLORS: Record<string, string> = {
  active:   "bg-green-100 text-green-700 border-green-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
  trial:    "bg-amber-100 text-amber-700 border-amber-200",
};

export const PLAN_COLORS: Record<string, string> = {
  Basic:      "bg-blue-100 text-blue-700 border-blue-200",
  Pro:        "bg-purple-100 text-purple-700 border-purple-200",
  Enterprise: "bg-orange-100 text-orange-700 border-orange-200",
};

export const PRIORITY_COLORS: Record<string, string> = {
  high:   "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low:    "bg-blue-100 text-blue-700 border-blue-200",
};

export const TICKET_STATUS_COLORS: Record<string, string> = {
  open:          "bg-red-100 text-red-700 border-red-200",
  "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
  pending:       "bg-amber-100 text-amber-700 border-amber-200",
  resolved:      "bg-green-100 text-green-700 border-green-200",
};

import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { OutletLogin } from "./pages/OutletLogin";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { POS } from "./pages/POS";
import { OrderManagement } from "./pages/OrderManagement";
import { TableManagement } from "./pages/TableManagement";
import { MenuManagement } from "./pages/MenuManagement";
import { Inventory } from "./pages/Inventory";
import { Staff } from "./pages/Staff";
import { CRM } from "./pages/CRM";
import { OnlineOrders } from "./pages/OnlineOrders";
import { Reports } from "./pages/Reports";
import { Finance } from "./pages/Finance";
import { Settings } from "./pages/Settings";
import { WaiterRequests } from "./pages/WaiterRequests";
import { Reservations } from "./pages/Reservations";
import { DeliveryExecutive } from "./pages/DeliveryExecutive";
import { Expenses } from "./pages/Expenses";
import { Payments } from "./pages/Payments";
import { AIAssistant } from "./pages/AIAssistant";
import { CashRegister } from "./pages/CashRegister";
import { Kitchens } from "./pages/Kitchens";
import { Bar } from "./pages/Bar";

export const router = createBrowserRouter([
  { path: "/outlets", Component: OutletLogin },
  { path: "/login", Component: Login },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "pos", Component: POS },
      { path: "bar", Component: Bar },
      { path: "orders", Component: OrderManagement },
      { path: "tables", Component: TableManagement },
      { path: "tables/areas", Component: TableManagement },
      { path: "tables/qr-codes", Component: TableManagement },
      { path: "menu", Component: MenuManagement },
      { path: "menu/items", Component: MenuManagement },
      { path: "menu/categories", Component: MenuManagement },
      { path: "menu/modifier-groups", Component: MenuManagement },
      { path: "menu/modifiers", Component: MenuManagement },
      { path: "inventory", Component: Inventory },
      { path: "inventory/items", Component: Inventory },
      { path: "inventory/categories", Component: Inventory },
      { path: "inventory/stocks", Component: Inventory },
      { path: "inventory/movements", Component: Inventory },
      { path: "inventory/recipes", Component: Inventory },
      { path: "inventory/batch-recipes", Component: Inventory },
      { path: "inventory/batch", Component: Inventory },
      { path: "inventory/purchase-orders", Component: Inventory },
      { path: "inventory/suppliers", Component: Inventory },
      { path: "inventory/reports", Component: Inventory },
      { path: "inventory/batch-reports", Component: Inventory },
      { path: "inventory/units", Component: Inventory },
      { path: "inventory/settings", Component: Inventory },
      { path: "staff", Component: Staff },
      { path: "crm", Component: CRM },
      { path: "online-orders", Component: OnlineOrders },
      { path: "reports", Component: Reports },
      { path: "reports/items", Component: Reports },
      { path: "reports/categories", Component: Reports },
      { path: "reports/delivery", Component: Reports },
      { path: "reports/expenses", Component: Reports },
      { path: "reports/pos-machine", Component: Reports },
      { path: "reports/cancelled", Component: Reports },
      { path: "reports/removed-kot", Component: Reports },
      { path: "reports/tax", Component: Reports },
      { path: "reports/refunds", Component: Reports },
      { path: "reports/loyalty", Component: Reports },
      { path: "reports/due-payments", Component: Reports },
      { path: "finance", Component: Finance },
      { path: "settings", Component: Settings },
      { path: "waiter-requests", Component: WaiterRequests },
      { path: "reservations", Component: Reservations },
      { path: "delivery", Component: DeliveryExecutive },
      { path: "expenses", Component: Expenses },
      { path: "expenses/categories", Component: Expenses },
      { path: "payments", Component: Payments },
      { path: "payments/transactions", Component: Payments },
      { path: "payments/due", Component: Payments },
      { path: "ai-assistant", Component: AIAssistant },
      { path: "cash-register", Component: CashRegister },
      { path: "cash-register/manage", Component: CashRegister },
      { path: "cash-register/reports", Component: CashRegister },
      { path: "cash-register/approvals", Component: CashRegister },
      { path: "cash-register/denominations", Component: CashRegister },
      { path: "cash-register/settings", Component: CashRegister },
      { path: "kitchens", Component: Kitchens },
      { path: "kitchens/settings", Component: Kitchens },
      { path: "kitchens/kot", Component: Kitchens },
      { path: "kitchens/default", Component: Kitchens },
    ],
  },
]);

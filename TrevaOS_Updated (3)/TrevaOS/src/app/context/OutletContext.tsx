import { createContext, useContext, useState, ReactNode } from "react";

export interface Outlet {
  id: number;
  name: string;
  address: string;
  status: "open" | "pre-open" | "closed";
  type: string;
  tables: number;
  staffOnDuty: number;
  todayRevenue: number;
  todayOrders: number;
}

export const DEMO_OUTLETS: Outlet[] = [
  {
    id: 1,
    name: "Downtown Bistro",
    address: "MG Road, Bangalore",
    status: "open",
    type: "Fine Dining",
    tables: 24,
    staffOnDuty: 12,
    todayRevenue: 125000,
    todayOrders: 423,
  },
  {
    id: 2,
    name: "Mall Express",
    address: "Phoenix Mall, Mumbai",
    status: "open",
    type: "QSR",
    tables: 16,
    staffOnDuty: 8,
    todayRevenue: 98000,
    todayOrders: 567,
  },
  {
    id: 3,
    name: "Airport Lounge",
    address: "T2, Delhi Airport",
    status: "pre-open",
    type: "Lounge & Bar",
    tables: 20,
    staffOnDuty: 6,
    todayRevenue: 156000,
    todayOrders: 312,
  },
  {
    id: 4,
    name: "Cloud Kitchen HQ",
    address: "HSR Layout, Bangalore",
    status: "open",
    type: "Cloud Kitchen",
    tables: 0,
    staffOnDuty: 5,
    todayRevenue: 87000,
    todayOrders: 445,
  },
];

interface OutletContextValue {
  currentOutlet: Outlet;
  setCurrentOutlet: (outlet: Outlet) => void;
}

const OutletContext = createContext<OutletContextValue | null>(null);

export function OutletProvider({ children }: { children: ReactNode }) {
  const [currentOutlet, setCurrentOutlet] = useState<Outlet>(DEMO_OUTLETS[0]);
  return (
    <OutletContext.Provider value={{ currentOutlet, setCurrentOutlet }}>
      {children}
    </OutletContext.Provider>
  );
}

export function useOutlet() {
  const ctx = useContext(OutletContext);
  if (!ctx) throw new Error("useOutlet must be used inside OutletProvider");
  return ctx;
}

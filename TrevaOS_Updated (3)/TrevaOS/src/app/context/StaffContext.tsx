import { createContext, useContext, useState, ReactNode } from "react";

export type StaffRole = "Admin" | "Manager" | "Captain" | "Steward" | "Cashier" | "Chef" | "Bartender";

export interface StaffMember {
  id: number;
  name: string;
  role: StaffRole;
  section?: string;
  avatar: string;
}

export interface RolePermissions {
  // Sidebar/module access
  dashboard: boolean;
  menu: boolean;
  tables: boolean;
  waiterRequests: boolean;
  reservations: boolean;
  pos: boolean;
  orders: boolean;
  customers: boolean;
  staff: boolean;
  delivery: boolean;
  expenses: boolean;
  payments: boolean;
  reports: boolean;
  aiAssistant: boolean;
  cashRegister: boolean;
  inventory: boolean;
  kitchens: boolean;
  settings: boolean;
  // POS-specific actions
  pos_takeOrder: boolean;
  pos_assignTable: boolean;
  pos_fireKOT: boolean;
  pos_fireBOT: boolean;
  pos_applyDiscount: boolean;
  pos_generateBill: boolean;
  pos_takePayment: boolean;
  pos_cancelOrder: boolean;
  pos_mergeTable: boolean;
}

export const PERMISSIONS: Record<StaffRole, RolePermissions> = {
  Admin: {
    dashboard: true, menu: true, tables: true, waiterRequests: true,
    reservations: true, pos: true, orders: true, customers: true,
    staff: true, delivery: true, expenses: true, payments: true,
    reports: true, aiAssistant: true, cashRegister: true, inventory: true,
    kitchens: true, settings: true,
    pos_takeOrder: true, pos_assignTable: true, pos_fireKOT: true,
    pos_fireBOT: true, pos_applyDiscount: true, pos_generateBill: true,
    pos_takePayment: true, pos_cancelOrder: true, pos_mergeTable: true,
  },
  Manager: {
    dashboard: true, menu: true, tables: true, waiterRequests: true,
    reservations: true, pos: true, orders: true, customers: true,
    staff: true, delivery: true, expenses: true, payments: true,
    reports: true, aiAssistant: true, cashRegister: true, inventory: true,
    kitchens: true, settings: false,
    pos_takeOrder: true, pos_assignTable: true, pos_fireKOT: true,
    pos_fireBOT: true, pos_applyDiscount: true, pos_generateBill: true,
    pos_takePayment: true, pos_cancelOrder: true, pos_mergeTable: true,
  },
  Captain: {
    dashboard: false, menu: false, tables: true, waiterRequests: true,
    reservations: true, pos: true, orders: true, customers: false,
    staff: false, delivery: false, expenses: false, payments: false,
    reports: false, aiAssistant: false, cashRegister: false, inventory: false,
    kitchens: false, settings: false,
    pos_takeOrder: true, pos_assignTable: true, pos_fireKOT: true,
    pos_fireBOT: true, pos_applyDiscount: false, pos_generateBill: true,
    pos_takePayment: false, pos_cancelOrder: true, pos_mergeTable: true,
  },
  Steward: {
    dashboard: false, menu: false, tables: true, waiterRequests: true,
    reservations: false, pos: true, orders: false, customers: false,
    staff: false, delivery: false, expenses: false, payments: false,
    reports: false, aiAssistant: false, cashRegister: false, inventory: false,
    kitchens: false, settings: false,
    pos_takeOrder: true, pos_assignTable: true, pos_fireKOT: true,
    pos_fireBOT: true, pos_applyDiscount: false, pos_generateBill: true,
    pos_takePayment: false, pos_cancelOrder: false, pos_mergeTable: false,
  },
  Cashier: {
    dashboard: false, menu: false, tables: false, waiterRequests: false,
    reservations: false, pos: true, orders: true, customers: false,
    staff: false, delivery: false, expenses: false, payments: true,
    reports: false, aiAssistant: false, cashRegister: true, inventory: false,
    kitchens: false, settings: false,
    pos_takeOrder: false, pos_assignTable: false, pos_fireKOT: false,
    pos_fireBOT: false, pos_applyDiscount: true, pos_generateBill: true,
    pos_takePayment: true, pos_cancelOrder: false, pos_mergeTable: false,
  },
  Chef: {
    dashboard: false, menu: true, tables: false, waiterRequests: false,
    reservations: false, pos: false, orders: false, customers: false,
    staff: false, delivery: false, expenses: false, payments: false,
    reports: false, aiAssistant: false, cashRegister: false, inventory: false,
    kitchens: true, settings: false,
    pos_takeOrder: false, pos_assignTable: false, pos_fireKOT: false,
    pos_fireBOT: false, pos_applyDiscount: false, pos_generateBill: false,
    pos_takePayment: false, pos_cancelOrder: false, pos_mergeTable: false,
  },
  Bartender: {
    dashboard: false, menu: false, tables: false, waiterRequests: false,
    reservations: false, pos: false, orders: false, customers: false,
    staff: false, delivery: false, expenses: false, payments: false,
    reports: false, aiAssistant: false, cashRegister: false, inventory: false,
    kitchens: true, settings: false,
    pos_takeOrder: false, pos_assignTable: false, pos_fireKOT: false,
    pos_fireBOT: false, pos_applyDiscount: false, pos_generateBill: false,
    pos_takePayment: false, pos_cancelOrder: false, pos_mergeTable: false,
  },
};

export const DEMO_STAFF: StaffMember[] = [
  { id: 0, name: "Admin / GM",    role: "Admin",     avatar: "AD"                },
  { id: 5, name: "Suresh Yadav",  role: "Manager",   avatar: "SY"                },
  { id: 1, name: "Rahul Sharma",  role: "Captain",   avatar: "RS", section: "Indoor"  },
  { id: 2, name: "Priya Singh",   role: "Captain",   avatar: "PS", section: "Terrace" },
  { id: 3, name: "Amit Kumar",    role: "Steward",   avatar: "AK", section: "Indoor"  },
  { id: 4, name: "Neha Patel",    role: "Cashier",   avatar: "NP"                },
  { id: 6, name: "Ravi Mehta",    role: "Chef",      avatar: "RM"                },
  { id: 7, name: "Pooja Nair",    role: "Bartender", avatar: "PN"                },
];

interface StaffContextValue {
  currentStaff: StaffMember;
  permissions: RolePermissions;
  setCurrentStaff: (staff: StaffMember) => void;
  can: (action: keyof RolePermissions) => boolean;
}

const StaffContext = createContext<StaffContextValue | null>(null);

export function StaffProvider({ children }: { children: ReactNode }) {
  const [currentStaff, setCurrentStaff] = useState<StaffMember>(DEMO_STAFF[0]);
  const permissions = PERMISSIONS[currentStaff.role];
  const can = (action: keyof RolePermissions) => permissions[action] as boolean;
  return (
    <StaffContext.Provider value={{ currentStaff, permissions, setCurrentStaff, can }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error("useStaff must be used inside StaffProvider");
  return ctx;
}

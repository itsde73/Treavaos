import { useState, useEffect, useMemo } from "react";
import {
  Search, Trash2, User, Printer, CreditCard, ChefHat, Wine,
  CheckCircle, Grid3x3, List, X, Star, Receipt, Edit3,
  ArrowRight, ShieldAlert, Merge, UserCog, RefreshCw,
  LayoutDashboard, ClipboardList, Home, Clock, AlertTriangle,
} from "lucide-react";
import { Link } from "react-router";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Separator } from "../components/ui/separator";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { useStaff, DEMO_STAFF } from "../context/StaffContext";

// ─── DATA ────────────────────────────────────────────────────────────────────
const ALL_TABLES = [
  { id:"T1",  name:"Table 1",  section:"Indoor",         seats:4,  status:"available" },
  { id:"T2",  name:"Table 2",  section:"Indoor",         seats:2,  status:"occupied"  },
  { id:"T3",  name:"Table 3",  section:"Indoor",         seats:6,  status:"available" },
  { id:"T4",  name:"Table 4",  section:"Indoor",         seats:4,  status:"reserved"  },
  { id:"T5",  name:"Table 5",  section:"Indoor",         seats:4,  status:"available" },
  { id:"T6",  name:"Table 6",  section:"Indoor",         seats:2,  status:"available" },
  { id:"T7",  name:"Table 7",  section:"Terrace",        seats:4,  status:"available" },
  { id:"T8",  name:"Table 8",  section:"Terrace",        seats:6,  status:"occupied"  },
  { id:"T9",  name:"Table 9",  section:"Terrace",        seats:4,  status:"available" },
  { id:"B1",  name:"Bar 1",    section:"Bar Area",       seats:2,  status:"available" },
  { id:"B2",  name:"Bar 2",    section:"Bar Area",       seats:2,  status:"occupied"  },
  { id:"B3",  name:"Bar 3",    section:"Bar Area",       seats:2,  status:"available" },
  { id:"P1",  name:"Private 1",section:"Private Dining", seats:8,  status:"available" },
  { id:"P2",  name:"Private 2",section:"Private Dining", seats:12, status:"reserved"  },
];

const CUSTOMERS = [
  { id:1, name:"Arjun Mehta",  phone:"9876543210", loyaltyPoints:420,  visits:12, lastVisit:"2 days ago" },
  { id:2, name:"Sunita Reddy", phone:"9765432109", loyaltyPoints:890,  visits:28, lastVisit:"Yesterday"  },
  { id:3, name:"Vikram Joshi", phone:"9654321098", loyaltyPoints:150,  visits:5,  lastVisit:"1 week ago" },
  { id:4, name:"Deepa Nair",   phone:"9543210987", loyaltyPoints:2340, visits:67, lastVisit:"Today"      },
];

type KotRoute = "kitchen" | "bar" | "both";
interface MenuItem { id:number; name:string; price:number; category:string; kotRoute:KotRoute; veg:boolean; }

const CATEGORIES = ["Show All","Starters","Soups","Indian Main Course","Chinese","Italian","Breads","Rice & Biryani","Desserts","Beverages","Cocktails","Spirits","Beer","Mocktails"];

const MENU_ITEMS: MenuItem[] = [
  { id:1,  name:"Paneer Tikka",         price:289, category:"Starters",           kotRoute:"kitchen", veg:true  },
  { id:2,  name:"Chicken Tikka",        price:329, category:"Starters",           kotRoute:"kitchen", veg:false },
  { id:3,  name:"Hara Bhara Kebab",     price:249, category:"Starters",           kotRoute:"kitchen", veg:true  },
  { id:4,  name:"Veg Spring Rolls",     price:219, category:"Starters",           kotRoute:"kitchen", veg:true  },
  { id:5,  name:"Chilli Chicken",       price:309, category:"Starters",           kotRoute:"kitchen", veg:false },
  { id:6,  name:"Crispy Corn",          price:199, category:"Starters",           kotRoute:"kitchen", veg:true  },
  { id:7,  name:"Fish Fingers",         price:349, category:"Starters",           kotRoute:"kitchen", veg:false },
  { id:8,  name:"Tandoori Mushroom",    price:269, category:"Starters",           kotRoute:"kitchen", veg:true  },
  { id:9,  name:"Chicken Lollipop",     price:299, category:"Soups",              kotRoute:"kitchen", veg:false },
  { id:10, name:"Cheese Balls",         price:259, category:"Soups",              kotRoute:"kitchen", veg:true  },
  { id:11, name:"Tomato Soup",          price:179, category:"Soups",              kotRoute:"kitchen", veg:true  },
  { id:12, name:"Sweet Corn Soup",      price:189, category:"Soups",              kotRoute:"kitchen", veg:true  },
  { id:13, name:"Hot & Sour Soup",      price:199, category:"Soups",              kotRoute:"kitchen", veg:true  },
  { id:14, name:"Manchow Soup",         price:199, category:"Soups",              kotRoute:"kitchen", veg:true  },
  { id:15, name:"Chicken Clear Soup",   price:209, category:"Soups",              kotRoute:"kitchen", veg:false },
  { id:16, name:"Cream of Mushroom",    price:199, category:"Soups",              kotRoute:"kitchen", veg:true  },
  { id:17, name:"Dal Makhani",          price:279, category:"Indian Main Course", kotRoute:"kitchen", veg:true  },
  { id:18, name:"Butter Chicken",       price:359, category:"Indian Main Course", kotRoute:"kitchen", veg:false },
  { id:19, name:"Paneer Butter Masala", price:329, category:"Indian Main Course", kotRoute:"kitchen", veg:true  },
  { id:20, name:"Veg Biryani",          price:289, category:"Rice & Biryani",     kotRoute:"kitchen", veg:true  },
  { id:21, name:"Chicken Biryani",      price:349, category:"Rice & Biryani",     kotRoute:"kitchen", veg:false },
  { id:22, name:"Chocolate Cake",       price:199, category:"Desserts",           kotRoute:"kitchen", veg:true  },
  { id:23, name:"Gulab Jamun",          price:149, category:"Desserts",           kotRoute:"kitchen", veg:true  },
  { id:24, name:"Mojito",               price:350, category:"Cocktails",          kotRoute:"bar",     veg:true  },
  { id:25, name:"Old Fashioned",        price:490, category:"Cocktails",          kotRoute:"bar",     veg:true  },
  { id:26, name:"Margarita",            price:420, category:"Cocktails",          kotRoute:"bar",     veg:true  },
  { id:27, name:"Whisky On The Rocks",  price:420, category:"Spirits",            kotRoute:"bar",     veg:true  },
  { id:28, name:"Rum & Coke",           price:320, category:"Spirits",            kotRoute:"bar",     veg:true  },
  { id:29, name:"Kingfisher Beer",      price:180, category:"Beer",               kotRoute:"bar",     veg:true  },
  { id:30, name:"Hoegaarden",           price:340, category:"Beer",               kotRoute:"bar",     veg:true  },
  { id:31, name:"Virgin Mojito",        price:180, category:"Mocktails",          kotRoute:"bar",     veg:true  },
  { id:32, name:"Fresh Lime Soda",      price:120, category:"Mocktails",          kotRoute:"bar",     veg:true  },
  { id:33, name:"Cold Coffee",          price:150, category:"Beverages",          kotRoute:"bar",     veg:true  },
  { id:34, name:"Bar Bites Platter",    price:699, category:"Starters",           kotRoute:"both",    veg:false },
];

type OrderType = "Dine In" | "Delivery" | "Pickup";
interface CartItem extends MenuItem { quantity:number; note?:string; }
interface FiredTicket { id:string; type:"KOT"|"BOT"; items:CartItem[]; tableLabel:string; staff:string; time:string; }

let ticketSeq = 41;
const nextTkt = (type:"KOT"|"BOT") => { ticketSeq++; return `${type}-${String(ticketSeq).padStart(4,"0")}`; };

const SECTIONS = ["All", ...Array.from(new Set(ALL_TABLES.map(t => t.section)))];

// ─── ORDER STORE (dry-run data persistence) ──────────────────────────────────
interface OrderSession {
  id: string;
  orderNum: number;
  orderType: string;
  tableId: string | null;
  tableName: string | null;
  tableSection: string | null;
  customerName: string | null;
  customerPhone: string | null;
  captainName: string;
  captainRole: string;
  pax: number;
  items: { name: string; qty: number; price: number; route: string }[];
  tickets: { id: string; type: string; time: string }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: "active" | "kot-fired" | "billed" | "paid" | "cancelled";
  paymentMethod: string | null;
  createdAt: string;
  kotFiredAt: string | null;
  billedAt: string | null;
  paidAt: string | null;
}

let orderSeq = 4;
const ORDER_STORE: OrderSession[] = [
  // Seed: billed order on T2 (occupied)
  {
    id: "ORD-0001", orderNum: 1, orderType: "Dine In",
    tableId: "T2", tableName: "Table 2", tableSection: "Indoor",
    customerName: "Arjun Mehta", customerPhone: "9876543210",
    captainName: "Rahul Sharma", captainRole: "Captain", pax: 2,
    items: [
      { name: "Paneer Tikka", qty: 2, price: 289, route: "kitchen" },
      { name: "Butter Chicken", qty: 1, price: 359, route: "kitchen" },
      { name: "Veg Biryani", qty: 1, price: 289, route: "kitchen" },
      { name: "Mojito", qty: 2, price: 350, route: "bar" },
    ],
    tickets: [
      { id: "KOT-0038", type: "KOT", time: "12:15 PM" },
      { id: "BOT-0039", type: "BOT", time: "12:15 PM" },
    ],
    subtotal: 1926, tax: 96.3, discount: 0, total: 2022.30,
    status: "billed", paymentMethod: null,
    createdAt: "2026-03-04T12:10:00", kotFiredAt: "2026-03-04T12:15:00",
    billedAt: "2026-03-04T12:45:00", paidAt: null,
  },
  // Seed: billed order on T8 (occupied)
  {
    id: "ORD-0002", orderNum: 2, orderType: "Dine In",
    tableId: "T8", tableName: "Table 8", tableSection: "Terrace",
    customerName: "Sunita Reddy", customerPhone: "9765432109",
    captainName: "Priya Singh", captainRole: "Captain", pax: 4,
    items: [
      { name: "Chicken Biryani", qty: 2, price: 349, route: "kitchen" },
      { name: "Dal Makhani", qty: 1, price: 279, route: "kitchen" },
      { name: "Kingfisher Beer", qty: 3, price: 180, route: "bar" },
    ],
    tickets: [
      { id: "KOT-0040", type: "KOT", time: "01:00 PM" },
      { id: "BOT-0041", type: "BOT", time: "01:00 PM" },
    ],
    subtotal: 1517, tax: 75.85, discount: 0, total: 1592.85,
    status: "billed", paymentMethod: null,
    createdAt: "2026-03-04T12:50:00", kotFiredAt: "2026-03-04T13:00:00",
    billedAt: "2026-03-04T13:30:00", paidAt: null,
  },
  // Seed: billed order on B2 (occupied) walk-in
  {
    id: "ORD-0003", orderNum: 3, orderType: "Dine In",
    tableId: "B2", tableName: "Bar 2", tableSection: "Bar Area",
    customerName: null, customerPhone: null,
    captainName: "Rahul Sharma", captainRole: "Captain", pax: 1,
    items: [
      { name: "Old Fashioned", qty: 2, price: 490, route: "bar" },
      { name: "Bar Bites Platter", qty: 1, price: 699, route: "both" },
    ],
    tickets: [{ id: "BOT-0042", type: "BOT", time: "01:15 PM" }],
    subtotal: 1679, tax: 83.95, discount: 0, total: 1762.95,
    status: "billed", paymentMethod: null,
    createdAt: "2026-03-04T13:10:00", kotFiredAt: "2026-03-04T13:15:00",
    billedAt: "2026-03-04T13:40:00", paidAt: null,
  },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function POS() {
  const { currentStaff, permissions } = useStaff();

  // Clock
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const timeStr = time.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", second:"2-digit" });
  const dateStr = time.toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });

  // Order state
  const [orderType,        setOrderType]        = useState<OrderType | null>(null);
  const [selectedTable,    setSelectedTable]    = useState<typeof ALL_TABLES[0] | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof CUSTOMERS[0] | null>(null);
  const [pax,              setPax]              = useState(1);
  const [orderNum]                              = useState(4);
  const [cart,             setCart]             = useState<CartItem[]>([]);
  const [discount,         setDiscount]         = useState(0);
  const [useLoyalty,       setUseLoyalty]       = useState(false);
  const [payMethod,        setPayMethod]        = useState<"Cash"|"Card"|"UPI"|"Split">("Cash");
  const [firedTickets,     setFiredTickets]     = useState<FiredTicket[]>([]);
  const [billGenerated,    setBillGenerated]    = useState(false);
  const [sessionStart,     setSessionStart]     = useState<Date | null>(null);
  const [setupStep,        setSetupStep]        = useState<"table"|"customer"|"done">("table");
  const [showSetupWizard,  setShowSetupWizard]  = useState(false);
  const [elapsed,          setElapsed]          = useState("00:00");
  const [newCustName,      setNewCustName]      = useState("");
  const [newCustPhone,     setNewCustPhone]     = useState("");

  // Store state (dry-run data tracking)
  const [, setStoreVer]    = useState(0);
  const bumpStore          = () => setStoreVer(v => v + 1);
  const [currentOrderId,   setCurrentOrderId]   = useState<string | null>(null);
  const [cashierSelectedId, setCashierSelectedId] = useState<string | null>(null);
  const [cashierPayMethod,  setCashierPayMethod]  = useState<"Cash"|"Card"|"UPI"|"Split">("Cash");

  // Session timer — ticks every second when session is active
  useEffect(() => {
    if (!sessionStart) return;
    const t = setInterval(() => {
      const diff = Math.floor((Date.now() - sessionStart.getTime()) / 1000);
      const m = String(Math.floor(diff / 60)).padStart(2, "0");
      const s = String(diff % 60).padStart(2, "0");
      setElapsed(`${m}:${s}`);
    }, 1000);
    return () => clearInterval(t);
  }, [sessionStart]);

  // UI state
  const [search,         setSearch]         = useState("");
  const [activeCat,      setActiveCat]      = useState("Show All");
  const [viewMode,       setViewMode]       = useState<"grid"|"list">("grid");
  const [tableSection,   setTableSection]   = useState("All");
  const [custSearch,     setCustSearch]     = useState("");
  const [noteItem,       setNoteItem]       = useState<CartItem | null>(null);
  const [noteText,       setNoteText]       = useState("");
  const [deniedAction,   setDeniedAction]   = useState("");

  // Modal visibility
  const [showOrderType,   setShowOrderType]   = useState(true);
  const [showTable,       setShowTable]       = useState(false);
  const [showCustomer,    setShowCustomer]    = useState(false);
  const [showKotConfirm,  setShowKotConfirm]  = useState(false);
  const [showBill,        setShowBill]        = useState(false);
  const [showPayment,     setShowPayment]     = useState(false);
  const [showDenied,      setShowDenied]      = useState(false);

  // Computed
  const filteredItems = MENU_ITEMS.filter(i =>
    (activeCat === "Show All" || i.category === activeCat) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );
  const subtotal     = cart.reduce((s,i) => s + i.price*i.quantity, 0);
  const cgst         = subtotal * 0.025;
  const sgst         = subtotal * 0.025;
  const discAmt      = subtotal * (discount/100);
  const loyPts       = useLoyalty && selectedCustomer ? Math.min(selectedCustomer.loyaltyPoints*0.5, subtotal*0.1) : 0;
  const total        = subtotal + cgst + sgst - discAmt - loyPts;
  const kitchenItems = cart.filter(i => i.kotRoute==="kitchen" || i.kotRoute==="both");
  const barItems     = cart.filter(i => i.kotRoute==="bar"     || i.kotRoute==="both");
  const tableLabel   = selectedTable?.name ?? orderType ?? "—";
  const assignedCaptain = currentStaff; // Captain is always the logged-in staff

  // ─── Order Store helpers (dry-run persistence) ──────────────────────────
  function createOrder() {
    orderSeq++;
    const id = `ORD-${String(orderSeq).padStart(4, "0")}`;
    ORDER_STORE.push({
      id, orderNum: orderSeq, orderType: orderType!,
      tableId: selectedTable?.id ?? null, tableName: selectedTable?.name ?? null,
      tableSection: selectedTable?.section ?? null,
      customerName: selectedCustomer?.name ?? null, customerPhone: selectedCustomer?.phone ?? null,
      captainName: assignedCaptain.name, captainRole: assignedCaptain.role, pax,
      items: [], tickets: [],
      subtotal: 0, tax: 0, discount: 0, total: 0,
      status: "active", paymentMethod: null,
      createdAt: new Date().toISOString(),
      kotFiredAt: null, billedAt: null, paidAt: null,
    });
    setCurrentOrderId(id);
    // Mark table occupied
    if (selectedTable) {
      const t = ALL_TABLES.find(x => x.id === selectedTable.id);
      if (t) t.status = "occupied";
    }
    bumpStore();
  }

  function updateOrderInStore(updates: Partial<OrderSession>) {
    if (!currentOrderId) return;
    const idx = ORDER_STORE.findIndex(o => o.id === currentOrderId);
    if (idx >= 0) Object.assign(ORDER_STORE[idx], updates);
    bumpStore();
  }

  function handleCashierPayment() {
    if (!cashierSelectedId) return;
    const idx = ORDER_STORE.findIndex(o => o.id === cashierSelectedId);
    if (idx >= 0) {
      ORDER_STORE[idx].status = "paid";
      ORDER_STORE[idx].paymentMethod = cashierPayMethod;
      ORDER_STORE[idx].paidAt = new Date().toISOString();
      // Free the table
      if (ORDER_STORE[idx].tableId) {
        const t = ALL_TABLES.find(x => x.id === ORDER_STORE[idx].tableId);
        if (t) t.status = "available";
      }
    }
    setCashierSelectedId(null);
    bumpStore();
  }

  // ─── Workflow gates ─────────────────────────────────────────────────────
  const sessionReady = useMemo(() => {
    if (orderType === "Dine In") return !!selectedTable; // Captain auto-assigned from login
    if (orderType === "Delivery" || orderType === "Pickup") return true;
    return false;
  }, [orderType, selectedTable]);
  const kotFired = firedTickets.length > 0;

  // Workflow step tracker
  const workflowStep = useMemo(() => {
    if (!sessionReady) return 1; // Setup
    if (cart.length === 0 && !kotFired) return 2; // Taking order
    if (!kotFired) return 3; // Ready to fire KOT
    if (!billGenerated) return 4; // KOT fired, bill not yet generated
    return 5; // Payment
  }, [sessionReady, cart.length, kotFired, billGenerated]);

  function checkPerm(action: string, onOk: () => void) {
    const pMap: Record<string,boolean> = {
      "Take Order":   permissions.pos_takeOrder,
      "Fire KOT/BOT": permissions.pos_fireKOT,
      "Bill":         permissions.pos_generateBill,
      "Payment":      permissions.pos_takePayment,
      "Discount":     permissions.pos_applyDiscount,
    };
    if (pMap[action] !== false) { onOk(); return; }
    setDeniedAction(action); setShowDenied(true);
  }

  function addToCart(item: MenuItem) {
    if (!permissions.pos_takeOrder) return;
    if (!sessionReady) {
      if (orderType === "Dine In") {
        setShowSetupWizard(true);
        setSetupStep(!selectedTable ? "table" : "done");
      }
      return;
    }
    setCart(prev => {
      const ex = prev.find(c => c.id===item.id);
      if (ex) return prev.map(c => c.id===item.id ? {...c,quantity:c.quantity+1} : c);
      return [...prev, {...item, quantity:1}];
    });
  }

  function fireKOT() {
    const now = new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
    const tickets: FiredTicket[] = [];
    if (kitchenItems.length > 0)
      tickets.push({ id:nextTkt("KOT"), type:"KOT", items:kitchenItems, tableLabel, staff:currentStaff.name, time:now });
    if (barItems.length > 0)
      tickets.push({ id:nextTkt("BOT"), type:"BOT", items:barItems,     tableLabel, staff:currentStaff.name, time:now });
    setFiredTickets(p => [...p, ...tickets]);
    // Update order store
    updateOrderInStore({
      status: "kot-fired",
      items: cart.map(c => ({ name: c.name, qty: c.quantity, price: c.price, route: c.kotRoute })),
      tickets: [...firedTickets, ...tickets].map(t => ({ id: t.id, type: t.type, time: t.time })),
      kotFiredAt: new Date().toISOString(),
    });
    // Start session timer on first KOT fire
    if (!sessionStart) setSessionStart(new Date());
    setShowKotConfirm(false);
  }

  function reset() {
    setCart([]); setSelectedTable(null); setSelectedCustomer(null);
    setFiredTickets([]); setDiscount(0);
    setUseLoyalty(false); setPax(1); setOrderType(null); setShowOrderType(true);
    setBillGenerated(false); setSessionStart(null); setElapsed("00:00");
    setSetupStep("table"); setShowSetupWizard(false);
    setNewCustName(""); setNewCustPhone("");
    setCurrentOrderId(null);
  }

  // ─── CASHIER POS VIEW ──────────────────────────────────────────────────────
  if (currentStaff.role === "Cashier") {
    const pendingBills = ORDER_STORE.filter(o => o.status === "billed");
    const completedToday = ORDER_STORE.filter(o => o.status === "paid");
    const selectedOrder = cashierSelectedId ? ORDER_STORE.find(o => o.id === cashierSelectedId) : null;

    return (
      <div className="fixed inset-0 bg-background flex flex-col z-40 overflow-hidden">
        {/* Top bar */}
        <div className="h-10 bg-muted/60 border-b flex items-center px-4 gap-3 text-xs flex-shrink-0">
          <Badge className="bg-amber-500 text-white border-0 text-[10px]">CASHIER MODE</Badge>
          <span className="text-muted-foreground">·</span>
          <Avatar className="w-5 h-5">
            <AvatarFallback className="bg-primary text-primary-foreground text-[9px] font-bold">{currentStaff.avatar}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{currentStaff.name}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{dateStr}</span>
          <span className="font-mono font-bold text-primary">{timeStr}</span>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-muted-foreground">Pending: <span className="font-bold text-foreground">{pendingBills.length}</span></span>
            <span className="text-muted-foreground">Settled: <span className="font-bold text-green-600">{completedToday.length}</span></span>
            <span className="text-muted-foreground">Revenue: <span className="font-bold text-green-600">₹{completedToday.reduce((s,o) => s + o.total, 0).toFixed(0)}</span></span>
            <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <Home className="w-3.5 h-3.5" /><span>Dashboard</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left: Pending bills + completed log */}
          <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Receipt className="w-5 h-5" /> Pending Bills
              {pendingBills.length > 0 && <Badge className="bg-red-500 text-white">{pendingBills.length}</Badge>}
            </h2>

            {pendingBills.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
                <CheckCircle className="w-12 h-12 opacity-20" />
                <p className="font-medium">No pending bills</p>
                <p className="text-sm">All bills have been settled</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {pendingBills.map(order => (
                  <button key={order.id} onClick={() => setCashierSelectedId(order.id)}
                    className={`text-left border-2 rounded-xl p-4 transition-all hover:shadow-md
                      ${cashierSelectedId === order.id ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/40"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm">{order.tableName}</span>
                      <Badge variant="outline" className="text-[10px]">{order.tableSection}</Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>Customer: <span className="font-medium text-foreground">{order.customerName ?? "Walk-in"}</span></p>
                      <p>Captain: <span className="font-medium text-foreground">{order.captainName}</span></p>
                      <p>Items: <span className="font-medium text-foreground">{order.items.reduce((s,i) => s + i.qty, 0)}</span> · Pax: {order.pax}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xl font-bold">₹{order.total.toFixed(2)}</span>
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200">Awaiting Payment</Badge>
                    </div>
                    <div className="mt-2 flex gap-1 flex-wrap">
                      {order.tickets.map(t => (
                        <span key={t.id} className={`text-[10px] px-1.5 py-0.5 rounded-full border
                          ${t.type === "KOT" ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-purple-50 text-purple-600 border-purple-200"}`}>
                          {t.id}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Completed orders log */}
            {completedToday.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" /> Settled Today ({completedToday.length})
                </h3>
                <div className="space-y-1">
                  {completedToday.map(order => (
                    <div key={order.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-green-50/50 border border-green-100 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="font-medium w-20">{order.tableName}</span>
                      <span className="text-muted-foreground flex-1">{order.customerName ?? "Walk-in"}</span>
                      <Badge variant="outline" className="text-[10px]">{order.paymentMethod}</Badge>
                      <span className="font-bold">₹{order.total.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground">
                        {order.paidAt ? new Date(order.paidAt).toLocaleTimeString("en-IN", {hour:"2-digit",minute:"2-digit"}) : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Selected order detail + payment */}
          {selectedOrder && (
            <div className="w-[400px] border-l flex flex-col bg-card flex-shrink-0">
              <div className="px-4 py-3 border-b">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Bill #{selectedOrder.orderNum} — {selectedOrder.tableName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.customerName ?? "Walk-in"} · Pax {selectedOrder.pax}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Captain: {selectedOrder.captainName} · Billed at{" "}
                  {selectedOrder.billedAt ? new Date(selectedOrder.billedAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}) : "—"}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {/* Items table */}
                <div className="border rounded-xl overflow-hidden">
                  <div className="grid grid-cols-4 px-3 py-2 bg-muted/40 text-xs text-muted-foreground font-semibold uppercase">
                    <span className="col-span-2">Item</span>
                    <span className="text-right">Qty × Rate</span>
                    <span className="text-right">Amt</span>
                  </div>
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-4 px-3 py-1.5 border-t text-sm">
                      <span className="col-span-2 flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.route==="kitchen"?"bg-orange-500":item.route==="bar"?"bg-purple-500":"bg-blue-500"}`} />
                        {item.name}
                      </span>
                      <span className="text-right text-muted-foreground text-xs">{item.qty} × ₹{item.price}</span>
                      <span className="text-right font-medium">₹{(item.price * item.qty).toFixed(0)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-1 text-sm px-1">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{selectedOrder.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Tax (5%)</span><span>₹{selectedOrder.tax.toFixed(2)}</span></div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{selectedOrder.discount.toFixed(2)}</span></div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{selectedOrder.total.toFixed(2)}</span></div>
                </div>

                {/* KOT/BOT tickets */}
                <div className="flex gap-1.5 flex-wrap">
                  {selectedOrder.tickets.map(t => (
                    <span key={t.id} className={`text-xs px-2 py-1 rounded-full border font-medium
                      ${t.type === "KOT" ? "bg-orange-50 text-orange-600 border-orange-200" : "bg-purple-50 text-purple-600 border-purple-200"}`}>
                      {t.type === "KOT" ? "🔴" : "🟣"} {t.id} · {t.time}
                    </span>
                  ))}
                </div>
              </div>

              {/* Payment section */}
              <div className="p-4 border-t space-y-3 bg-muted/10">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment Method</p>
                <div className="grid grid-cols-4 gap-2">
                  {(["Cash","Card","UPI","Split"] as const).map(m => (
                    <button key={m} onClick={() => setCashierPayMethod(m)}
                      className={`border-2 rounded-xl py-2.5 text-xs font-semibold transition-all
                        ${cashierPayMethod===m ? "border-primary bg-primary/5" : "hover:border-primary/40"}`}>
                      {m==="Cash"?"💵":m==="Card"?"💳":m==="UPI"?"📱":"✂️"} {m}
                    </button>
                  ))}
                </div>
                <Button className="w-full h-12 text-base font-bold gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => handleCashierPayment()}>
                  <CreditCard className="w-5 h-5" />
                  Settle ₹{selectedOrder.total.toFixed(2)} · {cashierPayMethod}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setCashierSelectedId(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── ORDER TYPE MODAL ──────────────────────────────────────────────────────
  if (showOrderType || !orderType) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        {/* Background POS screen (blurred) */}
        <div className="absolute inset-0 bg-muted/30" />
        <div className="relative bg-card border border-border rounded-2xl shadow-2xl p-8 w-[560px] max-w-full mx-4">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Select Order Type</h2>
              <p className="text-muted-foreground text-sm mt-0.5">Choose your order type to proceed</p>
            </div>
            <div className="flex gap-2">
              <Link to="/" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border hover:border-foreground/30 transition-colors">
                <Home className="w-3.5 h-3.5" />Dashboard
              </Link>
              <Link to="/orders" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border hover:border-foreground/30 transition-colors">
                <ClipboardList className="w-3.5 h-3.5" />Orders
              </Link>
            </div>
          </div>

          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-dashed mb-5 cursor-pointer hover:bg-muted/30 transition-colors">
            <input type="checkbox" className="w-4 h-4 accent-primary rounded" />
            <div>
              <p className="text-sm font-medium">Set as default</p>
              <p className="text-xs text-muted-foreground">Skip this selection next time.</p>
            </div>
          </label>

          <div className="grid grid-cols-3 gap-4">
            {([
              { type:"Delivery" as OrderType, icon:"🚚", label:"Delivery" },
              { type:"Dine In"  as OrderType, icon:"🏪", label:"Dine In"  },
              { type:"Pickup"   as OrderType, icon:"🛍", label:"Pickup"   },
            ]).map(opt => (
              <button key={opt.type}
                onClick={() => {
                  setOrderType(opt.type);
                  setShowOrderType(false);
                  // For Dine In, launch setup wizard
                  if (opt.type === "Dine In") {
                    setSetupStep("table");
                    setShowSetupWizard(true);
                  }
                }}
                className="border-2 border-border rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-primary hover:bg-primary/5 transition-all active:scale-95 group">
                <span className="text-5xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                <span className="font-semibold text-sm">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN POS SCREEN ──────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-background flex flex-col z-40 overflow-hidden">
      {/* ── Top status bar (Queaze-style) ── */}
      <div className="h-9 bg-muted/60 border-b flex items-center px-4 gap-4 text-xs flex-shrink-0">
        <span className="text-muted-foreground font-medium">
          POS: <span className="text-foreground font-semibold">POS1</span>
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{dateStr}</span>
        <span className="text-muted-foreground font-mono font-bold text-primary">{timeStr}</span>
        <div className="h-4 w-px bg-border mx-1" />
        <Avatar className="w-5 h-5 flex-shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-[9px] font-bold">{currentStaff.avatar}</AvatarFallback>
        </Avatar>
        <span className="font-medium text-foreground">{currentStaff.name}</span>
        <Badge variant="outline" className="text-[10px] h-4 px-1.5">{currentStaff.role}</Badge>
        {currentStaff.section && <span className="text-muted-foreground">{currentStaff.section}</span>}

        <div className="ml-auto flex items-center gap-2">
          <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <LayoutDashboard className="w-3.5 h-3.5" /><span>Dashboard</span>
          </Link>
          <span className="text-border">|</span>
          <Link to="/orders" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <ClipboardList className="w-3.5 h-3.5" /><span>Orders</span>
          </Link>
        </div>
      </div>

      {/* ── Body: menu left + order right ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ════════════════════ LEFT: MENU ════════════════════ */}
        <div className="flex-1 flex flex-col overflow-hidden border-r">

          {/* Search + view toggles */}
          <div className="px-3 py-2 border-b flex items-center gap-2 bg-card">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search your menu item here"
                className="pl-9 h-9 bg-background" />
            </div>
            <button onClick={() => setViewMode("list")}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${viewMode==="list"?"bg-slate-800 text-white border-slate-800":"hover:bg-muted/50"}`}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("grid")}
              className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-colors ${viewMode==="grid"?"bg-slate-800 text-white border-slate-800":"hover:bg-muted/50"}`}>
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button onClick={() => { setSearch(""); setActiveCat("Show All"); setCart([]); }}
              className="h-9 px-3 flex items-center gap-1.5 rounded-lg border text-sm font-medium hover:bg-muted/50 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />Reset
            </button>
          </div>

          {/* Category tabs — 2 rows matching Queaze exactly */}
          <div className="px-3 pt-2 pb-1.5 border-b bg-muted/20 space-y-1.5">
            {/* Row 1 */}
            <div className="flex gap-1.5">
              <button onClick={() => setActiveCat("Show All")}
                className={`px-4 py-1.5 rounded text-sm font-semibold transition-colors
                  ${activeCat==="Show All" ? "bg-slate-800 text-white" : "bg-white border hover:border-slate-400 text-foreground"}`}>
                Show All
              </button>
              <button
                className="px-4 py-1.5 rounded text-sm font-medium bg-white border hover:border-slate-400 text-foreground transition-colors">
                Main Menu
              </button>
            </div>
            {/* Row 2 — scrollable */}
            <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{scrollbarWidth:"none"}}>
              {CATEGORIES.filter(c => c !== "Show All").map(cat => {
                const count = MENU_ITEMS.filter(i => i.category === cat).length;
                return (
                  <button key={cat} onClick={() => setActiveCat(cat)}
                    className={`flex-shrink-0 px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors
                      ${activeCat===cat ? "bg-slate-700 text-white" : "bg-white border hover:border-slate-400 text-foreground"}`}>
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menu items */}
          <div className="flex-1 overflow-y-auto p-3 relative">
            {/* Session not ready overlay */}
            {!sessionReady && orderType === "Dine In" && (
              <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 cursor-pointer"
                onClick={() => { setShowSetupWizard(true); setSetupStep("table"); }}>
                <div className="bg-card border-2 border-dashed border-amber-400 rounded-2xl p-6 text-center shadow-lg max-w-xs">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="font-bold text-sm">Setup Required</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Assign a table before taking orders
                  </p>
                  <button className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-all active:scale-95">
                    Complete Setup
                  </button>
                </div>
              </div>
            )}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9 gap-2">
                {filteredItems.map(item => {
                  const inCart = cart.find(c => c.id===item.id);
                  return (
                    <button key={item.id} onClick={() => addToCart(item)}
                      disabled={!permissions.pos_takeOrder}
                      className={`relative rounded-xl border-2 p-2 flex flex-col items-center gap-1 transition-all text-center
                        ${inCart ? "border-primary/70 bg-primary/5 shadow-md" : "border-border bg-card hover:border-slate-300 hover:shadow-sm"}
                        ${permissions.pos_takeOrder ? "cursor-pointer active:scale-95" : "opacity-50 cursor-not-allowed"}`}>
                      {/* Dish icon area */}
                      <div className="relative w-full aspect-square rounded-lg bg-muted/40 flex items-center justify-center text-2xl mb-0.5">
                        🍽
                        {/* Veg/Non-veg dot — top left */}
                        <div className={`absolute top-1 left-1 w-2 h-2 rounded-full ring-1 ring-white ${item.veg ? "bg-green-500" : "bg-red-500"}`} />
                        {/* KOT routing dot — top right */}
                        <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ring-1 ring-white
                          ${item.kotRoute==="kitchen"?"bg-orange-500":item.kotRoute==="bar"?"bg-purple-500":"bg-blue-500"}`} />
                      </div>
                      <p className="text-[11px] font-medium leading-tight line-clamp-2 w-full">{item.name}</p>
                      <p className="text-xs font-bold text-slate-700">₹{item.price}</p>
                      {inCart && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground rounded-full text-[10px] font-bold flex items-center justify-center shadow-md">
                          {inCart.quantity}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-px">
                {filteredItems.map(item => {
                  const inCart = cart.find(c => c.id===item.id);
                  return (
                    <div key={item.id} onClick={() => addToCart(item)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-colors
                        ${inCart ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/40"}`}>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.kotRoute==="kitchen"?"bg-orange-500":item.kotRoute==="bar"?"bg-purple-500":"bg-blue-500"}`} />
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.veg?"bg-green-500":"bg-red-500"}`} />
                      <span className="flex-1 text-sm">{item.name}</span>
                      <Badge variant="outline" className="text-xs hidden sm:flex">{item.category}</Badge>
                      <span className="font-semibold text-sm">₹{item.price}</span>
                      {inCart && <Badge className="bg-primary text-white text-xs">×{inCart.quantity}</Badge>}
                    </div>
                  );
                })}
              </div>
            )}
            {filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                <Search className="w-8 h-8 opacity-30" />
                <p className="text-sm">No items found</p>
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════ RIGHT: ORDER ════════════════════ */}
        <div className="w-[340px] xl:w-[360px] flex flex-col bg-card flex-shrink-0">

          {/* ── Workflow stepper ── */}
          <div className="px-3 py-1.5 border-b bg-muted/20">
            <div className="flex items-center gap-1 text-[10px]">
              {[
                { n:1, label:"Setup" },
                { n:2, label:"Menu" },
                { n:3, label:"KOT" },
                { n:4, label:"Bill" },
                { n:5, label:"Pay" },
              ].map((s, idx) => (
                <div key={s.n} className="flex items-center gap-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] transition-all
                    ${workflowStep > s.n ? "bg-green-500 text-white" : workflowStep === s.n ? "bg-primary text-primary-foreground ring-2 ring-primary/30" : "bg-muted text-muted-foreground"}`}>
                    {workflowStep > s.n ? "✓" : s.n}
                  </div>
                  <span className={`font-medium ${workflowStep >= s.n ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                  {idx < 4 && <div className={`w-3 h-px mx-0.5 ${workflowStep > s.n ? "bg-green-400" : "bg-border"}`} />}
                </div>
              ))}
              {/* Session timer */}
              {sessionStart && (
                <div className="ml-auto flex items-center gap-1 text-primary font-mono font-bold text-[11px]">
                  <Clock className="w-3 h-3" />{elapsed}
                </div>
              )}
            </div>
          </div>

          {/* Order context header */}
          <div className="px-3 py-2.5 border-b space-y-2">
            {/* Order type */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground text-xs">Order Type: <span className="font-semibold text-foreground">{orderType}</span></span>
              <button onClick={reset} className="text-primary text-xs font-semibold hover:underline">Change</button>
            </div>

            {/* Customer */}
            <button onClick={() => setShowCustomer(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed hover:border-primary/40 hover:bg-muted/30 transition-all text-left">
              <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              {selectedCustomer ? (
                <>
                  <span className="text-sm font-medium flex-1">{selectedCustomer.name}</span>
                  <Badge variant="secondary" className="text-xs shrink-0">{selectedCustomer.loyaltyPoints} pts</Badge>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">+ Add Customer Details</span>
              )}
            </button>

            {/* Order # + Table + Pax */}
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Receipt className="w-3.5 h-3.5" />Order #{orderNum}
              </span>
              {orderType === "Dine In" && (
                <>
                  <button onClick={() => setShowTable(true)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg border hover:border-primary/50 hover:bg-muted/40 transition-colors ml-1">
                    <Grid3x3 className="w-3 h-3" />
                    <span className="font-medium">{selectedTable?.name ?? "Assign Table"}</span>
                  </button>
                  <button onClick={() => setShowTable(true)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg border hover:border-primary/50 transition-colors">
                    <Merge className="w-3 h-3" /><span>Merge Tables</span>
                  </button>
                </>
              )}
              <span className="ml-auto flex items-center gap-1">
                <span className="text-muted-foreground">Pax</span>
                <div className="flex items-center border rounded-lg overflow-hidden text-xs">
                  <button onClick={() => setPax(p => Math.max(1,p-1))} className="px-1.5 py-0.5 hover:bg-muted border-r">−</button>
                  <span className="px-2 font-semibold">{pax}</span>
                  <button onClick={() => setPax(p => p+1)} className="px-1.5 py-0.5 hover:bg-muted border-l">+</button>
                </div>
              </span>
            </div>

            {/* Assigned Captain (auto from login) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs flex-1 rounded-lg p-1.5 bg-muted/30 border">
                <UserCog className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground text-[10px]">Captain:</span>
                <Avatar className="w-4 h-4">
                  <AvatarFallback className="bg-primary text-primary-foreground text-[8px] font-bold">{assignedCaptain.avatar}</AvatarFallback>
                </Avatar>
                <span className="font-medium flex-1">{assignedCaptain.name}</span>
                <Badge variant="outline" className="text-[9px] h-4 px-1">{assignedCaptain.role}</Badge>
              </div>
            </div>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-3">
                <div className="w-16 h-16 rounded-2xl bg-muted/30 flex items-center justify-center">
                  <Receipt className="w-8 h-8 opacity-30" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">No record found</p>
                  <p className="text-xs mt-0.5 text-muted-foreground/70">Add items from the menu</p>
                </div>
              </div>
            ) : (
              <div className="divide-y">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-1.5 px-3 py-2 hover:bg-muted/20 group">
                    {/* Routing dot */}
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-px
                      ${item.kotRoute==="kitchen"?"bg-orange-500":item.kotRoute==="bar"?"bg-purple-500":"bg-blue-500"}`} />
                    {/* Name + note */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.name}</p>
                      {item.note && <p className="text-[10px] text-muted-foreground italic truncate">"{item.note}"</p>}
                    </div>
                    {/* Qty controls */}
                    <div className="flex items-center flex-shrink-0">
                      <button onClick={() => setCart(p => p.map(c => c.id===item.id && c.quantity>1 ? {...c,quantity:c.quantity-1} : c).filter(c => c.quantity>0))}
                        className="w-5 h-5 rounded border text-xs flex items-center justify-center hover:bg-muted">−</button>
                      <span className="w-5 text-center text-xs font-bold">{item.quantity}</span>
                      <button onClick={() => setCart(p => p.map(c => c.id===item.id ? {...c,quantity:c.quantity+1} : c))}
                        className="w-5 h-5 rounded border text-xs flex items-center justify-center hover:bg-muted">+</button>
                    </div>
                    <span className="text-xs font-semibold w-14 text-right flex-shrink-0">₹{(item.price*item.quantity).toFixed(0)}</span>
                    {/* Edit/delete — show on hover */}
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button onClick={() => { setNoteItem(item); setNoteText(item.note??""); }}
                        className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground rounded">
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button onClick={() => setCart(p => p.filter(c => c.id!==item.id))}
                        className="w-5 h-5 flex items-center justify-center text-destructive/50 hover:text-destructive rounded">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totals */}
          {cart.length > 0 && (
            <>
              {/* KOT/BOT summary strip */}
              <div className="px-3 py-1.5 border-t bg-muted/10 flex gap-4 text-[11px]">
                {kitchenItems.length > 0 && (
                  <span className="flex items-center gap-1 text-orange-600 font-medium">
                    <ChefHat className="w-3 h-3" />KOT: {kitchenItems.reduce((s,i) => s+i.quantity, 0)} items
                  </span>
                )}
                {barItems.length > 0 && (
                  <span className="flex items-center gap-1 text-purple-600 font-medium">
                    <Wine className="w-3 h-3" />BOT: {barItems.reduce((s,i) => s+i.quantity, 0)} items
                  </span>
                )}
              </div>
              <div className="px-3 py-2 border-t space-y-0.5 text-xs bg-card">
                <div className="flex justify-between text-muted-foreground">
                  <span>Item(s)</span><span>{cart.reduce((s,i) => s+i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Sub Total</span><span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>CGST (2.5%)</span><span>₹{cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>SGST (2.5%)</span><span>₹{sgst.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span><span>-₹{discAmt.toFixed(2)}</span>
                  </div>
                )}
                <Separator className="my-1" />
                <div className="flex justify-between font-bold text-sm pt-0.5">
                  <span>Total</span><span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}

          {/* ── Action Buttons (workflow-enforced) ── */}
          <div className="p-2 border-t space-y-1.5 bg-card">
            {/* Setup warning if session isn't ready */}
            {!sessionReady && orderType === "Dine In" && (
              <button onClick={() => { setShowSetupWizard(true); setSetupStep("table"); }}
                className="w-full h-10 text-sm font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center gap-2 active:scale-95 transition-all">
                <AlertTriangle className="w-4 h-4" />
                Assign Table First
              </button>
            )}

            {/* Save as Draft */}
            <Button
              onClick={() => setCart([])}
              className="w-full h-10 text-sm font-bold rounded-xl"
              style={{background:"#b45309", color:"white"}}
              variant="default">
              Save as Draft
            </Button>

            {/* KOT row */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                disabled={cart.length===0 || !sessionReady}
                onClick={() => checkPerm("Fire KOT/BOT", () => setShowKotConfirm(true))}
                className={`h-10 rounded-xl text-xs font-bold text-white transition-all
                  ${permissions.pos_fireKOT && cart.length > 0 && sessionReady
                    ? "bg-slate-800 hover:bg-slate-700 active:scale-95"
                    : "bg-slate-400 cursor-not-allowed opacity-60"}`}>
                KOT
              </button>
              <button
                disabled={cart.length===0 || !sessionReady}
                onClick={() => checkPerm("Fire KOT/BOT", () => setShowKotConfirm(true))}
                className={`h-10 rounded-xl text-xs font-bold text-white transition-all
                  ${permissions.pos_fireKOT && cart.length > 0 && sessionReady
                    ? "bg-slate-700 hover:bg-slate-600 active:scale-95"
                    : "bg-slate-400 cursor-not-allowed opacity-60"}`}>
                KOT & Print
              </button>
              <button
                disabled={cart.length===0 || !sessionReady}
                onClick={() => checkPerm("Fire KOT/BOT", () => { setShowKotConfirm(true); })}
                className={`h-10 rounded-xl text-[10px] font-bold text-white leading-tight px-1 transition-all
                  ${permissions.pos_fireKOT && permissions.pos_generateBill && cart.length > 0 && sessionReady
                    ? "bg-slate-900 hover:bg-slate-800 active:scale-95"
                    : "bg-slate-400 cursor-not-allowed opacity-60"}`}>
                KOT, Bill & Pay
              </button>
            </div>

            {/* BILL row — BLOCKED until KOT is fired */}
            <div className="grid grid-cols-3 gap-1.5">
              <button
                disabled={!kotFired}
                onClick={() => { if (!kotFired) return; checkPerm("Bill", () => { setShowBill(true); setBillGenerated(true); }); }}
                className={`h-10 rounded-xl text-xs font-bold text-white transition-all relative
                  ${permissions.pos_generateBill && kotFired
                    ? "bg-zinc-800 hover:bg-zinc-700 active:scale-95"
                    : "bg-slate-400 cursor-not-allowed opacity-60"}`}>
                BILL
                {!kotFired && cart.length > 0 && <span className="absolute -top-1 -right-1 text-[8px] bg-amber-500 text-white px-1 rounded-full">KOT first</span>}
              </button>
              <button
                disabled={!kotFired}
                onClick={() => { if (!kotFired) return; checkPerm("Bill", () => { setShowBill(true); setBillGenerated(true); }); }}
                className={`h-10 rounded-xl text-xs font-bold text-white transition-all relative
                  ${permissions.pos_generateBill && kotFired
                    ? "bg-green-700 hover:bg-green-600 active:scale-95"
                    : "bg-slate-400 cursor-not-allowed opacity-60"}`}>
                Bill & Payment
                {!kotFired && cart.length > 0 && <span className="absolute -top-1 -right-1 text-[8px] bg-amber-500 text-white px-1 rounded-full">KOT first</span>}
              </button>
              <button
                disabled={!kotFired}
                onClick={() => { if (!kotFired) return; checkPerm("Bill", () => { setShowBill(true); setBillGenerated(true); }); }}
                className={`h-10 rounded-xl text-xs font-bold text-white transition-all relative
                  ${permissions.pos_generateBill && kotFired
                    ? "bg-blue-600 hover:bg-blue-500 active:scale-95"
                    : "bg-slate-400 cursor-not-allowed opacity-60"}`}>
                Bill & Print
                {!kotFired && cart.length > 0 && <span className="absolute -top-1 -right-1 text-[8px] bg-amber-500 text-white px-1 rounded-full">KOT first</span>}
              </button>
            </div>

            {/* Role / workflow hints */}
            {!permissions.pos_takeOrder && (
              <p className="text-[10px] text-center text-amber-600 flex items-center justify-center gap-1">
                <ShieldAlert className="w-3 h-3" />{currentStaff.role} cannot take orders
              </p>
            )}
            {!sessionReady && orderType === "Dine In" && (
              <p className="text-[10px] text-center text-amber-600 flex items-center justify-center gap-1">
                <AlertTriangle className="w-3 h-3" />Assign a table to start ordering
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Fired tickets strip */}
      {firedTickets.length > 0 && (
        <div className="border-t bg-muted/30 px-3 py-1.5 flex gap-2 overflow-x-auto flex-shrink-0" style={{height:36}}>
          {firedTickets.map(t => (
            <div key={t.id}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium flex-shrink-0 animate-in fade-in duration-300
                ${t.type==="KOT" ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-purple-50 border-purple-200 text-purple-700"}`}>
              {t.type==="KOT" ? <ChefHat className="w-3 h-3" /> : <Wine className="w-3 h-3" />}
              {t.id} · {t.tableLabel} · {t.time}
            </div>
          ))}
        </div>
      )}

      {/* ════════════════════ MODALS ════════════════════ */}

      {/* Order Type (same as above — handled via showOrderType state) */}

      {/* Table Assignment */}
      <Dialog open={showTable} onOpenChange={setShowTable}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Table</DialogTitle>
            <DialogDescription>
              {currentStaff.section ? `${currentStaff.name}'s section (${currentStaff.section}) highlighted` : "Select a table for this order"}
            </DialogDescription>
          </DialogHeader>
          {/* Section tabs */}
          <div className="flex gap-2 flex-wrap">
            {SECTIONS.map(s => (
              <button key={s} onClick={() => setTableSection(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors
                  ${tableSection===s ? "bg-slate-800 text-white border-slate-800" : "hover:border-slate-400"}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 max-h-64 overflow-y-auto">
            {ALL_TABLES
              .filter(t => tableSection==="All" || t.section===tableSection)
              .map(t => {
                const isMySection = t.section === currentStaff.section;
                const avail = t.status === "available";
                return (
                  <button key={t.id} disabled={!avail}
                    onClick={() => { setSelectedTable(t); setShowTable(false); }}
                    className={`relative border-2 rounded-xl p-3 text-center transition-all
                      ${selectedTable?.id===t.id ? "border-primary bg-primary/10" : ""}
                      ${isMySection && avail ? "ring-2 ring-primary/20 ring-offset-1" : ""}
                      ${avail ? "hover:border-primary/60 cursor-pointer hover:shadow-md" : "opacity-40 cursor-not-allowed bg-muted/30"}`}>
                    <div className="text-2xl mb-1">{t.section==="Bar Area" ? "🍸" : "🪑"}</div>
                    <p className="font-semibold text-xs">{t.name}</p>
                    <p className="text-muted-foreground text-[10px]">{t.seats} seats</p>
                    <div className={`mt-1 w-2 h-2 rounded-full mx-auto
                      ${t.status==="available" ? "bg-green-500" : t.status==="occupied" ? "bg-red-500" : "bg-amber-400"}`} />
                    {t.status!=="available" && <p className="text-[9px] text-muted-foreground capitalize">{t.status}</p>}
                    {isMySection && avail && (
                      <div className="absolute top-1 right-1 text-[8px] text-primary font-bold">MY</div>
                    )}
                  </button>
                );
              })}
          </div>
          <div className="flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" />Available</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" />Occupied</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" />Reserved</span>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer lookup */}
      <Dialog open={showCustomer} onOpenChange={setShowCustomer}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add / Change Customer</DialogTitle>
          <DialogDescription>Search existing customer or add a new one</DialogDescription></DialogHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by name or phone…"
              value={custSearch} onChange={e => setCustSearch(e.target.value)} />
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {CUSTOMERS
              .filter(c => c.name.toLowerCase().includes(custSearch.toLowerCase()) || c.phone.includes(custSearch))
              .map(c => (
                <div key={c.id} onClick={() => { setSelectedCustomer(c); setShowCustomer(false); }}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:border-primary/60 transition-all
                    ${selectedCustomer?.id===c.id ? "border-primary bg-primary/5" : ""}`}>
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.phone} · {c.visits} visits · {c.lastVisit}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-amber-600">{c.loyaltyPoints} pts</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />Loyal
                    </p>
                  </div>
                </div>
              ))}
            {CUSTOMERS.filter(c => c.name.toLowerCase().includes(custSearch.toLowerCase()) || c.phone.includes(custSearch)).length === 0 && custSearch && (
              <p className="text-sm text-muted-foreground text-center py-3">No matching customer found — add new below</p>
            )}
          </div>
          {/* Add New Customer form */}
          <div className="pt-2 border-t space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Customer</p>
            <div className="flex gap-2">
              <Input placeholder="Customer name" className="flex-1 text-sm h-9"
                value={newCustName} onChange={e => setNewCustName(e.target.value)} />
              <Input placeholder="Phone number" className="w-36 text-sm h-9"
                value={newCustPhone} onChange={e => setNewCustPhone(e.target.value)} />
            </div>
            <Button size="sm" className="w-full h-9"
              disabled={!newCustName.trim() || !newCustPhone.trim()}
              onClick={() => {
                const newCust = {
                  id: Date.now(),
                  name: newCustName.trim(),
                  phone: newCustPhone.trim(),
                  loyaltyPoints: 0,
                  visits: 1,
                  lastVisit: "Today",
                };
                CUSTOMERS.push(newCust);
                setSelectedCustomer(newCust);
                setNewCustName(""); setNewCustPhone("");
                setShowCustomer(false);
              }}>
              + Add & Select Customer
            </Button>
          </div>
          {selectedCustomer && (
            <button onClick={() => { setSelectedCustomer(null); setShowCustomer(false); }}
              className="text-xs text-destructive hover:underline text-center w-full">
              Remove Customer (continue as Walk-in)
            </button>
          )}
        </DialogContent>
      </Dialog>

      {/* KOT / BOT Fire Confirmation */}
      <Dialog open={showKotConfirm} onOpenChange={setShowKotConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Fire KOT / BOT</DialogTitle>
            <DialogDescription>Firing as {currentStaff.name} ({currentStaff.role})</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {kitchenItems.length > 0 && (
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-orange-50 border-b border-orange-100 px-3 py-2.5 flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-orange-600" />
                  <span className="font-semibold text-sm text-orange-700">🔴 Kitchen KOT</span>
                  <Badge variant="outline" className="ml-auto text-xs border-orange-200 text-orange-600">→ Kitchen KDS</Badge>
                </div>
                <div className="p-3 space-y-1">
                  {kitchenItems.map(i => (
                    <div key={i.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{i.quantity}× {i.name}</span>
                      <span className="font-medium">₹{(i.price*i.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {barItems.length > 0 && (
              <div className="border rounded-xl overflow-hidden">
                <div className="bg-purple-50 border-b border-purple-100 px-3 py-2.5 flex items-center gap-2">
                  <Wine className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-sm text-purple-700">🟣 Bar BOT</span>
                  <Badge variant="outline" className="ml-auto text-xs border-purple-200 text-purple-600">→ Bar KDS</Badge>
                </div>
                <div className="p-3 space-y-1">
                  {barItems.map(i => (
                    <div key={i.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{i.quantity}× {i.name}</span>
                      <span className="font-medium">₹{(i.price*i.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-muted/30 rounded-xl p-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <span className="text-muted-foreground">Table / Type</span><span className="font-medium">{tableLabel}</span>
              <span className="text-muted-foreground">Staff</span><span className="font-medium">{currentStaff.name}</span>
              <span className="text-muted-foreground">Captain</span><span className="font-medium">{assignedCaptain.name} ({assignedCaptain.role})</span>
              <span className="text-muted-foreground">Customer</span><span className="font-medium">{selectedCustomer?.name ?? "Walk-in"}</span>
              <span className="text-muted-foreground">Pax</span><span className="font-medium">{pax}</span>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowKotConfirm(false)}>Cancel</Button>
            <Button variant="outline" className="gap-1.5" onClick={fireKOT}>
              <Printer className="w-4 h-4" />Fire & Print
            </Button>
            <Button onClick={fireKOT} className="gap-1.5">
              🔥 Fire {kitchenItems.length>0&&barItems.length>0?"KOT+BOT":kitchenItems.length>0?"KOT":"BOT"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bill */}
      <Dialog open={showBill} onOpenChange={setShowBill}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Receipt className="w-4 h-4" />Bill Preview</DialogTitle>
            <DialogDescription>Order #{orderNum} · {tableLabel} · {selectedCustomer?.name ?? "Walk-in"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {/* Items table */}
            <div className="border rounded-xl overflow-hidden text-sm">
              <div className="grid grid-cols-4 px-3 py-2 bg-muted/40 text-xs text-muted-foreground font-semibold uppercase">
                <span className="col-span-2">Item</span><span className="text-right">Qty × Rate</span><span className="text-right">Amt</span>
              </div>
              {cart.map(i => (
                <div key={i.id} className="grid grid-cols-4 px-3 py-1.5 border-t text-sm">
                  <span className="col-span-2 truncate">{i.name}</span>
                  <span className="text-right text-muted-foreground text-xs">{i.quantity} × ₹{i.price}</span>
                  <span className="text-right font-medium">₹{(i.price*i.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            {/* Discount */}
            {permissions.pos_applyDiscount && (
              <div className="flex items-center gap-3 p-3 border rounded-xl">
                <Label className="flex-1 text-sm">Discount (%)</Label>
                <input type="number" min={0} max={100} value={discount}
                  onChange={e => setDiscount(Number(e.target.value))}
                  className="w-20 border rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            )}
            {/* Loyalty */}
            {selectedCustomer && (
              <div className="flex items-center justify-between p-3 border rounded-xl">
                <div>
                  <p className="text-sm font-medium">Redeem Loyalty Points</p>
                  <p className="text-xs text-muted-foreground">{selectedCustomer.loyaltyPoints} pts available</p>
                </div>
                <Switch checked={useLoyalty} onCheckedChange={setUseLoyalty} />
              </div>
            )}
            {/* Totals */}
            <div className="space-y-1 text-sm px-1">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>CGST (2.5%)</span><span>₹{cgst.toFixed(2)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>SGST (2.5%)</span><span>₹{sgst.toFixed(2)}</span></div>
              {discount>0 && <div className="flex justify-between text-green-600"><span>Discount ({discount}%)</span><span>-₹{discAmt.toFixed(2)}</span></div>}
              {loyPts>0 && <div className="flex justify-between text-amber-600"><span>Loyalty Redemption</span><span>-₹{loyPts.toFixed(2)}</span></div>}
              <Separator />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowBill(false)}>Close</Button>
            <Button variant="outline" className="gap-1.5"><Printer className="w-4 h-4" />Print Bill</Button>
            {permissions.pos_takePayment ? (
              <Button className="gap-1.5 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  setBillGenerated(true);
                  updateOrderInStore({
                    status: "billed",
                    items: cart.map(c => ({ name: c.name, qty: c.quantity, price: c.price, route: c.kotRoute })),
                    subtotal, tax: cgst + sgst, discount, total,
                    billedAt: new Date().toISOString(),
                  });
                  setShowBill(false); setShowPayment(true);
                }}>
                <CreditCard className="w-4 h-4" />Take Payment
              </Button>
            ) : (
              <Button className="gap-1.5 bg-amber-600 hover:bg-amber-700"
                onClick={() => {
                  setBillGenerated(true);
                  updateOrderInStore({
                    status: "billed",
                    items: cart.map(c => ({ name: c.name, qty: c.quantity, price: c.price, route: c.kotRoute })),
                    subtotal, tax: cgst + sgst, discount, total,
                    billedAt: new Date().toISOString(),
                  });
                  setShowBill(false);
                }}>
                <ArrowRight className="w-4 h-4" />Send to Cashier
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Collect Payment</DialogTitle>
            <DialogDescription>Order #{orderNum} · {tableLabel}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {(["Cash","Card","UPI","Split"] as const).map(m => (
                <button key={m} onClick={() => setPayMethod(m)}
                  className={`border-2 rounded-xl py-3 text-sm font-semibold transition-all
                    ${payMethod===m ? "border-primary bg-primary/5" : "hover:border-primary/40"}`}>
                  {m==="Cash"?"💵":m==="Card"?"💳":m==="UPI"?"📱":"✂️"} {m}
                </button>
              ))}
            </div>
            <div className="bg-muted/30 rounded-2xl p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">Amount Due · {payMethod}</p>
              <p className="text-5xl font-bold tracking-tight">₹{total.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-2">{selectedCustomer?.name ?? "Walk-in Customer"}</p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPayment(false)}>Cancel</Button>
            <Button className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
              onClick={() => {
                // Update store + free table
                updateOrderInStore({
                  status: "paid",
                  paymentMethod: payMethod,
                  paidAt: new Date().toISOString(),
                });
                if (selectedTable) {
                  const t = ALL_TABLES.find(x => x.id === selectedTable.id);
                  if (t) t.status = "available";
                }
                setShowPayment(false); reset();
              }}>
              <CheckCircle className="w-4 h-4" />₹{total.toFixed(2)} Received
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item note */}
      <Dialog open={!!noteItem} onOpenChange={() => setNoteItem(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Chef Note — {noteItem?.name}</DialogTitle></DialogHeader>
          <Input placeholder="e.g. Less spicy, no onions, extra sauce…"
            value={noteText} onChange={e => setNoteText(e.target.value)}
            onKeyDown={e => { if(e.key==="Enter") { setCart(p => p.map(c => c.id===noteItem?.id ? {...c,note:noteText} : c)); setNoteItem(null); }}} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteItem(null)}>Cancel</Button>
            <Button onClick={() => { setCart(p => p.map(c => c.id===noteItem?.id ? {...c,note:noteText} : c)); setNoteItem(null); }}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Access Denied */}
      <Dialog open={showDenied} onOpenChange={setShowDenied}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldAlert className="w-5 h-5" />Access Denied
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">{currentStaff.role} cannot:</p>
              <p className="text-xl font-bold text-destructive mt-1">{deniedAction}</p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {deniedAction==="Fire KOT/BOT" && "Captain, Manager, or Admin can fire KOT/BOT."}
              {deniedAction==="Bill" && "Captain, Cashier, Manager, or Admin can generate bills."}
              {deniedAction==="Payment" && "Cashier, Manager, or Admin can take payment."}
              {deniedAction==="Discount" && "Captain, Manager, or Admin can apply discounts."}
            </p>
            <p className="text-xs text-muted-foreground text-center bg-muted/30 rounded-lg p-2">
              Switch to an authorised role via the staff switcher in the sidebar.
            </p>
          </div>
          <DialogFooter>
            <Button className="w-full" onClick={() => setShowDenied(false)}>Understood</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ════════════════════ SETUP WIZARD (Dine In) ════════════════════ */}
      <Dialog open={showSetupWizard} onOpenChange={setShowSetupWizard}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {setupStep === "table" && <><Grid3x3 className="w-5 h-5 text-green-600" /> Step 1: Assign Table</>}
              {setupStep === "customer" && <><User className="w-5 h-5 text-blue-600" /> Step 2: Customer Details</>}
              {setupStep === "done" && <><CheckCircle className="w-5 h-5 text-green-600" /> Setup Complete</>}
            </DialogTitle>
            <DialogDescription>
              {setupStep === "table" && "Select an available table for this dine-in order"}
              {setupStep === "customer" && "Link a customer profile, add new, or continue as walk-in"}
              {setupStep === "done" && "All set! You can now start taking orders."}
            </DialogDescription>
          </DialogHeader>

          {/* Wizard step indicators */}
          <div className="flex items-center justify-center gap-2 py-2">
            {[
              { key: "table", label: "Table", icon: "🪑" },
              { key: "customer", label: "Customer", icon: "👤" },
            ].map((s, idx) => {
              const steps = ["table", "customer", "done"];
              const currentIdx = steps.indexOf(setupStep);
              const sIdx = idx;
              const isDone = currentIdx > sIdx || setupStep === "done";
              const isCurrent = setupStep === s.key;
              return (
                <div key={s.key} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                    ${isDone ? "bg-green-500 text-white" : isCurrent ? "bg-primary text-primary-foreground ring-2 ring-primary/30" : "bg-muted text-muted-foreground"}`}>
                    {isDone ? "✓" : s.icon}
                  </div>
                  <span className={`text-xs font-medium ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                  {idx < 1 && <div className={`w-8 h-px ${isDone ? "bg-green-400" : "bg-border"}`} />}
                </div>
              );
            })}
            {/* Auto-assigned captain indicator */}
            <div className="ml-3 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/40 text-xs border">
              <Avatar className="w-4 h-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-[8px] font-bold">{assignedCaptain.avatar}</AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">Captain:</span>
              <span className="font-medium">{assignedCaptain.name}</span>
            </div>
          </div>

          {/* STEP: Table */}
          {setupStep === "table" && (
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                {SECTIONS.map(s => (
                  <button key={s} onClick={() => setTableSection(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors
                      ${tableSection===s ? "bg-slate-800 text-white border-slate-800" : "hover:border-slate-400"}`}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 max-h-64 overflow-y-auto">
                {ALL_TABLES
                  .filter(t => tableSection==="All" || t.section===tableSection)
                  .map(t => {
                    const isMySection = t.section === currentStaff.section;
                    const avail = t.status === "available";
                    return (
                      <button key={t.id} disabled={!avail}
                        onClick={() => {
                          setSelectedTable(t);
                          setSetupStep("customer");
                        }}
                        className={`relative border-2 rounded-xl p-3 text-center transition-all
                          ${selectedTable?.id===t.id ? "border-primary bg-primary/10" : ""}
                          ${isMySection && avail ? "ring-2 ring-primary/20 ring-offset-1" : ""}
                          ${avail ? "hover:border-primary/60 cursor-pointer hover:shadow-md" : "opacity-40 cursor-not-allowed bg-muted/30"}`}>
                        <div className="text-2xl mb-1">{t.section==="Bar Area" ? "🍸" : "🪑"}</div>
                        <p className="font-semibold text-xs">{t.name}</p>
                        <p className="text-muted-foreground text-[10px]">{t.seats} seats</p>
                        <div className={`mt-1 w-2 h-2 rounded-full mx-auto
                          ${t.status==="available" ? "bg-green-500" : t.status==="occupied" ? "bg-red-500" : "bg-amber-400"}`} />
                        {isMySection && avail && (
                          <div className="absolute top-1 right-1 text-[8px] text-primary font-bold">MY</div>
                        )}
                      </button>
                    );
                  })}
              </div>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" />Available</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" />Occupied</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" />Reserved</span>
              </div>
            </div>
          )}

          {/* STEP: Customer */}
          {setupStep === "customer" && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search by name or phone…"
                  value={custSearch} onChange={e => setCustSearch(e.target.value)} />
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {CUSTOMERS
                  .filter(c => c.name.toLowerCase().includes(custSearch.toLowerCase()) || c.phone.includes(custSearch))
                  .map(c => (
                    <div key={c.id} onClick={() => { setSelectedCustomer(c); setSetupStep("done"); }}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:border-primary/60 transition-all
                        ${selectedCustomer?.id===c.id ? "border-primary bg-primary/5" : ""}`}>
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                        {c.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.phone} · {c.visits} visits</p>
                      </div>
                      <p className="text-xs font-bold text-amber-600">{c.loyaltyPoints} pts</p>
                    </div>
                  ))}
                {CUSTOMERS.filter(c => c.name.toLowerCase().includes(custSearch.toLowerCase()) || c.phone.includes(custSearch)).length === 0 && custSearch && (
                  <p className="text-sm text-muted-foreground text-center py-2">No match — add new customer below</p>
                )}
              </div>
              {/* Add New Customer inline */}
              <div className="pt-2 border-t space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Customer</p>
                <div className="flex gap-2">
                  <Input placeholder="Customer name" className="flex-1 text-sm h-9"
                    value={newCustName} onChange={e => setNewCustName(e.target.value)} />
                  <Input placeholder="Phone number" className="w-36 text-sm h-9"
                    value={newCustPhone} onChange={e => setNewCustPhone(e.target.value)} />
                </div>
                <Button size="sm" className="w-full h-9"
                  disabled={!newCustName.trim() || !newCustPhone.trim()}
                  onClick={() => {
                    const newCust = {
                      id: Date.now(),
                      name: newCustName.trim(),
                      phone: newCustPhone.trim(),
                      loyaltyPoints: 0,
                      visits: 1,
                      lastVisit: "Today",
                    };
                    CUSTOMERS.push(newCust);
                    setSelectedCustomer(newCust);
                    setNewCustName(""); setNewCustPhone("");
                    setSetupStep("done");
                  }}>
                  + Add & Select Customer
                </Button>
              </div>
              {/* Pax count */}
              <div className="flex items-center justify-between p-3 border rounded-xl">
                <span className="text-sm font-medium">Pax Count</span>
                <div className="flex items-center border rounded-lg overflow-hidden text-sm">
                  <button onClick={() => setPax(p => Math.max(1,p-1))} className="px-3 py-1.5 hover:bg-muted border-r font-bold">−</button>
                  <span className="px-4 font-bold">{pax}</span>
                  <button onClick={() => setPax(p => p+1)} className="px-3 py-1.5 hover:bg-muted border-l font-bold">+</button>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSetupStep("table")}>← Back</Button>
                <Button variant="outline" onClick={() => setSetupStep("done")}>
                  Skip (Walk-in) →
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* STEP: Done */}
          {setupStep === "done" && (
            <div className="space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Table</span>
                  <span className="font-semibold">{selectedTable?.name} ({selectedTable?.section})</span>
                  <span className="text-muted-foreground">Customer</span>
                  <span className="font-semibold">{selectedCustomer?.name ?? "Walk-in"}</span>
                  <span className="text-muted-foreground">Captain</span>
                  <span className="font-semibold">{assignedCaptain.name} ({assignedCaptain.role})</span>
                  <span className="text-muted-foreground">Pax</span>
                  <span className="font-semibold">{pax}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Table status → "Occupied". Session timer starts when first KOT is fired.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSetupStep("customer")}>← Edit</Button>
                <Button className="gap-1.5 bg-green-600 hover:bg-green-700 flex-1"
                  onClick={() => { setShowSetupWizard(false); createOrder(); }}>
                  <CheckCircle className="w-4 h-4" /> Start Taking Order
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

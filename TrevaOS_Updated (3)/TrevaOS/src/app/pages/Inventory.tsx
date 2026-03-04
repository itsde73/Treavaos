import { useState } from "react";
import { AlertTriangle, Package, TrendingDown, FileText, Pencil, Trash2, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Progress } from "../components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

// ── mock data ────────────────────────────────────────────────────────────────

const inventory = [
  { id: 1, name: "Tomatoes", current: 5, min: 10, max: 50, unit: "kg", status: "critical" },
  { id: 2, name: "Cheese", current: 12, min: 15, max: 40, unit: "kg", status: "low" },
  { id: 3, name: "Chicken", current: 25, min: 20, max: 60, unit: "kg", status: "good" },
  { id: 4, name: "Olive Oil", current: 3, min: 8, max: 25, unit: "L", status: "critical" },
  { id: 5, name: "Flour", current: 45, min: 30, max: 100, unit: "kg", status: "good" },
  { id: 6, name: "Onions", current: 18, min: 15, max: 50, unit: "kg", status: "good" },
];

const purchaseOrders = [
  { id: "PO-001", supplier: "Fresh Farm Co.", items: 5, amount: 12500, status: "pending", date: "2024-03-02" },
  { id: "PO-002", supplier: "Dairy Best", items: 3, amount: 8900, status: "received", date: "2024-03-01" },
  { id: "PO-003", supplier: "Meat Masters", items: 4, amount: 15600, status: "pending", date: "2024-03-02" },
];

type Supplier = {
  id: number;
  name: string;
  contact: string;
  email: string;
  category: string;
  paymentTerms: string;
  creditPeriod: string;
  status: string;
  totalOrders: number;
  totalSpend: number;
};

const initialSuppliers: Supplier[] = [
  { id: 1, name: "Fresh Farm Co.", contact: "+91 98201 11234", email: "orders@freshfarm.in", category: "Food", paymentTerms: "Net 30", creditPeriod: "30 days", status: "Active", totalOrders: 42, totalSpend: 520000 },
  { id: 2, name: "Dairy Best Pvt Ltd", contact: "+91 98765 44321", email: "supply@dairybest.in", category: "Food", paymentTerms: "Net 15", creditPeriod: "15 days", status: "Active", totalOrders: 38, totalSpend: 310000 },
  { id: 3, name: "Meat Masters", contact: "+91 90001 55678", email: "bulk@meatmasters.com", category: "Food", paymentTerms: "COD", creditPeriod: "0 days", status: "Active", totalOrders: 29, totalSpend: 480000 },
  { id: 4, name: "Raj Beverages", contact: "+91 77001 22890", email: "raj@rajbev.co.in", category: "Beverage", paymentTerms: "Net 45", creditPeriod: "45 days", status: "Active", totalOrders: 17, totalSpend: 190000 },
  { id: 5, name: "CleanPro Supplies", contact: "+91 88002 33901", email: "info@cleanpro.in", category: "Cleaning", paymentTerms: "Net 30", creditPeriod: "30 days", status: "Inactive", totalOrders: 11, totalSpend: 64000 },
  { id: 6, name: "PackRight India", contact: "+91 91234 56789", email: "sales@packright.in", category: "Packaging", paymentTerms: "Net 15", creditPeriod: "15 days", status: "Active", totalOrders: 24, totalSpend: 98000 },
];

type WastageEntry = {
  id: number;
  date: string;
  item: string;
  qty: number;
  unit: string;
  reason: string;
  section: string;
  loggedBy: string;
  value: number;
};

const initialWastage: WastageEntry[] = [
  { id: 1, date: "2024-03-02", item: "Tomatoes", qty: 3, unit: "kg", reason: "Spoilage", section: "Kitchen", loggedBy: "Ravi Kumar", value: 90 },
  { id: 2, date: "2024-03-02", item: "Fresh Cream", qty: 0.5, unit: "L", reason: "Expired", section: "Kitchen", loggedBy: "Sunita Sharma", value: 75 },
  { id: 3, date: "2024-03-02", item: "Whisky (peg)", qty: 2, unit: "peg", reason: "Spillage", section: "Bar", loggedBy: "Arjun Nair", value: 300 },
  { id: 4, date: "2024-03-01", item: "Paneer", qty: 1, unit: "kg", reason: "Over-portion", section: "Kitchen", loggedBy: "Ravi Kumar", value: 280 },
  { id: 5, date: "2024-03-01", item: "Wine Glass", qty: 1, unit: "pcs", reason: "Breakage", section: "Bar", loggedBy: "Priya Menon", value: 450 },
  { id: 6, date: "2024-02-28", item: "Chicken Tikka", qty: 0.8, unit: "kg", reason: "Over-portion", section: "Kitchen", loggedBy: "Sunita Sharma", value: 240 },
  { id: 7, date: "2024-02-27", item: "Basmati Rice", qty: 2, unit: "kg", reason: "Spoilage", section: "Kitchen", loggedBy: "Ravi Kumar", value: 180 },
  { id: 8, date: "2024-02-26", item: "Orange Juice", qty: 1, unit: "L", reason: "Expired", section: "Bar", loggedBy: "Arjun Nair", value: 120 },
];

// ── helpers ──────────────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  critical: "bg-red-100 text-red-800",
  low: "bg-yellow-100 text-yellow-800",
  good: "bg-green-100 text-green-800",
};

const SUPPLIER_CATEGORIES = ["Food", "Beverage", "Cleaning", "Packaging", "Misc"];
const PAYMENT_TERMS = ["COD", "Net 7", "Net 15", "Net 30", "Net 45", "Net 60"];
const CREDIT_PERIODS = ["0 days", "7 days", "15 days", "30 days", "45 days", "60 days"];
const WASTAGE_REASONS = ["Spoilage", "Spillage", "Over-portion", "Breakage", "Expired"];
const WASTAGE_SECTIONS = ["Kitchen", "Bar"];
const WASTAGE_UNITS = ["kg", "g", "L", "ml", "pcs", "peg", "plate"];

const today = "2024-03-02";
const thisWeekStart = "2024-02-25";
const thisMonthStart = "2024-02-01";

function sum(entries: WastageEntry[], from: string) {
  return entries
    .filter((e) => e.date >= from)
    .reduce((acc, e) => acc + e.value, 0);
}

// ── blank forms ──────────────────────────────────────────────────────────────

const blankSupplier = (): Omit<Supplier, "id" | "totalOrders" | "totalSpend"> => ({
  name: "", contact: "", email: "", category: "Food",
  paymentTerms: "Net 30", creditPeriod: "30 days", status: "Active",
});

const blankWastage = (): Omit<WastageEntry, "id"> => ({
  date: today, item: "", qty: 0, unit: "kg",
  reason: "Spoilage", section: "Kitchen", loggedBy: "", value: 0,
});

// ── component ────────────────────────────────────────────────────────────────

export function Inventory() {
  // Suppliers state
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [supplierDialogOpen, setSupplierDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierForm, setSupplierForm] = useState(blankSupplier());
  const [supplierError, setSupplierError] = useState("");

  // Wastage state
  const [wastage, setWastage] = useState<WastageEntry[]>(initialWastage);
  const [wastageDialogOpen, setWastageDialogOpen] = useState(false);
  const [wastageForm, setWastageForm] = useState(blankWastage());
  const [wastageError, setWastageError] = useState("");

  // ── supplier handlers ──────────────────────────────────────────────────────

  function openAddSupplier() {
    setEditingSupplier(null);
    setSupplierForm(blankSupplier());
    setSupplierError("");
    setSupplierDialogOpen(true);
  }

  function openEditSupplier(s: Supplier) {
    setEditingSupplier(s);
    setSupplierForm({
      name: s.name, contact: s.contact, email: s.email,
      category: s.category, paymentTerms: s.paymentTerms,
      creditPeriod: s.creditPeriod, status: s.status,
    });
    setSupplierError("");
    setSupplierDialogOpen(true);
  }

  function saveSupplier() {
    if (!supplierForm.name.trim()) {
      setSupplierError("Supplier name is required.");
      return;
    }
    setSupplierError("");
    if (editingSupplier) {
      setSuppliers((prev) =>
        prev.map((s) => s.id === editingSupplier.id ? { ...editingSupplier, ...supplierForm } : s)
      );
    } else {
      const newId = Math.max(0, ...suppliers.map((s) => s.id)) + 1;
      setSuppliers((prev) => [...prev, { id: newId, ...supplierForm, totalOrders: 0, totalSpend: 0 }]);
    }
    setSupplierDialogOpen(false);
  }

  function deleteSupplier(id: number) {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  }

  // ── wastage handlers ───────────────────────────────────────────────────────

  function openLogWastage() {
    setWastageForm(blankWastage());
    setWastageError("");
    setWastageDialogOpen(true);
  }

  function saveWastage() {
    if (!wastageForm.item.trim() || !wastageForm.loggedBy.trim()) {
      setWastageError("Item and Logged By fields are required.");
      return;
    }
    setWastageError("");
    const newId = Math.max(0, ...wastage.map((w) => w.id)) + 1;
    setWastage((prev) => [{ id: newId, ...wastageForm }, ...prev]);
    setWastageDialogOpen(false);
  }

  // ── wastage summary ────────────────────────────────────────────────────────

  const wastageToday = sum(wastage, today);
  const wastageWeek = sum(wastage, thisWeekStart);
  const wastageMonth = sum(wastage, thisMonthStart);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Inventory & Purchase</h1>
          <p className="text-muted-foreground mt-1">
            Track stock levels and manage purchase orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openAddSupplier}>Add Supplier</Button>
          <Button>New Purchase Order</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-semibold mt-1">156</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-semibold mt-1">12</p>
              </div>
              <TrendingDown className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-semibold mt-1">4</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PO Pending</p>
                <p className="text-2xl font-semibold mt-1">8</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Stock Levels</TabsTrigger>
          <TabsTrigger value="purchase">Purchase Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="wastage">Wastage</TabsTrigger>
        </TabsList>

        {/* ── Stock Levels ── */}
        <TabsContent value="stock" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min Level</TableHead>
                    <TableHead>Max Level</TableHead>
                    <TableHead>Stock %</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => {
                    const percentage = (item.current / item.max) * 100;
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.current} {item.unit}</TableCell>
                        <TableCell>{item.min} {item.unit}</TableCell>
                        <TableCell>{item.max} {item.unit}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={percentage} className="w-20" />
                            <span className="text-sm">{percentage.toFixed(0)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[item.status]}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Reorder</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Purchase Orders ── */}
        <TabsContent value="purchase" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrders.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium">{po.id}</TableCell>
                      <TableCell>{po.supplier}</TableCell>
                      <TableCell>{po.items}</TableCell>
                      <TableCell>₹{po.amount.toLocaleString()}</TableCell>
                      <TableCell>{po.date}</TableCell>
                      <TableCell>
                        <Badge variant={po.status === "received" ? "secondary" : "outline"}>
                          {po.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Suppliers ── */}
        <TabsContent value="suppliers" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={openAddSupplier}>+ Add Supplier</Button>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Supplier List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Payment Terms</TableHead>
                    <TableHead>Credit Period</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.contact}</TableCell>
                      <TableCell className="text-muted-foreground">{s.email}</TableCell>
                      <TableCell>{s.category}</TableCell>
                      <TableCell>{s.paymentTerms}</TableCell>
                      <TableCell>{s.creditPeriod}</TableCell>
                      <TableCell>
                        <Badge className={s.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}>
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEditSupplier(s)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteSupplier(s.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Purchase history summary */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Supplier-wise Purchase History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Total Spend (₹)</TableHead>
                    <TableHead>Avg Order Value (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suppliers.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.category}</TableCell>
                      <TableCell>{s.totalOrders}</TableCell>
                      <TableCell>₹{s.totalSpend.toLocaleString()}</TableCell>
                      <TableCell>
                        {s.totalOrders > 0
                          ? `₹${Math.round(s.totalSpend / s.totalOrders).toLocaleString()}`
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Wastage ── */}
        <TabsContent value="wastage" className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Wastage Today</p>
                    <p className="text-2xl font-semibold mt-1">₹{wastageToday.toLocaleString()}</p>
                  </div>
                  <IndianRupee className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <p className="text-2xl font-semibold mt-1">₹{wastageWeek.toLocaleString()}</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-semibold mt-1">₹{wastageMonth.toLocaleString()}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={openLogWastage}>+ Log Wastage</Button>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Wastage Log</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Logged By</TableHead>
                    <TableHead>Value (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wastage.map((w) => (
                    <TableRow key={w.id}>
                      <TableCell>{w.date}</TableCell>
                      <TableCell className="font-medium">{w.item}</TableCell>
                      <TableCell>{w.qty}</TableCell>
                      <TableCell>{w.unit}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{w.reason}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={w.section === "Bar" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}>
                          {w.section}
                        </Badge>
                      </TableCell>
                      <TableCell>{w.loggedBy}</TableCell>
                      <TableCell className="font-medium text-red-600">₹{w.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Add / Edit Supplier Dialog ── */}
      <Dialog open={supplierDialogOpen} onOpenChange={setSupplierDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 space-y-1">
              <Label>Supplier Name</Label>
              <Input
                placeholder="e.g. Fresh Farm Co."
                value={supplierForm.name}
                onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Contact Number</Label>
              <Input
                placeholder="+91 98765 43210"
                value={supplierForm.contact}
                onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                placeholder="supplier@example.com"
                value={supplierForm.email}
                onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <Select
                value={supplierForm.category}
                onValueChange={(v) => setSupplierForm({ ...supplierForm, category: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SUPPLIER_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Payment Terms</Label>
              <Select
                value={supplierForm.paymentTerms}
                onValueChange={(v) => setSupplierForm({ ...supplierForm, paymentTerms: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_TERMS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Credit Period</Label>
              <Select
                value={supplierForm.creditPeriod}
                onValueChange={(v) => setSupplierForm({ ...supplierForm, creditPeriod: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CREDIT_PERIODS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select
                value={supplierForm.status}
                onValueChange={(v) => setSupplierForm({ ...supplierForm, status: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {supplierError && (
            <p className="text-sm text-red-600 px-1">{supplierError}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSupplierDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveSupplier}>{editingSupplier ? "Update" : "Add Supplier"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Log Wastage Dialog ── */}
      <Dialog open={wastageDialogOpen} onOpenChange={setWastageDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Log Wastage</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="space-y-1">
              <Label>Date</Label>
              <Input
                type="date"
                value={wastageForm.date}
                onChange={(e) => setWastageForm({ ...wastageForm, date: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Item</Label>
              <Input
                placeholder="e.g. Tomatoes"
                value={wastageForm.item}
                onChange={(e) => setWastageForm({ ...wastageForm, item: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Quantity</Label>
              <Input
                type="number"
                min={0}
                value={wastageForm.qty}
                onChange={(e) => setWastageForm({ ...wastageForm, qty: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-1">
              <Label>Unit</Label>
              <Select
                value={wastageForm.unit}
                onValueChange={(v) => setWastageForm({ ...wastageForm, unit: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WASTAGE_UNITS.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Reason</Label>
              <Select
                value={wastageForm.reason}
                onValueChange={(v) => setWastageForm({ ...wastageForm, reason: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WASTAGE_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Section</Label>
              <Select
                value={wastageForm.section}
                onValueChange={(v) => setWastageForm({ ...wastageForm, section: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WASTAGE_SECTIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Logged By</Label>
              <Input
                placeholder="Staff name"
                value={wastageForm.loggedBy}
                onChange={(e) => setWastageForm({ ...wastageForm, loggedBy: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Value (₹)</Label>
              <Input
                type="number"
                min={0}
                placeholder="0"
                value={wastageForm.value}
                onChange={(e) => setWastageForm({ ...wastageForm, value: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
          {wastageError && (
            <p className="text-sm text-red-600 px-1">{wastageError}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setWastageDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveWastage}>Log Wastage</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

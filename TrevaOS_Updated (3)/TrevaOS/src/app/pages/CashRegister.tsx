import { useState } from "react";
import { DollarSign, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, AlertCircle, Lock, Unlock, AlertTriangle, Printer, Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const DENOM_CONFIG = [
  { note: "₹2000", value: 2000 },
  { note: "₹500",  value: 500  },
  { note: "₹200",  value: 200  },
  { note: "₹100",  value: 100  },
  { note: "₹50",   value: 50   },
  { note: "₹20",   value: 20   },
  { note: "₹10",   value: 10   },
  { note: "Coins", value: 1    },
];

const EXPECTED_CASH = 27580; // simulated POS expected cash

const PAYMENT_BREAKUP = [
  { mode: "Cash",   amount: 14580 },
  { mode: "Card",   amount: 8200  },
  { mode: "UPI",    amount: 4800  },
];

const initialApprovals = [
  { id: 1, type: "Cash Out",    amount: 500,  reason: "Vegetable purchase",  requestedBy: "Ravi (Steward)",  time: "14:30", status: "pending"  },
  { id: 2, type: "Petty Cash",  amount: 200,  reason: "Cleaning supplies",   requestedBy: "Sunita (Cleaner)", time: "12:15", status: "approved" },
  { id: 3, type: "Cash Out",    amount: 1000, reason: "Gas cylinder",        requestedBy: "Ram (Cook)",       time: "10:00", status: "approved" },
];

const shifts = [
  { shift: "Morning (6AM–2PM)",    cashier: "Anita Sharma", openingBalance: 5000,  closingBalance: 18500, sales: 14200, expenses: 700  },
  { shift: "Afternoon (2PM–10PM)", cashier: "Vijay Kumar",  openingBalance: 18500, closingBalance: 42300, sales: 25100, expenses: 1300 },
];

const PETTY_CATEGORIES = ["Food", "Stationery", "Cleaning", "Other"] as const;

function emptyDenomCounts(): Record<string, string> {
  return Object.fromEntries(DENOM_CONFIG.map(d => [d.note, ""]));
}

function calcDenomTotal(counts: Record<string, string>): number {
  return DENOM_CONFIG.reduce((sum, d) => {
    const c = parseInt(counts[d.note] || "0", 10);
    return sum + (isNaN(c) ? 0 : c * d.value);
  }, 0);
}

export function CashRegister() {
  // Register open/close state
  const [isOpen, setIsOpen] = useState(false);

  // Open Register dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [floatCounts, setFloatCounts] = useState<Record<string, string>>(emptyDenomCounts);
  const floatTotal = calcDenomTotal(floatCounts);

  // Close Register dialog
  const [closeDialog, setCloseDialog] = useState(false);
  const [closeCounts, setCloseCounts] = useState<Record<string, string>>(emptyDenomCounts);
  const [managerPin, setManagerPin] = useState("");
  const [zReportOpen, setZReportOpen] = useState(false);
  const closeActual = calcDenomTotal(closeCounts);
  const variance = closeActual - EXPECTED_CASH;
  const varianceWarning = Math.abs(variance) > 500;

  // Drawer denominations after open (seeded from float on open)
  const [drawerCounts, setDrawerCounts] = useState<Record<string, string>>(
    Object.fromEntries(DENOM_CONFIG.map(d => [d.note, d.note === "₹500" ? "20" : d.note === "₹2000" ? "5" : d.note === "₹200" ? "15" : d.note === "₹100" ? "30" : d.note === "₹50" ? "20" : d.note === "₹20" ? "15" : d.note === "₹10" ? "25" : "100"]))
  );
  const totalInDrawer = calcDenomTotal(drawerCounts);

  // Approvals
  const [approvals, setApprovals] = useState(initialApprovals);

  // Cash Drop
  const [cashDrops, setCashDrops] = useState<{ id: number; amount: string; staff: string; time: string }[]>([]);
  const [dropAmount, setDropAmount] = useState("");
  const [dropStaff, setDropStaff] = useState("");

  // Petty Cash
  const [pettyEntries, setPettyEntries] = useState<{ id: number; category: string; description: string; reference: string; amount: string; time: string }[]>([]);
  const [pettyCategory, setPettyCategory] = useState<string>("Food");
  const [pettyDesc, setPettyDesc] = useState("");
  const [pettyRef, setPettyRef] = useState("");
  const [pettyAmount, setPettyAmount] = useState("");
  const pettyTotal = pettyEntries.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);

  function handleOpenRegister() {
    setIsOpen(true);
    setOpenDialog(false);
    setFloatCounts(emptyDenomCounts());
  }

  function handleCloseRegister() {
    if (varianceWarning && managerPin.trim() === "") return;
    setIsOpen(false);
    setCloseDialog(false);
    setZReportOpen(true);
    setManagerPin("");
    setCloseCounts(emptyDenomCounts());
  }

  function handleAddDrop() {
    if (!dropAmount || !dropStaff) return;
    const now = new Date();
    setCashDrops(prev => [...prev, {
      id: Date.now(),
      amount: dropAmount,
      staff: dropStaff,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setDropAmount("");
    setDropStaff("");
  }

  function handleAddPetty() {
    if (!pettyAmount || !pettyDesc) return;
    const now = new Date();
    setPettyEntries(prev => [...prev, {
      id: Date.now(),
      category: pettyCategory,
      description: pettyDesc,
      reference: pettyRef,
      amount: pettyAmount,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setPettyDesc("");
    setPettyRef("");
    setPettyAmount("");
    setPettyCategory("Food");
  }

  const totalCashDrops = cashDrops.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Cash Register</h1>
            <Badge className={`text-xs flex items-center gap-1 ${isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {isOpen ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
              {isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">Manage cash drawer, shifts, and approvals</p>
        </div>
        <div className="flex gap-2">
          {!isOpen ? (
            <Button size="sm" className="gap-1" onClick={() => setOpenDialog(true)}>
              <Unlock className="w-3.5 h-3.5" /> Open Register
            </Button>
          ) : (
            <Button size="sm" variant="destructive" className="gap-1" onClick={() => setCloseDialog(true)}>
              <Lock className="w-3.5 h-3.5" /> Close Register (Z Report)
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Cash in Drawer",      value: `₹${totalInDrawer.toLocaleString()}`, color: "text-green-600",  icon: DollarSign    },
          { label: "Today's Cash Sales",  value: "₹14,580",                            color: "text-blue-600",   icon: ArrowUpRight  },
          { label: "Cash Out (Expenses)", value: `₹${pettyTotal.toLocaleString()}`,    color: "text-red-600",    icon: ArrowDownRight },
          { label: "Pending Approvals",   value: approvals.filter(a => a.status === "pending").length, color: "text-amber-600", icon: AlertCircle },
        ].map(s => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="denominations">
        <TabsList>
          <TabsTrigger value="denominations">Denominations</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="shifts">Shift Reports</TabsTrigger>
          <TabsTrigger value="cashdrop">Cash Drop</TabsTrigger>
          <TabsTrigger value="pettycash">Petty Cash</TabsTrigger>
        </TabsList>

        {/* Denominations Tab */}
        <TabsContent value="denominations" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Current Drawer Denominations</span>
                <span className="text-lg font-bold text-green-600">Total: ₹{totalInDrawer.toLocaleString()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {DENOM_CONFIG.map(d => {
                  const c = parseInt(drawerCounts[d.note] || "0", 10);
                  const tot = isNaN(c) ? 0 : c * d.value;
                  return (
                    <div key={d.note} className="bg-muted/40 rounded-lg p-3 text-center">
                      <p className="font-bold text-base">{d.note}</p>
                      <p className="text-xs text-muted-foreground mt-1">× {isNaN(c) ? 0 : c} pcs</p>
                      <p className="font-semibold text-sm text-green-600 mt-1">₹{tot.toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" className="mt-4">Update Count</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="mt-4">
          <div className="space-y-3">
            {approvals.map(a => (
              <Card key={a.id} className="shadow-sm">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{a.type}</span>
                          <Badge variant="outline" className="text-xs">₹{a.amount}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{a.reason} · Requested by {a.requestedBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge className={`text-xs ${a.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{a.status}</Badge>
                        <p className="text-xs text-muted-foreground mt-1"><Clock className="w-3 h-3 inline mr-0.5" />{a.time}</p>
                      </div>
                      {a.status === "pending" && (
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="outline" className="h-7 text-xs text-red-500"
                            onClick={() => setApprovals(prev => prev.map(x => x.id === a.id ? { ...x, status: "rejected" } : x))}>
                            Reject
                          </Button>
                          <Button size="sm" className="h-7 text-xs gap-1"
                            onClick={() => setApprovals(prev => prev.map(x => x.id === a.id ? { ...x, status: "approved" } : x))}>
                            <CheckCircle className="w-3 h-3" />Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Shift Reports Tab */}
        <TabsContent value="shifts" className="mt-4">
          <div className="space-y-4">
            {shifts.map((s, i) => (
              <Card key={i} className="shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-sm">{s.shift} · {s.cashier}</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div><p className="text-xs text-muted-foreground">Opening Balance</p><p className="font-semibold">₹{s.openingBalance.toLocaleString()}</p></div>
                    <div><p className="text-xs text-muted-foreground">Cash Sales</p><p className="font-semibold text-green-600">+₹{s.sales.toLocaleString()}</p></div>
                    <div><p className="text-xs text-muted-foreground">Cash Out</p><p className="font-semibold text-red-600">-₹{s.expenses.toLocaleString()}</p></div>
                    <div><p className="text-xs text-muted-foreground">Closing Balance</p><p className="font-semibold text-blue-600">₹{s.closingBalance.toLocaleString()}</p></div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 text-xs h-7">View Full Report</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cash Drop Tab */}
        <TabsContent value="cashdrop" className="mt-4 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Log Safe Drop</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-3 items-end">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Amount (₹)</Label>
                  <Input placeholder="e.g. 5000" type="number" value={dropAmount} onChange={e => setDropAmount(e.target.value)} />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Staff Name</Label>
                  <Input placeholder="e.g. Anita Sharma" value={dropStaff} onChange={e => setDropStaff(e.target.value)} />
                </div>
                <Button size="sm" className="gap-1 mb-0.5" onClick={handleAddDrop}>
                  <Plus className="w-3.5 h-3.5" /> Add Drop
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Cash Drops This Shift</span>
                <span className="text-base font-bold text-blue-600">Total: ₹{totalCashDrops.toLocaleString()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cashDrops.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No cash drops logged yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-muted-foreground border-b">
                      <th className="text-left pb-2">Time</th>
                      <th className="text-left pb-2">Staff</th>
                      <th className="text-right pb-2">Amount</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashDrops.map(drop => (
                      <tr key={drop.id} className="border-b last:border-0">
                        <td className="py-2 text-muted-foreground">{drop.time}</td>
                        <td className="py-2">{drop.staff}</td>
                        <td className="py-2 text-right font-semibold text-blue-600">₹{parseFloat(drop.amount).toLocaleString()}</td>
                        <td className="py-2 text-right">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-400"
                            onClick={() => setCashDrops(prev => prev.filter(d => d.id !== drop.id))}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Petty Cash Tab */}
        <TabsContent value="pettycash" className="mt-4 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Log Petty Cash Expense</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="space-y-1">
                  <Label className="text-xs">Category</Label>
                  <Select value={pettyCategory} onValueChange={setPettyCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PETTY_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Amount (₹)</Label>
                  <Input placeholder="e.g. 150" type="number" value={pettyAmount} onChange={e => setPettyAmount(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Input placeholder="Brief description" value={pettyDesc} onChange={e => setPettyDesc(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Reference / Bill No.</Label>
                  <Input placeholder="Optional" value={pettyRef} onChange={e => setPettyRef(e.target.value)} />
                </div>
              </div>
              <Button size="sm" className="gap-1" onClick={handleAddPetty}>
                <Plus className="w-3.5 h-3.5" /> Add Expense
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Petty Cash Expenses Today</span>
                <span className="text-base font-bold text-red-600">Total: ₹{pettyTotal.toLocaleString()}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pettyEntries.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No petty cash expenses logged yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-muted-foreground border-b">
                      <th className="text-left pb-2">Time</th>
                      <th className="text-left pb-2">Category</th>
                      <th className="text-left pb-2">Description</th>
                      <th className="text-left pb-2">Ref</th>
                      <th className="text-right pb-2">Amount</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pettyEntries.map(e => (
                      <tr key={e.id} className="border-b last:border-0">
                        <td className="py-2 text-muted-foreground">{e.time}</td>
                        <td className="py-2"><Badge variant="outline" className="text-xs">{e.category}</Badge></td>
                        <td className="py-2">{e.description}</td>
                        <td className="py-2 text-muted-foreground text-xs">{e.reference || "—"}</td>
                        <td className="py-2 text-right font-semibold text-red-600">₹{parseFloat(e.amount).toLocaleString()}</td>
                        <td className="py-2 text-right">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-400"
                            onClick={() => setPettyEntries(prev => prev.filter(x => x.id !== e.id))}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Open Register Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Unlock className="w-4 h-4 text-green-600" /> Open Register — Float Entry</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Enter the opening float denomination-wise.</p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {DENOM_CONFIG.map(d => {
              const c = parseInt(floatCounts[d.note] || "0", 10);
              const tot = isNaN(c) ? 0 : c * d.value;
              return (
                <div key={d.note} className="grid grid-cols-3 items-center gap-3">
                  <Label className="font-semibold">{d.note}</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Count"
                    value={floatCounts[d.note]}
                    onChange={e => setFloatCounts(prev => ({ ...prev, [d.note]: e.target.value }))}
                  />
                  <span className="text-sm text-right text-green-600 font-medium">= ₹{tot.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-sm font-semibold">Opening Float Total</span>
            <span className="text-lg font-bold text-green-600">₹{floatTotal.toLocaleString()}</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleOpenRegister} className="gap-1"><Unlock className="w-3.5 h-3.5" /> Confirm & Open</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Register Dialog */}
      <Dialog open={closeDialog} onOpenChange={setCloseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Lock className="w-4 h-4 text-red-600" /> Close Register — Cash Count</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Count the cash in the drawer denomination-wise.</p>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {DENOM_CONFIG.map(d => {
              const c = parseInt(closeCounts[d.note] || "0", 10);
              const tot = isNaN(c) ? 0 : c * d.value;
              return (
                <div key={d.note} className="grid grid-cols-3 items-center gap-3">
                  <Label className="font-semibold">{d.note}</Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Count"
                    value={closeCounts[d.note]}
                    onChange={e => setCloseCounts(prev => ({ ...prev, [d.note]: e.target.value }))}
                  />
                  <span className="text-sm text-right text-blue-600 font-medium">= ₹{tot.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
          <div className="space-y-1 border-t pt-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Expected Cash (POS)</span><span className="font-semibold">₹{EXPECTED_CASH.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Actual Cash (Counted)</span><span className="font-semibold text-blue-600">₹{closeActual.toLocaleString()}</span></div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Variance</span>
              <span className={`font-bold ${variance === 0 ? "text-green-600" : variance > 0 ? "text-blue-600" : "text-red-600"}`}>
                {variance >= 0 ? "+" : ""}₹{variance.toLocaleString()}
              </span>
            </div>
          </div>
          {varianceWarning && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold">Variance exceeds ₹500 threshold</p>
                <p className="text-xs mt-0.5">Manager PIN is required to proceed.</p>
              </div>
            </div>
          )}
          {varianceWarning && (
            <div className="space-y-1">
              <Label className="text-xs">Manager PIN</Label>
              <Input type="password" placeholder="Enter manager PIN" value={managerPin} onChange={e => setManagerPin(e.target.value)} />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCloseDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleCloseRegister}
              disabled={varianceWarning && managerPin.trim() === ""}
              className="gap-1">
              <Lock className="w-3.5 h-3.5" /> Close & Generate Z Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Z Report Modal */}
      <Dialog open={zReportOpen} onOpenChange={setZReportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Printer className="w-4 h-4" /> Z Report — Day Close Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Sales Summary</p>
              <div className="space-y-1">
                <div className="flex justify-between"><span>Total Sales</span><span className="font-semibold text-green-600">₹27,580</span></div>
                <div className="flex justify-between"><span>Discounts Given</span><span className="font-semibold text-red-500">-₹1,200</span></div>
                <div className="flex justify-between"><span>Voids</span><span className="font-semibold text-red-500">-₹350</span></div>
                <div className="flex justify-between"><span>Tips Collected</span><span className="font-semibold text-blue-600">+₹680</span></div>
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Payment Mode Breakup</p>
              <div className="space-y-1">
                {PAYMENT_BREAKUP.map(p => (
                  <div key={p.mode} className="flex justify-between">
                    <span>{p.mode}</span>
                    <span className="font-semibold">₹{p.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Cash Reconciliation</p>
              <div className="space-y-1">
                <div className="flex justify-between"><span>Expected Cash</span><span className="font-semibold">₹{EXPECTED_CASH.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Actual Cash (Counted)</span><span className="font-semibold text-blue-600">₹{closeActual.toLocaleString()}</span></div>
                <div className="flex justify-between">
                  <span>Variance</span>
                  <span className={`font-bold ${variance === 0 ? "text-green-600" : "text-red-500"}`}>
                    {variance >= 0 ? "+" : ""}₹{variance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="border-t pt-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Cash Drops & Petty Cash</p>
              <div className="space-y-1">
                <div className="flex justify-between"><span>Total Cash Drops</span><span className="font-semibold text-blue-600">₹{totalCashDrops.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Petty Cash Expenses</span><span className="font-semibold text-red-500">₹{pettyTotal.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setZReportOpen(false)}>Close</Button>
            <Button className="gap-1"><Printer className="w-3.5 h-3.5" /> Print Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

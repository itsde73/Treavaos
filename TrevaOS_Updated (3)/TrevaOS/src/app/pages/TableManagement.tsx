import { useState } from "react";
import { Plus, Users, Clock, Wine, QrCode, Merge, GitMerge, Edit, Trash2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { useLocation } from "react-router";

// Areas/Sections — Bar is just another area like Terrace or Indoor
const areas = [
  { id: 1, name: "Indoor (Ground Floor)", type: "dining", tableCount: 4, smoking: false },
  { id: 2, name: "Indoor (First Floor)", type: "dining", tableCount: 4, smoking: false },
  { id: 3, name: "Terrace", type: "outdoor", tableCount: 4, smoking: true },
  { id: 4, name: "Bar Area", type: "bar", tableCount: 5, smoking: false },
  { id: 5, name: "Private Dining", type: "private", tableCount: 2, smoking: false },
  { id: 6, name: "Banquet Hall", type: "banquet", tableCount: 3, smoking: false },
];

const allTables = [
  // Ground Floor
  { id: 1,  number: 1,  seats: 4, status: "available", area: "Indoor (Ground Floor)", section: "dining" },
  { id: 2,  number: 2,  seats: 2, status: "occupied",  area: "Indoor (Ground Floor)", section: "dining", orderAmount: 850,  captain: "John" },
  { id: 3,  number: 3,  seats: 6, status: "reserved",  area: "Indoor (Ground Floor)", section: "dining", reservedFor: "Raj Kumar", reservedAt: "7:30 PM" },
  { id: 4,  number: 4,  seats: 4, status: "available", area: "Indoor (Ground Floor)", section: "dining" },
  // First Floor
  { id: 5,  number: 5,  seats: 8, status: "occupied",  area: "Indoor (First Floor)", section: "dining",  orderAmount: 2340, captain: "Sarah" },
  { id: 6,  number: 6,  seats: 2, status: "available", area: "Indoor (First Floor)", section: "dining" },
  { id: 7,  number: 7,  seats: 4, status: "occupied",  area: "Indoor (First Floor)", section: "dining",  orderAmount: 1100, captain: "John" },
  { id: 8,  number: 8,  seats: 6, status: "available", area: "Indoor (First Floor)", section: "dining" },
  // Terrace
  { id: 9,  number: 9,  seats: 4, status: "reserved",  area: "Terrace", section: "outdoor", reservedFor: "Sarah Smith", reservedAt: "8:00 PM" },
  { id: 10, number: 10, seats: 2, status: "available", area: "Terrace", section: "outdoor" },
  { id: 11, number: 11, seats: 6, status: "occupied",  area: "Terrace", section: "outdoor", orderAmount: 3200, captain: "Mike" },
  { id: 12, number: 12, seats: 8, status: "available", area: "Terrace", section: "outdoor" },
  // Bar Area — Bar seats/stools handled as tables; BOT goes to Bar KDS
  { id: 13, number: 1,  seats: 2, status: "occupied",  area: "Bar Area", section: "bar", orderAmount: 1020, captain: "Raj (Bartender)", label: "Bar 1" },
  { id: 14, number: 2,  seats: 2, status: "available", area: "Bar Area", section: "bar", label: "Bar 2" },
  { id: 15, number: 3,  seats: 2, status: "occupied",  area: "Bar Area", section: "bar", orderAmount: 780,  captain: "Raj (Bartender)", label: "Bar 3" },
  { id: 16, number: 4,  seats: 2, status: "available", area: "Bar Area", section: "bar", label: "Bar 4" },
  { id: 17, number: 5,  seats: 4, status: "occupied",  area: "Bar Area", section: "bar", orderAmount: 1380, captain: "Raj (Bartender)", label: "Bar 5" },
  // Private Dining
  { id: 18, number: 1,  seats: 10, status: "reserved", area: "Private Dining", section: "private", reservedFor: "Corporate Event", reservedAt: "8:00 PM", label: "PD 1" },
  { id: 19, number: 2,  seats: 8,  status: "available", area: "Private Dining", section: "private", label: "PD 2" },
  // Banquet
  { id: 20, number: 1,  seats: 50, status: "occupied",  area: "Banquet Hall", section: "banquet", orderAmount: 94500, captain: "Manager", label: "Banquet A" },
  { id: 21, number: 2,  seats: 30, status: "available", area: "Banquet Hall", section: "banquet", label: "Banquet B" },
  { id: 22, number: 3,  seats: 20, status: "available", area: "Banquet Hall", section: "banquet", label: "Banquet C" },
];

const statusColors: Record<string, string> = {
  available: "bg-green-100 text-green-800 border-green-300",
  occupied:  "bg-orange-100 text-orange-800 border-orange-300",
  reserved:  "bg-blue-100 text-blue-800 border-blue-300",
};
const statusBg: Record<string, string> = {
  available: "bg-green-50 hover:bg-green-100",
  occupied:  "bg-orange-50 hover:bg-orange-100",
  reserved:  "bg-blue-50 hover:bg-blue-100",
};

const areaTypeIcon: Record<string, string> = {
  dining: "🍽",
  outdoor: "🌿",
  bar: "🍸",
  private: "🎭",
  banquet: "🏛",
};
const areaTypeBadge: Record<string, string> = {
  dining: "bg-blue-50 text-blue-700 border-blue-200",
  outdoor: "bg-green-50 text-green-700 border-green-200",
  bar: "bg-purple-50 text-purple-700 border-purple-200",
  private: "bg-amber-50 text-amber-700 border-amber-200",
  banquet: "bg-slate-50 text-slate-700 border-slate-200",
};

function useReportTab() {
  const location = useLocation();
  if (location.pathname.includes("/areas")) return "areas";
  if (location.pathname.includes("/qr-codes")) return "qr";
  return "tables";
}

export function TableManagement() {
  const defaultTab = useReportTab();
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [selectedArea, setSelectedArea] = useState<string>("All");

  const displayedAreas = selectedArea === "All" ? areas.map(a => a.name) : [selectedArea];

  const totalTables = allTables.length;
  const availableCount = allTables.filter(t => t.status === "available").length;
  const occupiedCount  = allTables.filter(t => t.status === "occupied").length;
  const reservedCount  = allTables.filter(t => t.status === "reserved").length;
  const barOccupied    = allTables.filter(t => t.section === "bar" && t.status === "occupied").length;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Table Management</h1>
          <p className="text-muted-foreground mt-1">Monitor all sections — Dine-in · Bar · Terrace · Private · Banquet</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Floor Designer</Button>
          <Button size="sm" className="gap-2" onClick={() => setShowReservationModal(true)}>
            <Plus className="w-4 h-4" /> New Reservation
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total Tables", value: totalTables, color: "bg-slate-100 text-slate-800" },
          { label: "Available", value: availableCount, color: "bg-green-100 text-green-800" },
          { label: "Occupied", value: occupiedCount, color: "bg-orange-100 text-orange-800" },
          { label: "Reserved", value: reservedCount, color: "bg-blue-100 text-blue-800" },
          { label: "Bar Occupied", value: `${barOccupied}/5`, color: "bg-purple-100 text-purple-800" },
        ].map((s, i) => (
          <Card key={i} className="shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-0.5">{s.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${s.color}`}>
                {typeof s.value === "number" ? s.value : s.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue={defaultTab}>
        <TabsList>
          <TabsTrigger value="tables">Live Table Map</TabsTrigger>
          <TabsTrigger value="areas">Areas / Sections</TabsTrigger>
          <TabsTrigger value="qr">QR Codes</TabsTrigger>
        </TabsList>

        {/* ── LIVE TABLE MAP ── */}
        <TabsContent value="tables" className="space-y-5 mt-4">
          {/* Area filter pills */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedArea("All")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedArea === "All" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
              All Areas
            </button>
            {areas.map(a => (
              <button key={a.id} onClick={() => setSelectedArea(a.name)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors flex items-center gap-1.5 ${selectedArea === a.name ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}>
                <span>{areaTypeIcon[a.type]}</span> {a.name}
              </button>
            ))}
          </div>

          {displayedAreas.map(areaName => {
            const area = areas.find(a => a.name === areaName)!;
            const tables = allTables.filter(t => t.area === areaName);
            return (
              <Card key={areaName} className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{areaTypeIcon[area.type]}</span>
                      <span>{areaName}</span>
                      {area.type === "bar" && (
                        <Badge className="bg-purple-100 text-purple-700 text-xs gap-1">
                          <Wine className="w-3 h-3" /> BOT → Bar KDS
                        </Badge>
                      )}
                      {area.smoking && <Badge variant="outline" className="text-xs">🚬 Smoking</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-normal text-muted-foreground">
                      <span className="text-green-600">{tables.filter(t=>t.status==="available").length} free</span>
                      <span className="text-orange-600">{tables.filter(t=>t.status==="occupied").length} occupied</span>
                      <span className="text-blue-600">{tables.filter(t=>t.status==="reserved").length} reserved</span>
                    </div>
                  </CardTitle>
                  {area.type === "bar" && (
                    <p className="text-xs text-muted-foreground mt-1">
                      ℹ️ Bar area orders are routed as <strong>BOT (Bar Order Ticket)</strong> → Bar Printer / Bar KDS. Kitchen items from bar tables still go to Kitchen KOT.
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {tables.map(table => (
                      <div key={table.id}
                        className={`relative p-3 rounded-xl border-2 ${statusColors[table.status]} ${statusBg[table.status]} cursor-pointer transition-all hover:shadow-md`}
                        onClick={() => setSelectedTable(table)}>
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1">
                            {table.label || `T${table.number}`}
                          </div>
                          <div className="flex items-center justify-center gap-1 text-xs mb-2 text-muted-foreground">
                            <Users className="w-3 h-3" /> {table.seats} seats
                          </div>
                          <Badge variant="outline" className={`text-xs ${statusColors[table.status]}`}>
                            {table.status}
                          </Badge>
                          {table.status === "occupied" && table.orderAmount && (
                            <div className="mt-1.5 text-sm font-semibold">₹{table.orderAmount.toLocaleString()}</div>
                          )}
                          {table.status === "occupied" && table.captain && (
                            <div className="text-xs text-muted-foreground mt-0.5">{table.captain}</div>
                          )}
                          {table.status === "reserved" && table.reservedFor && (
                            <div className="text-xs text-muted-foreground mt-1 leading-tight">{table.reservedFor}<br/>{(table as any).reservedAt}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-green-200 border border-green-400" /> Available</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-orange-200 border border-orange-400" /> Occupied</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-200 border border-blue-400" /> Reserved</div>
            <div className="flex items-center gap-2"><Wine className="w-4 h-4 text-purple-600" /> Bar orders → BOT (Bar KDS)</div>
            <div className="flex items-center gap-2"><span>🔴</span> Kitchen items → KOT (Kitchen KDS)</div>
          </div>
        </TabsContent>

        {/* ── AREAS / SECTIONS MANAGEMENT ── */}
        <TabsContent value="areas" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Manage Areas & Sections</h2>
            <Button size="sm" className="gap-2" onClick={() => setShowAddAreaModal(true)}>
              <Plus className="w-4 h-4" /> Add Area
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.map(area => (
              <Card key={area.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{areaTypeIcon[area.type]}</span>
                      <div>
                        <p className="font-semibold text-sm">{area.name}</p>
                        <Badge variant="outline" className={`text-xs mt-0.5 ${areaTypeBadge[area.type]}`}>
                          {area.type}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0"><Edit className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex justify-between"><span>Tables</span><span className="font-medium text-foreground">{area.tableCount}</span></div>
                    <div className="flex justify-between"><span>Available</span><span className="font-medium text-green-600">{allTables.filter(t=>t.area===area.name&&t.status==="available").length}</span></div>
                    <div className="flex justify-between"><span>Occupied</span><span className="font-medium text-orange-600">{allTables.filter(t=>t.area===area.name&&t.status==="occupied").length}</span></div>
                    {area.type === "bar" && (
                      <div className="mt-2 p-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium">
                        🍸 Orders here → BOT → Bar KDS
                      </div>
                    )}
                    {area.smoking && (
                      <div className="mt-1 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs">
                        🚬 Smoking section
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── QR CODES ── */}
        <TabsContent value="qr" className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">QR Code Management</h2>
            <Button size="sm" className="gap-2"><QrCode className="w-4 h-4" /> Generate All QR Codes</Button>
          </div>
          <p className="text-sm text-muted-foreground">Each table has a unique QR code. Guest scans → Digital menu opens in browser → No app needed. Orders trigger captain notification and KOT/BOT routing.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allTables.slice(0, 12).map(table => (
              <Card key={table.id} className="shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="w-20 h-20 bg-muted rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-sm">{table.label || `Table ${table.number}`}</p>
                  <p className="text-xs text-muted-foreground">{table.area}</p>
                  {table.section === "bar" && (
                    <Badge className="bg-purple-100 text-purple-700 text-xs mt-1">Bar</Badge>
                  )}
                  <div className="flex gap-1 mt-3">
                    <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">Download</Button>
                    <Button size="sm" variant="outline" className="flex-1 h-7 text-xs">Print</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Table Detail Dialog */}
      <Dialog open={!!selectedTable} onOpenChange={() => setSelectedTable(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTable?.label || `Table ${selectedTable?.number}`} — {selectedTable?.area}</DialogTitle>
            <DialogDescription>Manage this table session</DialogDescription>
          </DialogHeader>
          {selectedTable && (
            <div className="space-y-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted"><p className="text-xs text-muted-foreground">Status</p><p className="font-semibold capitalize">{selectedTable.status}</p></div>
                <div className="p-3 rounded-lg bg-muted"><p className="text-xs text-muted-foreground">Seats</p><p className="font-semibold">{selectedTable.seats}</p></div>
                {selectedTable.orderAmount && <div className="p-3 rounded-lg bg-muted"><p className="text-xs text-muted-foreground">Bill Amount</p><p className="font-semibold">₹{selectedTable.orderAmount.toLocaleString()}</p></div>}
                {selectedTable.captain && <div className="p-3 rounded-lg bg-muted"><p className="text-xs text-muted-foreground">Captain</p><p className="font-semibold">{selectedTable.captain}</p></div>}
              </div>
              {selectedTable.section === "bar" && (
                <div className="p-3 rounded-lg border border-purple-200 bg-purple-50">
                  <p className="text-xs font-semibold text-purple-700">🍸 Bar Section</p>
                  <p className="text-xs text-purple-600 mt-1">All drink orders fire as BOT → Bar KDS. Food items (if any) route as KOT → Kitchen.</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="flex-1" variant="outline">View Order</Button>
                {selectedTable.status === "occupied" && <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">Print Bill</Button>}
                {selectedTable.status === "available" && <Button size="sm" className="flex-1">Seat Guest</Button>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Reservation Modal */}
      <Dialog open={showReservationModal} onOpenChange={setShowReservationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Reservation</DialogTitle>
            <DialogDescription>Create a new table reservation</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Customer Name</Label><Input placeholder="Enter name" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Phone Number</Label><Input placeholder="+91" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Date</Label><Input type="date" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Time</Label><Input type="time" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Guests</Label><Input type="number" defaultValue="2" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Section</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
                  <SelectContent>{areas.map(a => <SelectItem key={a.id} value={a.name}>{areaTypeIcon[a.type]} {a.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Occasion</Label>
              <Select><SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent><SelectItem value="birthday">🎂 Birthday</SelectItem><SelectItem value="anniversary">💍 Anniversary</SelectItem><SelectItem value="corporate">💼 Corporate</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg border">
              <Switch /><div><p className="text-sm font-medium">Smoking Preference</p><p className="text-xs text-muted-foreground">Reserve in smoking section if available</p></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReservationModal(false)}>Cancel</Button>
            <Button onClick={() => setShowReservationModal(false)}>Create Reservation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Area Modal */}
      <Dialog open={showAddAreaModal} onOpenChange={setShowAddAreaModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Area</DialogTitle><DialogDescription>Create a new seating section</DialogDescription></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label className="text-xs">Area Name</Label><Input placeholder="e.g., Rooftop, Garden, Bar Lounge" /></div>
            <div className="space-y-1.5"><Label className="text-xs">Area Type</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dining">🍽 Dining (Kitchen KOT)</SelectItem>
                  <SelectItem value="bar">🍸 Bar (BOT → Bar KDS)</SelectItem>
                  <SelectItem value="outdoor">🌿 Outdoor</SelectItem>
                  <SelectItem value="private">🎭 Private Dining</SelectItem>
                  <SelectItem value="banquet">🏛 Banquet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Number of Tables</Label><Input type="number" defaultValue="4" /></div>
            <div className="flex items-center gap-2"><Switch /><Label className="text-sm">Smoking Allowed</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAreaModal(false)}>Cancel</Button>
            <Button onClick={() => setShowAddAreaModal(false)}>Add Area</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

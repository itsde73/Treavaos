import { useState } from "react";
import { ChefHat, Clock, CheckCircle, AlertCircle, Flame, Settings, Wine, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

// Kitchen KOTs — food items → Kitchen KDS
const allKOTs = [
  { id: "KOT-0042", table: "Table 5",    section: "Indoor",  items: ["Margherita Pizza x2", "Caesar Salad x1"],         status: "in-progress", priority: false, time: "8 min",  station: "Main Kitchen",    waiter: "John" },
  { id: "KOT-0043", table: "Table 2",    section: "Indoor",  items: ["Chicken Tikka x2", "Dal Makhani x1", "Butter Naan x4"], status: "pending", priority: true, time: "2 min",  station: "Indian Section",  waiter: "Sarah" },
  { id: "KOT-0044", table: "Table 9",    section: "Terrace", items: ["Pasta Alfredo x1", "Garlic Bread x2"],             status: "pending",     priority: false, time: "1 min",  station: "Continental",     waiter: "Mike" },
  { id: "KOT-0041", table: "Table 7",    section: "Indoor",  items: ["Veg Biryani x3"],                                  status: "ready",       priority: false, time: "14 min", station: "Indian Section",  waiter: "John" },
  { id: "KOT-0040", table: "Online #892",section: "Online",  items: ["Burger x2", "Fries x2"],                          status: "in-progress", priority: false, time: "5 min",  station: "Fast Food",       waiter: "Auto" },
];

// Bar BOTs — drink items → Bar KDS
const allBOTs = [
  { id: "BOT-0018", table: "Bar 1",   section: "Bar Area", items: ["Old Fashioned x1", "Whisky On Rocks x1"],  status: "preparing", priority: false, time: "3 min",  bartender: "Raj",   drinkType: "cocktail" },
  { id: "BOT-0019", table: "Table 5", section: "Indoor",   items: ["Mojito x2", "Kingfisher x1"],              status: "preparing", priority: false, time: "1 min",  bartender: "Raj",   drinkType: "cocktail" },
  { id: "BOT-0017", table: "Bar 3",   section: "Bar Area", items: ["Rum & Coke x2"],                           status: "ready",     priority: false, time: "6 min",  bartender: "Raj",   drinkType: "spirits"  },
  { id: "BOT-0016", table: "Table 2", section: "Indoor",   items: ["Virgin Mojito x1", "Fresh Lime x2"],       status: "preparing", priority: true,  time: "8 min",  bartender: "Priya", drinkType: "mocktail" },
];

const kitchenStations = [
  { name: "Main Kitchen",    status: "active", chef: "Ravi Kumar",    activeKOTs: 3 },
  { name: "Indian Section",  status: "active", chef: "Suresh Yadav",  activeKOTs: 2 },
  { name: "Continental",     status: "active", chef: "Maria Jose",    activeKOTs: 1 },
  { name: "Fast Food / Grill",status:"active", chef: "Arun Patel",    activeKOTs: 2 },
  { name: "Dessert Station", status: "idle",   chef: "Preeti Sharma", activeKOTs: 0 },
];

const barStations = [
  { name: "Main Bar",       status: "active", bartender: "Raj Singh",   activeBOTs: 3 },
  { name: "Service Bar",    status: "active", bartender: "Priya Nair",  activeBOTs: 1 },
  { name: "Lounge Counter", status: "idle",   bartender: "Amit Sharma", activeBOTs: 0 },
];

const kotStyle: Record<string, { bg: string; text: string; border: string }> = {
  pending:      { bg: "bg-yellow-50",  text: "text-yellow-700",  border: "border-l-yellow-400" },
  "in-progress":{ bg: "bg-blue-50",    text: "text-blue-700",    border: "border-l-blue-400"   },
  ready:        { bg: "bg-green-50",   text: "text-green-700",   border: "border-l-green-400"  },
  preparing:    { bg: "bg-purple-50",  text: "text-purple-700",  border: "border-l-purple-400" },
};

function KOTCard({ item, type }: { item: any; type: "kot" | "bot" }) {
  const s = kotStyle[item.status] ?? kotStyle["pending"];
  const isBot = type === "bot";
  return (
    <Card className={`shadow-sm border-l-4 ${s.border}`}>
      <CardContent className="py-3 px-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`font-bold text-xs font-mono px-1.5 py-0.5 rounded ${isBot ? "bg-purple-100 text-purple-800" : "bg-orange-100 text-orange-800"}`}>
              {item.id}
            </span>
            {item.priority && <Flame className="w-3.5 h-3.5 text-red-500" />}
          </div>
          <Badge className={`text-xs capitalize ${s.bg} ${s.text}`}>{item.status}</Badge>
        </div>
        <div className="flex items-center justify-between mb-1">
          <p className="font-semibold text-sm">{item.table}</p>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{item.section}</span>
        </div>
        <ul className="space-y-0.5 mb-2">
          {item.items.map((it: string, i: number) => (
            <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0" />{it}
            </li>
          ))}
        </ul>
        {isBot && item.drinkType && (
          <p className="text-xs text-purple-600 mb-1">
            {item.drinkType === "cocktail" ? "🍹 Cocktail" : item.drinkType === "mocktail" ? "🥤 Mocktail" : "🥃 Spirits/Beer"}
          </p>
        )}
        <div className="mt-2 pt-2 border-t flex items-center justify-between">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />{item.time} ago · {isBot ? item.bartender : item.waiter}
          </span>
          <div className="flex gap-1">
            {item.status === "pending" && <Button size="sm" className="h-6 text-xs px-2">Start</Button>}
            {item.status === "in-progress" && <Button size="sm" className="h-6 text-xs px-2 gap-1 bg-blue-600 hover:bg-blue-700"><CheckCircle className="w-3 h-3" />Ready</Button>}
            {item.status === "preparing" && <Button size="sm" className="h-6 text-xs px-2 gap-1 bg-purple-600 hover:bg-purple-700"><CheckCircle className="w-3 h-3" />Ready</Button>}
            {item.status === "ready" && <Button size="sm" variant="outline" className="h-6 text-xs px-2 gap-1"><Bell className="w-3 h-3" />Dispatch</Button>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Kitchens() {
  const [activeKitchenStation, setActiveKitchenStation] = useState("All");
  const [activeBarStation, setActiveBarStation] = useState("All");

  const filteredKOTs = activeKitchenStation === "All" ? allKOTs : allKOTs.filter(k => k.station === activeKitchenStation);
  const filteredBOTs = activeBarStation === "All" ? allBOTs : allBOTs.filter(b => b.bartender === activeBarStation);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Kitchens & Bar</h1>
          <p className="text-muted-foreground text-sm mt-1">Live KOT display (Kitchen) · Live BOT display (Bar)</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5"><Settings className="w-3.5 h-3.5" />Settings</Button>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="shadow-sm border-l-4 border-l-orange-400">
          <CardContent className="py-3 px-4">
            <p className="text-xs text-muted-foreground">Kitchen KOTs</p>
            <p className="text-2xl font-bold text-orange-600">{allKOTs.length}</p>
            <p className="text-xs text-muted-foreground">{allKOTs.filter(k=>k.status==="ready").length} ready to dispatch</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-purple-400">
          <CardContent className="py-3 px-4">
            <p className="text-xs text-muted-foreground">Bar BOTs</p>
            <p className="text-2xl font-bold text-purple-600">{allBOTs.length}</p>
            <p className="text-xs text-muted-foreground">{allBOTs.filter(b=>b.status==="ready").length} ready to serve</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-yellow-400">
          <CardContent className="py-3 px-4">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{allKOTs.filter(k=>k.status==="pending").length + allBOTs.filter(b=>b.status==="preparing" && parseInt(b.time)>5).length}</p>
            <p className="text-xs text-muted-foreground">awaiting prep</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-red-400">
          <CardContent className="py-3 px-4">
            <p className="text-xs text-muted-foreground">Priority / VIP</p>
            <p className="text-2xl font-bold text-red-600">{[...allKOTs, ...allBOTs].filter((k:any)=>k.priority).length}</p>
            <p className="text-xs text-muted-foreground">rush orders</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="kitchen">
        <TabsList>
          <TabsTrigger value="kitchen" className="gap-2">
            <ChefHat className="w-4 h-4" />
            🔴 Kitchen KOT
            <span className="bg-orange-100 text-orange-700 text-xs px-1.5 py-0.5 rounded-full font-bold">{allKOTs.length}</span>
          </TabsTrigger>
          <TabsTrigger value="bar" className="gap-2">
            <Wine className="w-4 h-4" />
            🟣 Bar BOT
            <span className="bg-purple-100 text-purple-700 text-xs px-1.5 py-0.5 rounded-full font-bold">{allBOTs.length}</span>
          </TabsTrigger>
          <TabsTrigger value="stations">Stations</TabsTrigger>
        </TabsList>

        {/* ── KITCHEN KOT TAB ── */}
        <TabsContent value="kitchen" className="mt-4 space-y-4">
          {/* Kitchen station mini-cards */}
          <div className="grid grid-cols-5 gap-2">
            {kitchenStations.map(s => (
              <Card key={s.name} className={`shadow-sm cursor-pointer transition-all ${activeKitchenStation === s.name ? "ring-2 ring-orange-400" : ""}`}
                onClick={() => setActiveKitchenStation(activeKitchenStation === s.name ? "All" : s.name)}>
                <CardContent className="py-2 px-3">
                  <div className="flex items-center justify-between mb-1">
                    <ChefHat className="w-3.5 h-3.5 text-muted-foreground" />
                    <Badge className={`text-xs ${s.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{s.status}</Badge>
                  </div>
                  <p className="font-semibold text-xs">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.chef}</p>
                  <p className={`text-lg font-bold ${s.activeKOTs > 0 ? "text-orange-600" : "text-muted-foreground"}`}>{s.activeKOTs}</p>
                  <p className="text-xs text-muted-foreground">KOTs</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {["All", ...kitchenStations.map(s => s.name)].map(n => (
              <Button key={n} size="sm" variant={activeKitchenStation === n ? "default" : "outline"} className="text-xs h-7"
                onClick={() => setActiveKitchenStation(n)}>{n}</Button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredKOTs.map(k => <KOTCard key={k.id} item={k} type="kot" />)}
            {filteredKOTs.length === 0 && (
              <div className="col-span-4 text-center py-10 text-muted-foreground">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />
                <p>No KOTs for this station</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── BAR BOT TAB ── */}
        <TabsContent value="bar" className="mt-4 space-y-4">
          {/* Bar station mini-cards */}
          <div className="grid grid-cols-3 gap-3">
            {barStations.map(s => (
              <Card key={s.name} className={`shadow-sm cursor-pointer transition-all ${activeBarStation === s.name ? "ring-2 ring-purple-400" : ""}`}
                onClick={() => setActiveBarStation(activeBarStation === s.name ? "All" : s.name)}>
                <CardContent className="py-2 px-3">
                  <div className="flex items-center justify-between mb-1">
                    <Wine className="w-3.5 h-3.5 text-purple-500" />
                    <Badge className={`text-xs ${s.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{s.status}</Badge>
                  </div>
                  <p className="font-semibold text-xs">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.bartender}</p>
                  <p className={`text-lg font-bold ${s.activeBOTs > 0 ? "text-purple-600" : "text-muted-foreground"}`}>{s.activeBOTs}</p>
                  <p className="text-xs text-muted-foreground">BOTs</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-700">
            🟣 <strong>Bar BOT (Bar Order Ticket)</strong> — When an order contains bar/drink items, a separate BOT fires to the Bar KDS/Printer. Food items from the same table still go to Kitchen KOT separately. Bartender prepares the drink; Captain/Runner dispatches to table.
          </div>

          <div className="flex gap-2 flex-wrap">
            {["All", ...barStations.map(s => s.bartender)].map(n => (
              <Button key={n} size="sm" variant={activeBarStation === n ? "default" : "outline"} className="text-xs h-7"
                onClick={() => setActiveBarStation(n)}>{n}</Button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredBOTs.map(b => <KOTCard key={b.id} item={b} type="bot" />)}
            {filteredBOTs.length === 0 && (
              <div className="col-span-4 text-center py-10 text-muted-foreground">
                <CheckCircle className="w-10 h-10 mx-auto mb-2 text-green-400" />
                <p>No BOTs at this station</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── STATIONS TAB ── */}
        <TabsContent value="stations" className="mt-4 space-y-5">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2"><ChefHat className="w-4 h-4 text-orange-600" />Kitchen Stations</h3>
            <div className="space-y-2">
              {kitchenStations.map(s => (
                <div key={s.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${s.status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
                    <div>
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground">Chef: {s.chef}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-orange-600">{s.activeKOTs}</p>
                      <p className="text-xs text-muted-foreground">active KOTs</p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">{s.status}</Badge>
                    <Button size="sm" variant="outline" className="h-7 text-xs">Configure</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Wine className="w-4 h-4 text-purple-600" />Bar Stations</h3>
            <div className="space-y-2">
              {barStations.map(s => (
                <div key={s.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${s.status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
                    <div>
                      <p className="font-medium text-sm">{s.name}</p>
                      <p className="text-xs text-muted-foreground">Bartender: {s.bartender}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-purple-600">{s.activeBOTs}</p>
                      <p className="text-xs text-muted-foreground">active BOTs</p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">{s.status}</Badge>
                    <Button size="sm" variant="outline" className="h-7 text-xs">Configure</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

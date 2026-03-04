import { useState } from "react";
import { Plus, Edit, Trash2, Copy, Search, ChefHat, Wine, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Switch } from "../components/ui/switch";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";

// KOT routing: "kitchen" → 🔴 KOT to Kitchen KDS, "bar" → 🟣 BOT to Bar KDS, "both" → fires to both
const menuItems = [
  { id: 1,  name: "Chicken Tikka",       category: "Starters",     price: 299, cost: 120, available: true,  veg: false, kotRoute: "kitchen", image: "" },
  { id: 2,  name: "Paneer Tikka",        category: "Starters",     price: 249, cost: 90,  available: true,  veg: true,  kotRoute: "kitchen", image: "" },
  { id: 3,  name: "Caesar Salad",        category: "Starters",     price: 179, cost: 60,  available: true,  veg: true,  kotRoute: "kitchen", image: "" },
  { id: 4,  name: "Dal Makhani",         category: "Main Course",  price: 279, cost: 80,  available: true,  veg: true,  kotRoute: "kitchen", image: "" },
  { id: 5,  name: "Butter Chicken",      category: "Main Course",  price: 359, cost: 130, available: true,  veg: false, kotRoute: "kitchen", image: "" },
  { id: 6,  name: "Pasta Alfredo",       category: "Main Course",  price: 329, cost: 110, available: true,  veg: true,  kotRoute: "kitchen", image: "" },
  { id: 7,  name: "Veg Biryani",         category: "Main Course",  price: 289, cost: 100, available: true,  veg: true,  kotRoute: "kitchen", image: "" },
  { id: 8,  name: "Chocolate Cake",      category: "Desserts",     price: 199, cost: 70,  available: true,  veg: true,  kotRoute: "kitchen", image: "" },
  // Bar items → BOT → Bar KDS
  { id: 9,  name: "Old Fashioned",       category: "Cocktails",    price: 490, cost: 180, available: true,  veg: true,  kotRoute: "bar",     image: "" },
  { id: 10, name: "Mojito",              category: "Cocktails",    price: 350, cost: 120, available: true,  veg: true,  kotRoute: "bar",     image: "" },
  { id: 11, name: "Whisky On The Rocks", category: "Spirits",      price: 420, cost: 200, available: true,  veg: true,  kotRoute: "bar",     image: "" },
  { id: 12, name: "Kingfisher Beer",     category: "Beer",         price: 180, cost: 80,  available: true,  veg: true,  kotRoute: "bar",     image: "" },
  { id: 13, name: "Virgin Mojito",       category: "Mocktails",    price: 180, cost: 50,  available: true,  veg: true,  kotRoute: "bar",     image: "" },
  { id: 14, name: "Fresh Lime Soda",     category: "Mocktails",    price: 120, cost: 30,  available: true,  veg: true,  kotRoute: "bar",     image: "" },
  // Items that fire to both
  { id: 15, name: "Bar Platter",         category: "Starters",     price: 699, cost: 250, available: true,  veg: false, kotRoute: "both",    image: "" },
];

const categories = [
  { id: 1,  name: "Starters",     items: 4,  active: true,  kotRoute: "kitchen", menuType: "food" },
  { id: 2,  name: "Main Course",  items: 4,  active: true,  kotRoute: "kitchen", menuType: "food" },
  { id: 3,  name: "Desserts",     items: 2,  active: true,  kotRoute: "kitchen", menuType: "food" },
  { id: 4,  name: "Cocktails",    items: 2,  active: true,  kotRoute: "bar",     menuType: "bar"  },
  { id: 5,  name: "Spirits",      items: 1,  active: true,  kotRoute: "bar",     menuType: "bar"  },
  { id: 6,  name: "Beer",         items: 1,  active: true,  kotRoute: "bar",     menuType: "bar"  },
  { id: 7,  name: "Mocktails",    items: 2,  active: true,  kotRoute: "bar",     menuType: "bar"  },
  { id: 8,  name: "Soups",        items: 6,  active: true,  kotRoute: "kitchen", menuType: "food" },
];

const kotRouteConfig = {
  kitchen: { label: "🔴 Kitchen KOT", bg: "bg-orange-50 text-orange-700 border-orange-200", icon: ChefHat },
  bar:     { label: "🟣 Bar BOT",     bg: "bg-purple-50 text-purple-700 border-purple-200", icon: Wine },
  both:    { label: "🔴+🟣 Both",     bg: "bg-blue-50 text-blue-700 border-blue-200",   icon: ChefHat },
};

export function MenuManagement() {
  const [search, setSearch] = useState("");
  const [routeFilter, setRouteFilter] = useState("all");
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const filtered = menuItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
    const matchRoute = routeFilter === "all" || item.kotRoute === routeFilter;
    return matchSearch && matchRoute;
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Menu Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage items, categories, pricing and KOT routing</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Import Menu</Button>
          <Button size="sm" className="gap-2" onClick={() => setShowAddItem(true)}>
            <Plus className="w-4 h-4" /> Add Item
          </Button>
        </div>
      </div>

      {/* KOT Routing legend */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-orange-700 text-xs font-medium">
          <ChefHat className="w-3.5 h-3.5" /> 🔴 KOT → Kitchen KDS — food items
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-purple-200 bg-purple-50 text-purple-700 text-xs font-medium">
          <Wine className="w-3.5 h-3.5" /> 🟣 BOT → Bar KDS — drinks &amp; cocktails
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium">
          🔴+🟣 Both — fires to Kitchen AND Bar
        </div>
      </div>

      <Tabs defaultValue="items">
        <TabsList>
          <TabsTrigger value="items">Menu Items ({menuItems.length})</TabsTrigger>
          <TabsTrigger value="categories">Categories ({categories.length})</TabsTrigger>
          <TabsTrigger value="modifiers">Modifiers</TabsTrigger>
          <TabsTrigger value="combos">Combos & Offers</TabsTrigger>
        </TabsList>

        {/* ── MENU ITEMS TAB ── */}
        <TabsContent value="items" className="space-y-4 mt-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search items..." className="pl-9 h-9" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={routeFilter} onValueChange={setRouteFilter}>
              <SelectTrigger className="w-44 h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                <SelectItem value="kitchen">🔴 Kitchen only</SelectItem>
                <SelectItem value="bar">🟣 Bar only</SelectItem>
                <SelectItem value="both">🔴+🟣 Both</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9 gap-1.5"><Filter className="w-4 h-4" />Filter</Button>
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>KOT Route</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Margin</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(item => {
                    const margin = (((item.price - item.cost) / item.price) * 100).toFixed(0);
                    const route = kotRouteConfig[item.kotRoute as keyof typeof kotRouteConfig];
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-base">
                            {item.kotRoute === "bar" ? "🍸" : "🍽"}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.category}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {item.veg ? "🟢 Veg" : "🔴 Non-veg"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${route.bg}`}>
                            {route.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">₹{item.price}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">₹{item.cost}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">{margin}%</Badge>
                        </TableCell>
                        <TableCell><Switch checked={item.available} /></TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── CATEGORIES TAB ── */}
        <TabsContent value="categories" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Categories control KOT routing for all items within them. Individual items can override.</p>
            <Button size="sm" className="gap-2" onClick={() => setShowAddCategory(true)}><Plus className="w-4 h-4" />Add Category</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map(cat => {
              const route = kotRouteConfig[cat.kotRoute as keyof typeof kotRouteConfig];
              return (
                <Card key={cat.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm">{cat.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{cat.items} items</p>
                      </div>
                      <Switch checked={cat.active} />
                    </div>
                    <Badge variant="outline" className={`text-xs mb-3 ${route.bg}`}>{route.label}</Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 h-7 text-xs"><Edit className="w-3 h-3 mr-1" />Edit</Button>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0"><Trash2 className="w-3 h-3 text-destructive" /></Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* ── MODIFIERS ── */}
        <TabsContent value="modifiers" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Modifiers & Add-ons</CardTitle>
                <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" />Add Modifier Group</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Spice Level", options: ["Mild", "Medium", "Hot", "Extra Hot"], required: true },
                  { name: "Size",        options: ["Small", "Medium", "Large"],           required: false },
                  { name: "Add-ons",     options: ["Extra Cheese +₹30", "Extra Sauce +₹20", "Garlic Bread +₹60"], required: false },
                  { name: "Remove",      options: ["No Onion", "No Garlic", "No Nuts"],   required: false },
                ].map(mod => (
                  <div key={mod.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{mod.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{mod.options.join(" · ")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {mod.required && <Badge className="text-xs bg-red-50 text-red-700">Required</Badge>}
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── COMBOS ── */}
        <TabsContent value="combos" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Combos & Offers</CardTitle>
                <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" />Add Combo</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Happy Hour Bar Special",    items: "Any 2 cocktails",         price: 699,  originalPrice: 840,  type: "bar"     },
                  { name: "Weekend Dinner Combo",      items: "Starter + Main + Dessert", price: 599,  originalPrice: 727,  type: "kitchen" },
                  { name: "Bar Bites Combo",           items: "Bar Platter + 2 Beers",   price: 799,  originalPrice: 879,  type: "both"    },
                ].map(combo => (
                  <div key={combo.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{combo.name}</p>
                        <Badge variant="outline" className={`text-xs ${kotRouteConfig[combo.type as keyof typeof kotRouteConfig].bg}`}>
                          {kotRouteConfig[combo.type as keyof typeof kotRouteConfig].label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{combo.items}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-sm">₹{combo.price}</p>
                        <p className="text-xs text-muted-foreground line-through">₹{combo.originalPrice}</p>
                      </div>
                      <Switch defaultChecked />
                      <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Item Dialog */}
      <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
            <DialogDescription>Create a new item and set its KOT routing</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2"><Label className="text-xs">Item Name *</Label><Input placeholder="e.g. Chicken Lollipop" /></div>
              <div className="space-y-1.5">
                <Label className="text-xs">Category *</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Type</Label>
                <Select defaultValue="nonveg"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="veg">🟢 Veg</SelectItem><SelectItem value="nonveg">🔴 Non-veg</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Selling Price (₹) *</Label><Input type="number" placeholder="0.00" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Cost Price (₹)</Label><Input type="number" placeholder="0.00" /></div>
            </div>

            {/* KOT Routing — KEY FIELD */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">KOT Routing *</Label>
              <p className="text-xs text-muted-foreground">Where does the order ticket go when this item is ordered?</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "kitchen", label: "🔴 Kitchen KOT", desc: "Goes to Kitchen KDS/Printer", color: "border-orange-300 bg-orange-50" },
                  { value: "bar",     label: "🟣 Bar BOT",     desc: "Goes to Bar KDS/Printer",     color: "border-purple-300 bg-purple-50" },
                  { value: "both",    label: "🔴+🟣 Both",     desc: "Fires to both Kitchen & Bar",  color: "border-blue-300 bg-blue-50"    },
                ].map(opt => (
                  <label key={opt.value} className={`border-2 rounded-lg p-2.5 cursor-pointer text-center ${opt.color}`}>
                    <input type="radio" name="kotRoute" value={opt.value} className="sr-only" defaultChecked={opt.value === "kitchen"} />
                    <p className="font-semibold text-xs">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5"><Label className="text-xs">Description</Label><Input placeholder="Optional item description" /></div>
            <div className="flex items-center gap-2"><Switch defaultChecked /><Label className="text-sm">Available for ordering</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddItem(false)}>Cancel</Button>
            <Button onClick={() => setShowAddItem(false)}>Save Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Categories set default KOT routing for all items within them</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label className="text-xs">Category Name *</Label><Input placeholder="e.g. Cocktails, Soups, Grills" /></div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Default KOT Route for this Category</Label>
              <Select defaultValue="kitchen">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kitchen">🔴 Kitchen KOT — food items</SelectItem>
                  <SelectItem value="bar">🟣 Bar BOT — drinks & beverages</SelectItem>
                  <SelectItem value="both">🔴+🟣 Both — fires to Kitchen & Bar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label className="text-xs">Display Order</Label><Input type="number" defaultValue="1" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCategory(false)}>Cancel</Button>
            <Button onClick={() => setShowAddCategory(false)}>Save Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import { Plus, Edit, Trash2, Copy, Search, ChefHat, Wine, Filter, LayoutGrid, List } from "lucide-react";
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
import { Checkbox } from "../components/ui/checkbox";

const ALLERGEN_OPTIONS = ["Gluten", "Nuts", "Dairy", "Eggs", "Shellfish", "Soy", "Sesame", "Mustard"];

const DIETARY_OPTIONS = [
  { value: "Vegetarian",     label: "Vegetarian 🟢" },
  { value: "Non-Vegetarian", label: "Non-Vegetarian 🔴" },
  { value: "Egg",            label: "Egg 🟡" },
  { value: "Vegan",          label: "Vegan" },
  { value: "Jain",           label: "Jain" },
  { value: "Halal",          label: "Halal" },
  { value: "Keto",           label: "Keto" },
  { value: "Gluten-Free",    label: "Gluten-Free" },
];

const AVAILABILITY_OPTIONS = [
  "All day",
  "Breakfast only",
  "Lunch only",
  "Dinner only",
  "Seasonal",
];

// KOT routing: "kitchen" -> KOT to Kitchen KDS, "bar" -> BOT to Bar KDS, "both" -> fires to both
const menuItems = [
  { id: 1,  name: "Chicken Tikka",       category: "Starters",     price: 299, cost: 120, available: true,  veg: false, kotRoute: "kitchen", image: "", allergens: ["Nuts"],                    dietaryTags: ["Non-Vegetarian"],            availability: "All day",     calories: 320 },
  { id: 2,  name: "Paneer Tikka",        category: "Starters",     price: 249, cost: 90,  available: true,  veg: true,  kotRoute: "kitchen", image: "", allergens: ["Dairy"],                   dietaryTags: ["Vegetarian"],                availability: "All day",     calories: 280 },
  { id: 3,  name: "Caesar Salad",        category: "Starters",     price: 179, cost: 60,  available: true,  veg: true,  kotRoute: "kitchen", image: "", allergens: ["Dairy", "Eggs"],            dietaryTags: ["Vegetarian"],                availability: "Lunch only",  calories: 150 },
  { id: 4,  name: "Dal Makhani",         category: "Main Course",  price: 279, cost: 80,  available: true,  veg: true,  kotRoute: "kitchen", image: "", allergens: ["Dairy"],                   dietaryTags: ["Vegetarian"],                availability: "All day",     calories: 380 },
  { id: 5,  name: "Butter Chicken",      category: "Main Course",  price: 359, cost: 130, available: true,  veg: false, kotRoute: "kitchen", image: "", allergens: ["Dairy"],                   dietaryTags: ["Non-Vegetarian", "Halal"],   availability: "All day",     calories: 450 },
  { id: 6,  name: "Pasta Alfredo",       category: "Main Course",  price: 329, cost: 110, available: true,  veg: true,  kotRoute: "kitchen", image: "", allergens: ["Gluten", "Dairy"],          dietaryTags: ["Vegetarian"],                availability: "All day",     calories: 520 },
  { id: 7,  name: "Veg Biryani",         category: "Main Course",  price: 289, cost: 100, available: true,  veg: true,  kotRoute: "kitchen", image: "", allergens: [],                          dietaryTags: ["Vegetarian", "Jain"],        availability: "All day",     calories: 410 },
  { id: 8,  name: "Chocolate Cake",      category: "Desserts",     price: 199, cost: 70,  available: true,  veg: true,  kotRoute: "kitchen", image: "", allergens: ["Gluten", "Dairy", "Eggs"], dietaryTags: ["Vegetarian"],                availability: "All day",     calories: 380 },
  { id: 9,  name: "Old Fashioned",       category: "Cocktails",    price: 490, cost: 180, available: true,  veg: true,  kotRoute: "bar",     image: "", allergens: [],                          dietaryTags: ["Vegan"],                     availability: "Dinner only", calories: 180 },
  { id: 10, name: "Mojito",              category: "Cocktails",    price: 350, cost: 120, available: true,  veg: true,  kotRoute: "bar",     image: "", allergens: [],                          dietaryTags: ["Vegan"],                     availability: "All day",     calories: 120 },
  { id: 11, name: "Whisky On The Rocks", category: "Spirits",      price: 420, cost: 200, available: true,  veg: true,  kotRoute: "bar",     image: "", allergens: [],                          dietaryTags: [],                            availability: "All day",     calories: 105 },
  { id: 12, name: "Kingfisher Beer",     category: "Beer",         price: 180, cost: 80,  available: true,  veg: true,  kotRoute: "bar",     image: "", allergens: ["Gluten"],                  dietaryTags: [],                            availability: "All day",     calories: 150 },
  { id: 13, name: "Virgin Mojito",       category: "Mocktails",    price: 180, cost: 50,  available: true,  veg: true,  kotRoute: "bar",     image: "", allergens: [],                          dietaryTags: ["Vegan"],                     availability: "All day",     calories: 90  },
  { id: 14, name: "Fresh Lime Soda",     category: "Mocktails",    price: 120, cost: 30,  available: true,  veg: true,  kotRoute: "bar",     image: "", allergens: [],                          dietaryTags: ["Vegan"],                     availability: "All day",     calories: 40  },
  { id: 15, name: "Bar Platter",         category: "Starters",     price: 699, cost: 250, available: true,  veg: false, kotRoute: "both",    image: "", allergens: ["Nuts", "Shellfish"],        dietaryTags: ["Non-Vegetarian"],            availability: "Dinner only", calories: 680 },
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

function dietaryIcon(tags: string[]) {
  if (tags.includes("Vegetarian") || tags.includes("Vegan") || tags.includes("Jain")) return "🟢";
  if (tags.includes("Egg")) return "🟡";
  if (tags.includes("Non-Vegetarian")) return "🔴";
  return null;
}

const defaultForm = {
  name: "",
  category: "",
  type: "nonveg",
  price: "",
  cost: "",
  kotRoute: "kitchen",
  description: "",
  available: true,
  allergens: [] as string[],
  dietaryTags: [] as string[],
  availability: "All day",
  calories: "",
};

export function MenuManagement() {
  const [search, setSearch] = useState("");
  const [routeFilter, setRouteFilter] = useState("all");
  const [showAddItem, setShowAddItem] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [form, setForm] = useState(defaultForm);

  const filtered = menuItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
    const matchRoute = routeFilter === "all" || item.kotRoute === routeFilter;
    return matchSearch && matchRoute;
  });

  function toggleAllergen(val: string) {
    setForm(f => ({
      ...f,
      allergens: f.allergens.includes(val) ? f.allergens.filter(a => a !== val) : [...f.allergens, val],
    }));
  }

  function toggleDietary(val: string) {
    setForm(f => ({
      ...f,
      dietaryTags: f.dietaryTags.includes(val) ? f.dietaryTags.filter(d => d !== val) : [...f.dietaryTags, val],
    }));
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Menu Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage items, categories, pricing and KOT routing</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Import Menu</Button>
          <Button size="sm" className="gap-2" onClick={() => { setForm(defaultForm); setShowAddItem(true); }}>
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
          <TabsTrigger value="combos">Combos &amp; Offers</TabsTrigger>
        </TabsList>

        {/* MENU ITEMS TAB */}
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
            <div className="flex border rounded-md overflow-hidden h-9">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-full px-2.5"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="rounded-none h-full px-2.5"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* LIST VIEW */}
          {viewMode === "list" && (
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
                      <TableHead>Availability</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(item => {
                      const margin = (((item.price - item.cost) / item.price) * 100).toFixed(0);
                      const route = kotRouteConfig[item.kotRoute as keyof typeof kotRouteConfig];
                      const icon = dietaryIcon(item.dietaryTags);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-base">
                              {item.kotRoute === "bar" ? "🍸" : "🍽"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{item.name}</p>
                            {item.allergens.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.allergens.map(a => (
                                  <span key={a} className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                                    ⚠ {a}
                                  </span>
                                ))}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.category}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {icon} {item.dietaryTags[0] ?? (item.veg ? "Veg" : "Non-veg")}
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
                          <TableCell className="text-xs text-muted-foreground">{item.availability}</TableCell>
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
          )}

          {/* GRID VIEW */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(item => {
                const route = kotRouteConfig[item.kotRoute as keyof typeof kotRouteConfig];
                const icon = dietaryIcon(item.dietaryTags);
                return (
                  <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            {icon && <span className="text-sm">{icon}</span>}
                            <p className="font-semibold text-sm truncate">{item.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                        </div>
                        <Switch checked={item.available} />
                      </div>

                      {/* Allergen badges */}
                      {item.allergens.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.allergens.map(a => (
                            <span key={a} className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-red-50 text-red-700 border border-red-200">
                              ⚠ {a}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Dietary tags */}
                      {item.dietaryTags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.dietaryTags.map(d => (
                            <Badge key={d} variant="secondary" className="text-[10px] px-1.5 py-0">{d}</Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className={`text-[10px] ${route.bg}`}>{route.label}</Badge>
                        <span className="text-[10px] text-muted-foreground">{item.availability}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t">
                        <span className="font-bold text-sm">₹{item.price}</span>
                        {item.calories != null && (
                          <span className="text-[10px] text-muted-foreground">{item.calories} kcal</span>
                        )}
                      </div>

                      <div className="flex gap-1 pt-0.5">
                        <Button variant="outline" size="sm" className="flex-1 h-7 text-xs gap-1"><Edit className="w-3 h-3" />Edit</Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* CATEGORIES TAB */}
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

        {/* MODIFIERS */}
        <TabsContent value="modifiers" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Modifiers &amp; Add-ons</CardTitle>
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

        {/* COMBOS */}
        <TabsContent value="combos" className="mt-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Combos &amp; Offers</CardTitle>
                <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" />Add Combo</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Happy Hour Bar Special",  items: "Any 2 cocktails",          price: 699, originalPrice: 840, type: "bar"     },
                  { name: "Weekend Dinner Combo",    items: "Starter + Main + Dessert",  price: 599, originalPrice: 727, type: "kitchen" },
                  { name: "Bar Bites Combo",         items: "Bar Platter + 2 Beers",    price: 799, originalPrice: 879, type: "both"    },
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

      {/* Add / Edit Item Dialog */}
      <Dialog open={showAddItem} onOpenChange={setShowAddItem}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
            <DialogDescription>Create a new item and set its KOT routing, allergens, and dietary info</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {/* Basic info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs">Item Name *</Label>
                <Input placeholder="e.g. Chicken Lollipop" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Category *</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Input placeholder="Optional item description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Selling Price (₹) *</Label>
                <Input type="number" placeholder="0.00" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Cost Price (₹)</Label>
                <Input type="number" placeholder="0.00" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Calories (kcal) <span className="text-muted-foreground font-normal">optional</span></Label>
                <Input type="number" placeholder="e.g. 350" value={form.calories} onChange={e => setForm(f => ({ ...f, calories: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Time-based Availability</Label>
                <Select value={form.availability} onValueChange={v => setForm(f => ({ ...f, availability: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {AVAILABILITY_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* KOT Routing */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">KOT Routing *</Label>
              <p className="text-xs text-muted-foreground">Where does the order ticket go when this item is ordered?</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "kitchen", label: "🔴 Kitchen KOT", desc: "Goes to Kitchen KDS/Printer", color: "border-orange-300 bg-orange-50" },
                  { value: "bar",     label: "🟣 Bar BOT",     desc: "Goes to Bar KDS/Printer",     color: "border-purple-300 bg-purple-50" },
                  { value: "both",    label: "🔴+🟣 Both",     desc: "Fires to both Kitchen & Bar",  color: "border-blue-300 bg-blue-50"    },
                ].map(opt => (
                  <label key={opt.value} className={`border-2 rounded-lg p-2.5 cursor-pointer text-center transition-opacity ${opt.color} ${form.kotRoute === opt.value ? "opacity-100 ring-2 ring-offset-1 ring-current" : "opacity-70"}`}>
                    <input type="radio" name="kotRoute" value={opt.value} className="sr-only" checked={form.kotRoute === opt.value} onChange={() => setForm(f => ({ ...f, kotRoute: opt.value }))} />
                    <p className="font-semibold text-xs">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Dietary Tags */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Dietary Tags</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DIETARY_OPTIONS.map(opt => (
                  <label key={opt.value} className={`flex items-center gap-2 border rounded-lg px-2.5 py-2 cursor-pointer text-xs transition-colors ${form.dietaryTags.includes(opt.value) ? "bg-green-50 border-green-400 text-green-800" : "border-border"}`}>
                    <Checkbox
                      checked={form.dietaryTags.includes(opt.value)}
                      onCheckedChange={() => toggleDietary(opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Allergen Tags */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Allergens <span className="text-muted-foreground font-normal">(select all that apply)</span></Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {ALLERGEN_OPTIONS.map(a => (
                  <label key={a} className={`flex items-center gap-2 border rounded-lg px-2.5 py-2 cursor-pointer text-xs transition-colors ${form.allergens.includes(a) ? "bg-red-50 border-red-400 text-red-800" : "border-border"}`}>
                    <Checkbox
                      checked={form.allergens.includes(a)}
                      onCheckedChange={() => toggleAllergen(a)}
                    />
                    ⚠ {a}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={form.available} onCheckedChange={v => setForm(f => ({ ...f, available: v }))} />
              <Label className="text-sm">Available for ordering</Label>
            </div>
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
                  <SelectItem value="bar">🟣 Bar BOT — drinks &amp; beverages</SelectItem>
                  <SelectItem value="both">🔴+🟣 Both — fires to Kitchen &amp; Bar</SelectItem>
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

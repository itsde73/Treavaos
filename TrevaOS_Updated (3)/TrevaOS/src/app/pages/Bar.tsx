import { useState, useRef, useEffect } from "react";
import {
  Wine, MessageSquare, Send, Bot, ShoppingCart, Clock, Users,
  TrendingUp, DollarSign, Package, AlertTriangle, Plus, Minus, X,
  ChevronRight, Star, Sparkles, RefreshCw, Beer, Coffee, Martini,
  GlassWater, Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import {
  BarChart, Bar as RechartsBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend,
} from "recharts";

const barMenu = [
  { id: 1, name: "Old Fashioned", category: "Cocktails", price: 420, available: true, popular: true },
  { id: 2, name: "Mojito", category: "Cocktails", price: 380, available: true, popular: true },
  { id: 3, name: "Negroni", category: "Cocktails", price: 450, available: true, popular: false },
  { id: 4, name: "Margarita", category: "Cocktails", price: 390, available: true, popular: true },
  { id: 5, name: "Whisky Sour", category: "Cocktails", price: 440, available: false, popular: false },
  { id: 6, name: "Kingfisher Premium", category: "Beer", price: 180, available: true, popular: true },
  { id: 7, name: "Heineken", category: "Beer", price: 220, available: true, popular: false },
  { id: 8, name: "Corona Extra", category: "Beer", price: 250, available: true, popular: false },
  { id: 9, name: "Jack Daniel's (60ml)", category: "Spirits", price: 380, available: true, popular: true },
  { id: 10, name: "Johnnie Walker Black (60ml)", category: "Spirits", price: 490, available: true, popular: false },
  { id: 11, name: "Absolut Vodka (60ml)", category: "Spirits", price: 340, available: true, popular: false },
  { id: 12, name: "Gin & Tonic", category: "Cocktails", price: 360, available: true, popular: false },
  { id: 13, name: "Espresso Martini", category: "Cocktails", price: 470, available: true, popular: true },
  { id: 14, name: "Virgin Mojito", category: "Mocktails", price: 180, available: true, popular: false },
  { id: 15, name: "Lemonade", category: "Mocktails", price: 120, available: true, popular: false },
];

const barOrders = [
  { id: "B001", table: "Bar 3", items: "Old Fashioned x2, Beer x1", total: 1020, status: "preparing", time: "14:32" },
  { id: "B002", table: "Bar 1", items: "Mojito x1, Negroni x1", total: 830, status: "ready", time: "14:28" },
  { id: "B003", table: "Table 8", items: "Kingfisher x3, Margarita x2", total: 1320, status: "served", time: "14:15" },
  { id: "B004", table: "Bar 5", items: "Whisky Sour x1, Espresso Martini x2", total: 1380, status: "preparing", time: "14:35" },
];

const barInventory = [
  { item: "Whisky (Jack Daniel's)", current: 3, unit: "bottles", status: "low" },
  { item: "Rum (Old Monk)", current: 1, unit: "bottles", status: "critical" },
  { item: "Vodka (Absolut)", current: 5, unit: "bottles", status: "ok" },
  { item: "Beer (Kingfisher)", current: 12, unit: "cans", status: "ok" },
  { item: "Fresh Mint", current: 0.2, unit: "kg", status: "critical" },
  { item: "Lime Juice", current: 1.5, unit: "L", status: "low" },
];

const hourlyBarData = [
  { hour: "6PM", revenue: 4200, orders: 11 },
  { hour: "7PM", revenue: 7800, orders: 18 },
  { hour: "8PM", revenue: 12400, orders: 28 },
  { hour: "9PM", revenue: 18600, orders: 42 },
  { hour: "10PM", revenue: 16200, orders: 37 },
  { hour: "11PM", revenue: 9800, orders: 22 },
  { hour: "12AM", revenue: 5400, orders: 12 },
];

const topBarItems = [
  { name: "Old Fashioned", sold: 48, revenue: 20160 },
  { name: "Kingfisher Premium", sold: 72, revenue: 12960 },
  { name: "Mojito", sold: 39, revenue: 14820 },
  { name: "Espresso Martini", sold: 31, revenue: 14570 },
  { name: "Jack Daniel's (60ml)", sold: 27, revenue: 10260 },
];

type Message = { role: "user" | "assistant"; text: string };

const suggestedQuestions = [
  "What's our best selling cocktail today?",
  "Which items are running low in stock?",
  "What's today's bar revenue?",
  "Suggest cocktails we can make with current stock",
];

export function Bar() {
  const [cart, setCart] = useState<{ item: typeof barMenu[0]; qty: number }[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello! I'm your Bar AI Assistant 🍹 I can help you with cocktail recommendations, stock alerts, sales insights, and more. What can I help you with today?" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const categories = ["All", ...Array.from(new Set(barMenu.map(i => i.category)))];

  const filteredMenu = activeCategory === "All"
    ? barMenu
    : barMenu.filter(i => i.category === activeCategory);

  const addToCart = (item: typeof barMenu[0]) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) return prev.map(c => c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { item, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(c => c.item.id === id);
      if (existing && existing.qty > 1) return prev.map(c => c.item.id === id ? { ...c, qty: c.qty - 1 } : c);
      return prev.filter(c => c.item.id !== id);
    });
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0);

  const sendMessage = async (text?: string) => {
    const userMsg = text || inputText;
    if (!userMsg.trim()) return;
    setInputText("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const context = `You are a smart Bar AI Assistant for TrevaOS restaurant management software. You have access to the following live data:

BAR MENU: ${barMenu.map(i => `${i.name} (${i.category}) - ₹${i.price}, ${i.available ? "Available" : "Unavailable"}${i.popular ? ", Popular" : ""}`).join("; ")}

INVENTORY ALERTS: ${barInventory.map(i => `${i.item}: ${i.current} ${i.unit} (${i.status})`).join("; ")}

TODAY'S BAR STATS: Revenue: ₹74,400. Orders: 170. Active orders: ${barOrders.filter(o => o.status !== "served").length}. Top selling: Old Fashioned (48 sold), Kingfisher Premium (72 sold), Mojito (39 sold).

ACTIVE ORDERS: ${barOrders.map(o => `${o.id}: ${o.items} - ${o.status}`).join("; ")}

Respond concisely and helpfully. Use emojis sparingly. Format numbers with ₹ for currency. If asked about cocktails you can make, check inventory and suggest based on available stock. Keep responses under 150 words unless a detailed breakdown is requested.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: context,
          messages: [
            ...messages.filter(m => m.role !== "assistant" || messages.indexOf(m) > 0).map(m => ({
              role: m.role,
              content: m.text,
            })),
            { role: "user", content: userMsg },
          ],
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't process that request.";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const statusColor = (s: string) => {
    if (s === "preparing") return "bg-amber-100 text-amber-800";
    if (s === "ready") return "bg-green-100 text-green-800";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-2">
            <Wine className="w-7 h-7 text-purple-600" /> Bar Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage bar orders, drinks menu, and inventory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Print Bar KOT</Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">+ New Order</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: "₹74,400", sub: "+18% vs yesterday", icon: DollarSign, color: "text-purple-600" },
          { label: "Total Orders", value: "170", sub: "12 active now", icon: ShoppingCart, color: "text-blue-600" },
          { label: "Active Bar Seats", value: "8 / 12", sub: "67% occupancy", icon: Users, color: "text-green-600" },
          { label: "Avg Drink Value", value: "₹438", sub: "+₹32 vs yesterday", icon: TrendingUp, color: "text-amber-600" },
        ].map((stat, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Active Orders</TabsTrigger>
          <TabsTrigger value="menu">Bar Menu & POS</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" /> AI Assistant
          </TabsTrigger>
        </TabsList>

        {/* Active Orders Tab */}
        <TabsContent value="orders">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" /> Live Bar Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {barOrders.map(order => (
                  <div key={order.id} className="border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{order.table}</p>
                        <p className="text-xs text-muted-foreground">#{order.id} · {order.time}</p>
                      </div>
                      <Badge className={statusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.items}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">₹{order.total.toLocaleString()}</span>
                      <div className="flex gap-2">
                        {order.status === "preparing" && (
                          <Button size="sm" variant="outline" className="text-green-700 border-green-300 h-7 text-xs">
                            Mark Ready
                          </Button>
                        )}
                        {order.status === "ready" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 h-7 text-xs">
                            Serve
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-7 text-xs">Bill</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bar Menu & POS Tab */}
        <TabsContent value="menu">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-2 flex-wrap">
                    {categories.map(cat => (
                      <Button key={cat} size="sm" variant={activeCategory === cat ? "default" : "outline"}
                        onClick={() => setActiveCategory(cat)} className="h-8 text-xs">
                        {cat}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredMenu.map(item => (
                      <div key={item.id}
                        className={`p-3 rounded-xl border flex items-center justify-between ${!item.available ? "opacity-50" : "hover:border-purple-300 cursor-pointer"}`}>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium">{item.name}</p>
                            {item.popular && <Star className="w-3 h-3 fill-amber-400 text-amber-400" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                          <p className="text-sm font-semibold text-purple-600 mt-0.5">₹{item.price}</p>
                        </div>
                        <Button size="sm" disabled={!item.available}
                          onClick={() => addToCart(item)}
                          className="h-8 w-8 p-0 rounded-full bg-purple-600 hover:bg-purple-700">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cart */}
            <div>
              <Card className="shadow-sm sticky top-4">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Order Cart
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cart.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No items added yet</p>
                  ) : (
                    <>
                      {cart.map(c => (
                        <div key={c.item.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{c.item.name}</p>
                            <p className="text-xs text-muted-foreground">₹{c.item.price} × {c.qty}</p>
                          </div>
                          <div className="flex items-center gap-1.5 ml-2">
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0"
                              onClick={() => removeFromCart(c.item.id)}><Minus className="w-3 h-3" /></Button>
                            <span className="text-sm font-medium w-4 text-center">{c.qty}</span>
                            <Button size="sm" variant="outline" className="h-6 w-6 p-0"
                              onClick={() => addToCart(c.item)}><Plus className="w-3 h-3" /></Button>
                          </div>
                          <p className="text-sm font-semibold ml-3 w-16 text-right">₹{(c.item.price * c.qty).toLocaleString()}</p>
                        </div>
                      ))}
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span className="text-purple-600">₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700" size="sm">
                          Place Bar Order
                        </Button>
                        <Button variant="ghost" className="w-full mt-1 text-xs h-7"
                          onClick={() => setCart([])}>Clear Cart</Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" /> Bar Inventory Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {barInventory.map((inv, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">{inv.item}</p>
                      <p className="text-xs text-muted-foreground">{inv.current} {inv.unit} remaining</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={inv.status === "critical" ? "destructive" : inv.status === "low" ? "secondary" : "outline"}>
                        {inv.status === "critical" ? "⚠ Critical" : inv.status === "low" ? "Low Stock" : "In Stock"}
                      </Badge>
                      <Button size="sm" variant="outline" className="h-7 text-xs">Reorder</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">View Full Bar Inventory</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader><CardTitle>Hourly Bar Revenue</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={hourlyBarData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="hour" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px" }} />
                    <RechartsBar dataKey="revenue" fill="#9333ea" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader><CardTitle>Top Selling Drinks</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topBarItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.sold} served</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold">₹{item.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Assistant Tab */}
        <TabsContent value="ai">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-sm h-[580px] flex flex-col">
                <CardHeader className="border-b pb-4 flex-shrink-0">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    Bar AI Assistant
                    <Badge className="bg-purple-100 text-purple-700 ml-auto text-xs">Powered by Claude</Badge>
                  </CardTitle>
                </CardHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                          <Bot className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === "user"
                        ? "bg-purple-600 text-white rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center mr-2 flex-shrink-0">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="border-t p-4 flex gap-2 flex-shrink-0">
                  <Input
                    placeholder="Ask about cocktails, stock, sales..."
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={() => sendMessage()} disabled={isLoading || !inputText.trim()}
                    className="bg-purple-600 hover:bg-purple-700">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="shadow-sm">
                <CardHeader><CardTitle className="text-sm">Quick Questions</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {suggestedQuestions.map((q, i) => (
                    <button key={i} onClick={() => sendMessage(q)}
                      className="w-full text-left text-sm p-3 rounded-lg border hover:border-purple-400 hover:bg-purple-50 transition-colors flex items-center justify-between group">
                      <span className="text-muted-foreground group-hover:text-foreground">{q}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader><CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Stock Alerts
                </CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {barInventory.filter(i => i.status !== "ok").map((inv, i) => (
                    <div key={i} className={`p-2.5 rounded-lg text-xs flex items-center justify-between ${inv.status === "critical" ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-800"}`}>
                      <span>{inv.item}</span>
                      <span className="font-semibold">{inv.current} {inv.unit}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

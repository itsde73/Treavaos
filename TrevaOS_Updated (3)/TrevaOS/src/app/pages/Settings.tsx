import { useState } from "react";
import { Store, Printer, CreditCard, Shield, Globe, Clock, MapPin, DollarSign, Mail, Percent, Palette, Truck, ChefHat, XCircle, ShoppingBag, RotateCcw, Sparkles, Type, Monitor, Gift, Layout, Webhook, Receipt, Smartphone, Edit, Trash2, Plus, CheckCircle, Wine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";

const allTabs = [
  { value: "general",       label: "General",             icon: Store },
  { value: "app",           label: "App",                 icon: Smartphone },
  { value: "shifts",        label: "Operational Shifts",  icon: Clock },
  { value: "branch",        label: "Branch",              icon: MapPin },
  { value: "currencies",    label: "Currencies",          icon: DollarSign },
  { value: "email",         label: "Email",               icon: Mail },
  { value: "taxes",         label: "Taxes",               icon: Percent },
  { value: "payment",       label: "Payment",             icon: CreditCard },
  { value: "theme",         label: "Theme",               icon: Palette },
  { value: "roles",         label: "Roles",               icon: Shield },
  { value: "billing",       label: "Billing",             icon: Receipt },
  { value: "reservation",   label: "Reservation",         icon: ShoppingBag },
  { value: "customer-site", label: "Customer Site",       icon: Globe },
  { value: "receipt",       label: "Receipt",             icon: Receipt },
  { value: "printer",       label: "Printer",             icon: Printer },
  { value: "delivery",      label: "Delivery",            icon: Truck },
  { value: "kot",           label: "KOT",                 icon: ChefHat },
  { value: "cancellation",  label: "Cancellation Reasons",icon: XCircle },
  { value: "order",         label: "Order",               icon: ShoppingBag },
  { value: "refund",        label: "Refund Reasons",      icon: RotateCcw },
  { value: "ai",            label: "AI",                  icon: Sparkles },
  { value: "font",          label: "Font Control",        icon: Type },
  { value: "kiosk",         label: "Kiosk",               icon: Monitor },
  { value: "loyalty",       label: "Loyalty Program",     icon: Gift },
  { value: "multipos",      label: "MultiPOS Settings",   icon: Layout },
  { value: "webhooks",      label: "Webhooks",            icon: Webhook },
];

function ToggleRow({ label, description, defaultChecked = true }: { label: string; description: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border">
      <div><p className="font-medium text-sm">{label}</p><p className="text-xs text-muted-foreground">{description}</p></div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function CheckRow({ label, description, defaultChecked = true }: { label: string; description: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/30">
      <input type="checkbox" defaultChecked={defaultChecked} className="mt-0.5 w-4 h-4 accent-primary" />
      <div><p className="font-medium text-sm">{label}</p><p className="text-xs text-muted-foreground">{description}</p></div>
    </label>
  );
}

export function Settings() {
  const [cancelReasons, setCancelReasons] = useState([
    { id: 1, reason: "Customer changed mind", types: ["POS", "Online"] },
    { id: 2, reason: "Item not available",    types: ["POS", "Online", "QR"] },
    { id: 3, reason: "Duplicate order",       types: ["POS"] },
  ]);
  const [refundReasons, setRefundReasons] = useState([
    { id: 1, reason: "Wrong item delivered" },
    { id: 2, reason: "Quality issue" },
    { id: 3, reason: "Customer dissatisfied" },
  ]);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your restaurant configuration</p>
        </div>
        <Button>Save Changes</Button>
      </div>

      <Tabs defaultValue="general" className="space-y-5">
        <div className="overflow-x-auto">
          <TabsList className="flex h-auto flex-wrap gap-1 bg-muted p-1 w-auto min-w-max">
            {allTabs.map(t => (
              <TabsTrigger key={t.value} value={t.value} className="text-xs px-3 py-1.5 h-auto">{t.label}</TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* ── GENERAL ── */}
        <TabsContent value="general" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Store className="w-4 h-4" />Outlet Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-xs">Restaurant Name</Label><Input defaultValue="TrevaOS Demo Restaurant" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Contact Number</Label><Input defaultValue="+91 98765 43210" /></div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Address</Label><Input defaultValue="123 Main Street, Bengaluru, Karnataka - 560001" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input type="email" defaultValue="info@restaurant.com" /></div>
                <div className="space-y-1.5"><Label className="text-xs">GST Number</Label><Input defaultValue="29XXXXX1234X1XX" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-xs">FSSAI Number</Label><Input defaultValue="10012345678901" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Timezone</Label>
                  <Select defaultValue="ist"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="ist">Asia/Kolkata (IST)</SelectItem><SelectItem value="utc">UTC</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Operating Hours</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {["Monday–Friday", "Saturday", "Sunday"].map(d => (
                <div key={d} className="grid grid-cols-3 gap-4 items-center">
                  <Label className="text-sm font-medium">{d}</Label>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Opens</Label><Input type="time" defaultValue="10:00" className="h-8" /></div>
                  <div className="space-y-1"><Label className="text-xs text-muted-foreground">Closes</Label><Input type="time" defaultValue="23:00" className="h-8" /></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── APP ── */}
        <TabsContent value="app" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">App Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow label="Enable QR Ordering" description="Allow guests to self-order via QR code on table" />
              <ToggleRow label="Captain Approval for QR Orders" description="Captain must approve QR orders before KOT/BOT fires" />
              <ToggleRow label="Show Item Images" description="Display food & drink images on QR menu and POS" />
              <ToggleRow label="Show Allergen Information" description="Display allergen tags on menu items" defaultChecked={false} />
              <ToggleRow label="Multi-language Menu" description="Allow menu in regional languages" defaultChecked={false} />
              <ToggleRow label="Guest Feedback Collection" description="Prompt guests for feedback after bill settlement" />
              <ToggleRow label="Loyalty Points on QR Menu" description="Show loyalty points balance on QR menu page" />
              <ToggleRow label="Upsell Banners" description="Show chef recommendations/upsell banners on QR menu" defaultChecked={false} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── OPERATIONAL SHIFTS ── */}
        <TabsContent value="shifts" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm flex items-center justify-between"><span>Operational Shifts</span><Button size="sm" variant="outline" className="h-7 text-xs">+ Add Shift</Button></CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Morning Shift",   start: "06:00", end: "14:00" },
                { name: "Afternoon Shift", start: "14:00", end: "22:00" },
                { name: "Night Shift",     start: "22:00", end: "06:00" },
              ].map(shift => (
                <div key={shift.name} className="grid grid-cols-4 gap-4 items-center p-3 border rounded-lg">
                  <Input defaultValue={shift.name} className="h-8 text-sm" />
                  <div className="space-y-1"><Label className="text-xs">Start</Label><Input type="time" defaultValue={shift.start} className="h-8" /></div>
                  <div className="space-y-1"><Label className="text-xs">End</Label><Input type="time" defaultValue={shift.end} className="h-8" /></div>
                  <Switch defaultChecked />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── BRANCH ── */}
        <TabsContent value="branch" className="space-y-4">
          <div className="flex justify-end"><Button size="sm">Add Branch</Button></div>
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="text-left p-3 text-xs text-muted-foreground font-medium">BRANCH NAME</th><th className="text-left p-3 text-xs text-muted-foreground font-medium">BRANCH ADDRESS</th><th className="text-right p-3 text-xs text-muted-foreground font-medium">ACTION</th></tr></thead>
                <tbody>
                  <tr className="border-b hover:bg-muted/30">
                    <td className="p-3 font-medium">Hyd – Demo</td>
                    <td className="p-3 text-muted-foreground">hyd - demo</td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Edit className="w-3 h-3" />Update</Button>
                      <span className="text-xs text-muted-foreground ml-2">Cannot delete current branch.</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── CURRENCIES ── */}
        <TabsContent value="currencies" className="space-y-4">
          <div className="flex justify-end"><Button size="sm">Add Currency</Button></div>
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="text-left p-3 text-xs text-muted-foreground font-medium">CURRENCY</th><th className="text-left p-3 text-xs text-muted-foreground font-medium">SYMBOL</th><th className="text-left p-3 text-xs text-muted-foreground font-medium">FORMAT (SAMPLE: 12345.6789)</th><th className="text-right p-3 text-xs text-muted-foreground font-medium">ACTION</th></tr></thead>
                <tbody>
                  {[
                    { name: "Dollars", sym: "USD ($)", fmt: "$12,345.68", canDelete: true },
                    { name: "Rupee",   sym: "INR (₹)", fmt: "₹12,345.68", canDelete: false },
                    { name: "Pounds",  sym: "GBP (£)", fmt: "£12,345.68", canDelete: true },
                    { name: "Euros",   sym: "EUR (€)", fmt: "€12,345.68", canDelete: true },
                  ].map(c => (
                    <tr key={c.name} className="border-b hover:bg-muted/30">
                      <td className="p-3 font-medium">{c.name}</td>
                      <td className="p-3 text-muted-foreground">{c.sym}</td>
                      <td className="p-3 font-mono text-sm">{c.fmt}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Edit className="w-3 h-3" />Update</Button>
                          {c.canDelete ? <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-destructive"><Trash2 className="w-3 h-3" /></Button>
                            : <span className="text-xs text-muted-foreground">Cannot Delete Default Currency.</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── EMAIL ── */}
        <TabsContent value="email" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Notification Settings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow label="New Order Received" description="Restaurant admin will receive an email when a new order is placed by the customer." />
              <ToggleRow label="Reservation Confirmation" description="Customer will receive an email after making the reservation." />
              <ToggleRow label="New Reservation Received" description="Restaurant admin will receive an email when a new reservation is made by the customer." />
              <ToggleRow label="Order Bill" description="Customer will receive the order bill via email." />
              <ToggleRow label="Staff Welcome Email" description="Staff member will receive a welcome email when you add a new staff member." />
              <ToggleRow label="Low Stock Alert" description="Admin receives email when inventory item falls below reorder level." defaultChecked={false} />
              <ToggleRow label="BOT Delay Alert" description="Bar manager receives email when a BOT is delayed beyond target time." defaultChecked={false} />
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">SMTP Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">SMTP Host</Label><Input placeholder="smtp.gmail.com" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Port</Label><Input defaultValue="587" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Username</Label><Input placeholder="your@email.com" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Password</Label><Input type="password" /></div>
              </div>
              <Button size="sm" variant="outline">Test SMTP Connection</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── TAXES ── */}
        <TabsContent value="taxes" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Tax Mode</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="border-2 border-primary rounded-lg p-4 cursor-pointer bg-primary/5">
                  <div className="flex items-center gap-2 mb-1"><input type="radio" name="taxMode" defaultChecked className="accent-primary" /><span className="font-semibold text-sm">Order-Level Tax</span></div>
                  <p className="text-xs text-muted-foreground">Apply tax on the total order amount.</p>
                </label>
                <label className="border rounded-lg p-4 cursor-pointer hover:bg-muted/30">
                  <div className="flex items-center gap-2 mb-1"><input type="radio" name="taxMode" className="accent-primary" /><span className="font-semibold text-sm">Item-Level Tax</span></div>
                  <p className="text-xs text-muted-foreground">Apply different tax rates to each item.</p>
                </label>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Tax Calculation Base</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">Choose how taxes should be calculated — with or without service charges included.</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                  <input type="radio" name="taxBase" className="accent-primary" />
                  <div><p className="text-sm font-medium">Include service charges in tax calculation</p></div>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                  <input type="radio" name="taxBase" defaultChecked className="accent-primary" />
                  <div><p className="text-sm font-medium">Exclude service charges from tax calculation</p></div>
                </label>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm flex items-center justify-between"><span>All Taxes</span><Button size="sm" className="h-7 text-xs">+ Add Tax</Button></CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "CGST", rate: "2.5%", applies: "All food items" },
                { label: "SGST", rate: "2.5%", applies: "All food items" },
                { label: "Bar GST (CGST)", rate: "9%",   applies: "Beverages / Bar items" },
                { label: "Bar GST (SGST)", rate: "9%",   applies: "Beverages / Bar items" },
                { label: "Service Charge", rate: "5%",   applies: "All orders" },
              ].map(t => (
                <div key={t.label} className="flex items-center justify-between p-3 border rounded-lg">
                  <div><p className="font-medium text-sm">{t.label}</p><p className="text-xs text-muted-foreground">{t.applies}</p></div>
                  <div className="flex items-center gap-2"><span className="font-bold text-sm">{t.rate}</span><Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Edit className="w-3 h-3" />Edit</Button></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── PAYMENT ── */}
        <TabsContent value="payment" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Payment</CardTitle><p className="text-xs text-muted-foreground">Enter payment gateway credentials to receive order payments.</p></CardHeader>
            <CardContent>
              <Tabs defaultValue="razorpay">
                <TabsList className="flex flex-wrap h-auto gap-1">
                  {["Razorpay", "Mollie", "Tap", "Offline Payment", "QR Code Payment", "General Settings"].map(g => (
                    <TabsTrigger key={g} value={g.toLowerCase().replace(/ /g,"-")} className="text-xs h-7 flex items-center gap-1.5">
                      {g}
                      <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="razorpay" className="mt-4 space-y-3">
                  <CheckRow label="Enable Razorpay" description="Accept online payments via Razorpay" defaultChecked={false} />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><Label className="text-xs">Key ID</Label><Input type="password" placeholder="rzp_live_..." /></div>
                    <div className="space-y-1.5"><Label className="text-xs">Key Secret</Label><Input type="password" placeholder="Key Secret" /></div>
                  </div>
                  <Button size="sm">Save</Button>
                </TabsContent>
                <TabsContent value="offline-payment" className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Configure offline payment methods accepted at the counter.</p>
                  <ToggleRow label="Cash" description="Accept cash payments" />
                  <ToggleRow label="Card / POS Terminal" description="Accept debit/credit card via POS machine" />
                  <ToggleRow label="UPI" description="Accept UPI QR / VPA payments" />
                  <ToggleRow label="Bank Transfer / NEFT" description="Accept bank transfers for large orders" defaultChecked={false} />
                </TabsContent>
                <TabsContent value="general-settings" className="mt-4 space-y-3">
                  <ToggleRow label="Split Bill" description="Allow splitting bills among guests" />
                  <ToggleRow label="Loyalty Points Redemption" description="Allow guests to pay using loyalty points" />
                  <ToggleRow label="Tip Collection" description="Allow adding tip at time of payment" />
                  <ToggleRow label="Round Off Amount" description="Round off total bill to nearest rupee" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── THEME ── */}
        <TabsContent value="theme" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Theme</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4">
                <Label className="text-sm font-medium">Logo</Label>
                <p className="text-xs text-muted-foreground mb-3">Upload a logo for your restaurant.</p>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30"><Store className="w-8 h-8 text-muted-foreground" /></div>
                  <div><Button variant="outline" size="sm">Upload Logo</Button><p className="text-xs text-muted-foreground mt-2">JPEG, PNG, SVG, WEBP. Max 1MB. Recommended: 97×96px</p></div>
                </div>
              </div>
              <ToggleRow label="Show Restaurant Name with Logo" description="Show restaurant name next to the logo in the sidebar" />
              <div className="border rounded-lg p-4">
                <Label className="text-sm font-medium">Primary Color</Label>
                <div className="flex gap-3 mt-3">
                  {["#2563EB","#10b981","#f59e0b","#8b5cf6","#ef4444","#0f172a"].map(c => (
                    <div key={c} className="w-8 h-8 rounded-full cursor-pointer ring-2 ring-offset-2 ring-transparent hover:ring-gray-400" style={{background:c}} />
                  ))}
                </div>
              </div>
              <ToggleRow label="Dark Mode by Default" description="Start the app in dark mode" defaultChecked={false} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── ROLES ── */}
        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-end"><Button size="sm">Manage Role</Button></div>
          <Card className="shadow-sm">
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left p-3 text-xs text-muted-foreground font-medium w-48">USER PERMISSION</th>
                    <th className="text-center p-3 text-xs font-medium">ROLE: BRANCH HEAD</th>
                    <th className="text-center p-3 text-xs font-medium">ROLE: WAITER</th>
                    <th className="text-center p-3 text-xs font-medium">ROLE: CHEF</th>
                    <th className="text-center p-3 text-xs font-medium">ROLE: WAITER1</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { section: "MENU", perms: ["Create Menu","Show Menu","Update Menu","Delete Menu"] },
                    { section: "MENU ITEM", perms: ["Create Menu Item","Show Menu Item","Update Menu Item","Delete Menu Item"] },
                    { section: "ORDER", perms: ["Create Order","View Orders","Cancel Order","Print KOT"] },
                    { section: "BAR", perms: ["Fire BOT","View Bar KDS","Mark BOT Ready","Dispatch from Bar"] },
                    { section: "TABLE", perms: ["Assign Table","Release Table","Merge Tables","Transfer Table"] },
                    { section: "REPORTS", perms: ["View Sales Report","View KOT Report","View Bar Report","Export Reports"] },
                  ].map(group => (
                    <>
                      <tr key={group.section} className="border-b bg-muted/20">
                        <td colSpan={5} className="p-2 px-3 text-xs font-bold text-muted-foreground tracking-wider">{group.section}</td>
                      </tr>
                      {group.perms.map((perm, i) => (
                        <tr key={perm} className="border-b hover:bg-muted/20">
                          <td className="p-3 text-sm">{perm}</td>
                          {[true, i>1, i>2, i>1].map((has, ci) => (
                            <td key={ci} className="text-center p-3">
                              <button className={`w-7 h-7 rounded font-bold text-sm border transition-colors ${has ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"}`}>
                                {has ? "−" : "+"}
                              </button>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── BILLING ── */}
        <TabsContent value="billing" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Plan Details</CardTitle></CardHeader>
            <CardContent>
              <Tabs defaultValue="plan">
                <TabsList><TabsTrigger value="plan">Plan Details</TabsTrigger><TabsTrigger value="history">Purchase History</TabsTrigger><TabsTrigger value="offline">Offline Request</TabsTrigger></TabsList>
                <TabsContent value="plan" className="mt-4 space-y-4">
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center gap-2"><Gift className="w-5 h-5 text-primary" /><h3 className="font-semibold">Plan Details</h3></div>
                    <div className="grid grid-cols-2 gap-6">
                      <div><p className="text-xs text-muted-foreground">Current Plan Name</p><p className="font-bold text-lg mt-1">Trial Package</p></div>
                      <div><p className="text-xs text-muted-foreground">Current Plan Type</p><p className="font-bold text-lg mt-1">Trial (Trial)</p></div>
                      <div><p className="text-xs text-muted-foreground">License Expire On</p><p className="font-bold mt-1">01/04/2026 <span className="text-sm font-normal text-muted-foreground">(29 Days Left)</span></p></div>
                      <div><p className="text-xs text-muted-foreground">Additional Features</p><div className="mt-1 space-y-1"><div className="flex items-center gap-1.5 text-sm"><CheckCircle className="w-4 h-4 text-green-500" />Change Branch</div></div></div>
                    </div>
                    <Button className="mt-2">Upgrade Plan</Button>
                  </div>
                </TabsContent>
                <TabsContent value="history" className="mt-4"><p className="text-sm text-muted-foreground text-center py-8">No purchase history found.</p></TabsContent>
                <TabsContent value="offline" className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Request an offline license for restricted environments.</p>
                  <div className="space-y-1.5"><Label className="text-xs">Machine ID</Label><Input placeholder="Auto-detected machine ID" /></div>
                  <Button size="sm">Submit Offline Request</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── RESERVATION ── */}
        <TabsContent value="reservation" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">General Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <h4 className="font-semibold text-sm">Reservation Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <CheckRow label="Enable Admin Reservations" description="Allow staff to create reservations through the admin panel" />
                <CheckRow label="Enable Customer Reservations" description="Allow customers to make reservations through the customer site" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div><p className="font-medium text-sm">Minimum Party Size</p><p className="text-xs text-muted-foreground">Set the minimum number of guests required for a reservation</p></div>
                    <Input defaultValue="1" className="w-20 h-8 text-center" />
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div><p className="font-medium text-sm">Disable Slot Minutes</p><p className="text-xs text-muted-foreground">How many minutes before a time slot that bookings should be disabled. This only applies to reservations for today.</p></div>
                    <div className="flex items-center gap-1"><Input defaultValue="30" className="w-16 h-8 text-center" /><span className="text-xs text-muted-foreground">Minutes</span></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end"><Button size="sm">Save</Button></div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Time Slots Settings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5"><Label className="text-xs">Slot Duration (minutes)</Label><Input defaultValue="30" /></div>
                <div className="space-y-1.5"><Label className="text-xs">First Slot</Label><Input type="time" defaultValue="12:00" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Last Slot</Label><Input type="time" defaultValue="22:30" /></div>
              </div>
              <ToggleRow label="15-min Grace Window" description="Tables held for 15 mins after reservation time before being released to waitlist" />
              <ToggleRow label="Auto-load Guest Preferences" description="For returning guests, auto-fill section & smoking preference from profile" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── CUSTOMER SITE ── */}
        <TabsContent value="customer-site" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Customer Site Settings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow label="Enable Customer Site" description="Allow customers to access your restaurant's public ordering site" />
              <ToggleRow label="Enable Online Ordering" description="Accept food orders via customer site" />
              <ToggleRow label="Enable Table Reservations" description="Allow customers to book tables online" />
              <ToggleRow label="Enable Loyalty Sign-up" description="Let customers join your loyalty program from the site" />
              <div className="space-y-1.5"><Label className="text-xs">Customer Site URL</Label><Input defaultValue="https://your-restaurant.queaze.com" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Custom Domain</Label><Input placeholder="orders.yourrestaurant.com" /></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── RECEIPT ── */}
        <TabsContent value="receipt" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Receipt Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow label="Print Logo on Receipt" description="Show your restaurant logo on printed bills" />
              <ToggleRow label="Print GST Breakdown" description="Show CGST + SGST split on bill" />
              <ToggleRow label="Print QR Code on Receipt" description="Add a QR code on bill for digital feedback / loyalty" defaultChecked={false} />
              <ToggleRow label="Show Loyalty Points on Receipt" description="Print remaining loyalty points balance on bill" />
              <ToggleRow label="Print Thank You Message" description="Add custom footer message on receipt" />
              <div className="space-y-1.5"><Label className="text-xs">Footer Message</Label><Input defaultValue="Thank you for dining with us! Visit again." /></div>
              <div className="space-y-1.5"><Label className="text-xs">Bill Width</Label>
                <Select defaultValue="80mm"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="58mm">58mm</SelectItem><SelectItem value="80mm">80mm (Standard)</SelectItem><SelectItem value="a4">A4</SelectItem></SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── PRINTER ── */}
        <TabsContent value="printer" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm flex items-center justify-between"><span>Printer Configuration</span><Button size="sm" className="h-7 text-xs gap-1"><Plus className="w-3 h-3" />Add Printer</Button></CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "KOT Printer (Kitchen)", model: "Epson TM-T82", connection: "Network (192.168.1.101)", type: "kitchen" },
                { name: "BOT Printer (Bar)",     model: "Epson TM-T82", connection: "Network (192.168.1.102)", type: "bar"     },
                { name: "Bill Printer",          model: "Epson TM-T88", connection: "USB",                    type: "bill"    },
              ].map(p => (
                <div key={p.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {p.type === "bar" ? <Wine className="w-4 h-4 text-purple-600" /> : <Printer className="w-4 h-4 text-muted-foreground" />}
                    <div><p className="font-medium text-sm">{p.name}</p><p className="text-xs text-muted-foreground">{p.model} · {p.connection}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    <span className="text-xs text-green-600">connected</span>
                    <Button size="sm" variant="outline" className="h-7 text-xs">Test Print</Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── DELIVERY ── */}
        <TabsContent value="delivery" className="space-y-4">
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-700">
            Delivery settings require branch coordinates. Please update your branch location first.
            <Button size="sm" variant="outline" className="ml-3 h-7 text-xs gap-1"><MapPin className="w-3 h-3" />Branch ↗</Button>
          </div>
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Fee Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-xs">Fee Calculation Method</Label>
                  <Select defaultValue="fixed"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="fixed">Fixed Rate</SelectItem><SelectItem value="distance">Distance Based</SelectItem><SelectItem value="free">Free Delivery</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">Distance Unit</Label>
                  <Select defaultValue="km"><SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="km">Kilometers (km)</SelectItem><SelectItem value="mi">Miles (mi)</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">Maximum Delivery Radius</Label><div className="flex items-center gap-1"><Input defaultValue="5" /><span className="text-sm text-muted-foreground">km</span></div></div>
                <div className="space-y-1.5"><Label className="text-xs">Fixed Fee</Label><div className="flex items-center gap-1"><span className="text-sm">₹</span><Input defaultValue="0.00" /></div></div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Free Delivery Options</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label className="text-xs">Free Delivery Over Amount</Label><div className="flex items-center gap-1"><span className="text-sm">₹</span><Input placeholder="0.00" /></div><p className="text-xs text-muted-foreground">Leave empty to disable</p></div>
              <div className="space-y-1.5"><Label className="text-xs">Free Delivery Within Radius</Label><div className="flex items-center gap-1"><Input placeholder="0.00" /><span className="text-sm text-muted-foreground">km</span></div><p className="text-xs text-muted-foreground">Leave empty to disable</p></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── KOT ── */}
        <TabsContent value="kot" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">KOT</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <CheckRow label="Enable Item Level Status" description="Enable this to allow statuses to be set at the item level." />
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Default KOT Status</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-sm mb-3 text-center border-b pb-2">POS</p>
                  <div className="space-y-2">
                    {[
                      { label: "Pending",  desc: "Initial status when KOT is created and waiting to be processed", checked: true },
                      { label: "Cooking",  desc: "Status when kitchen has started preparing", checked: false },
                      { label: "Ready",    desc: "Status when dish is ready to dispatch", checked: false },
                    ].map(s => <CheckRow key={s.label} label={s.label} description={s.desc} defaultChecked={s.checked} />)}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-3 text-center border-b pb-2">Customer</p>
                  <div className="space-y-2">
                    {[
                      { label: "Pending",  desc: "Initial status when KOT is created and waiting to be processed", checked: true },
                      { label: "Cooking",  desc: "Status when kitchen has started preparing", checked: false },
                      { label: "Ready",    desc: "Status when dish is ready to dispatch", checked: false },
                    ].map(s => <CheckRow key={s.label} label={s.label} description={s.desc} defaultChecked={s.checked} />)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Wine className="w-4 h-4 text-purple-600" />BOT (Bar Order Ticket) Settings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow label="Auto-print BOT on Bar Printer" description="Automatically print BOT when a bar/drink item is ordered" />
              <ToggleRow label="Separate BOT for Each Drink Type" description="Fire separate BOTs for cocktails, spirits, and beer" defaultChecked={false} />
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-1"><p className="text-sm font-medium">BOT Alert Threshold (minutes)</p><p className="text-xs text-muted-foreground">Alert bartender + manager if BOT exceeds this time</p></div>
                <Input defaultValue="5" className="w-20 h-8 text-center" />
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <p className="flex-1 text-sm font-medium">BOT Number Prefix</p>
                <Input defaultValue="BOT-" className="w-24 h-8" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── CANCELLATION REASONS ── */}
        <TabsContent value="cancellation" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm flex items-center justify-between">
              <span>Cancellation Reasons</span>
              <Button size="sm" className="h-7 text-xs gap-1"><Plus className="w-3 h-3" />Add</Button>
            </CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="text-left p-3 text-xs text-muted-foreground font-medium">REASON</th><th className="text-left p-3 text-xs text-muted-foreground font-medium">CANCELLATION TYPES</th><th className="text-right p-3 text-xs text-muted-foreground font-medium">ACTION</th></tr></thead>
                <tbody>
                  {cancelReasons.map(r => (
                    <tr key={r.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">{r.reason}</td>
                      <td className="p-3"><div className="flex gap-1 flex-wrap">{r.types.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}</div></td>
                      <td className="p-3 text-right"><div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                      </div></td>
                    </tr>
                  ))}
                  {cancelReasons.length === 0 && <tr><td colSpan={3} className="p-6 text-center text-muted-foreground text-sm">No records found</td></tr>}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── ORDER ── */}
        <TabsContent value="order" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Order</CardTitle><p className="text-xs text-muted-foreground">Configure order settings to manage how orders are processed.</p></CardHeader>
            <CardContent>
              <Tabs defaultValue="prefix">
                <TabsList className="flex flex-wrap h-auto gap-1">
                  <TabsTrigger value="prefix" className="text-xs h-7"># Prefix Settings</TabsTrigger>
                  <TabsTrigger value="images" className="text-xs h-7">Menu Item Image Settings</TabsTrigger>
                  <TabsTrigger value="token"  className="text-xs h-7">Token Number Settings</TabsTrigger>
                  <TabsTrigger value="custom" className="text-xs h-7">Custom Order Types</TabsTrigger>
                  <TabsTrigger value="apps"   className="text-xs h-7">Delivery Apps</TabsTrigger>
                </TabsList>
                <TabsContent value="prefix" className="mt-4 space-y-4">
                  <CheckRow label="Enable Order Prefix Settings" description="Enable this to use custom order number prefixes. If disabled, the system will use default order numbering without any custom prefix." defaultChecked={false} />
                  <div className="p-6 border rounded-lg text-center bg-muted/10">
                    <p className="text-sm font-semibold text-muted-foreground mb-2">Preview</p>
                    <p className="text-2xl font-mono font-bold text-primary">Custom prefix off. Using default (e.g. #23).</p>
                    <p className="text-xs text-muted-foreground mt-2">This is a live preview of how your next order ID will be generated.</p>
                  </div>
                </TabsContent>
                <TabsContent value="images" className="mt-4 space-y-3">
                  <ToggleRow label="Show Item Images in POS" description="Display menu item thumbnail images in POS item list" />
                  <ToggleRow label="Show Item Images on QR Menu" description="Display images when customers browse via QR" />
                  <div className="space-y-1.5"><Label className="text-xs">Image Size in POS</Label>
                    <Select defaultValue="medium"><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="small">Small</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="large">Large</SelectItem></SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="token" className="mt-4 space-y-3">
                  <ToggleRow label="Enable Token Numbers" description="Generate token numbers for takeaway / QSR orders" defaultChecked={false} />
                  <div className="space-y-1.5"><Label className="text-xs">Token Prefix</Label><Input defaultValue="T-" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Reset Token Counter</Label>
                    <Select defaultValue="daily"><SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="daily">Daily</SelectItem><SelectItem value="shift">Per Shift</SelectItem><SelectItem value="never">Never</SelectItem></SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="custom" className="mt-4 space-y-3">
                  <p className="text-sm text-muted-foreground">Define custom order types beyond the defaults (Dine-In, Takeaway, Delivery).</p>
                  {["Bar Tab", "Pool Side", "Room Service"].map(t => (
                    <div key={t} className="flex items-center justify-between p-3 border rounded-lg">
                      <p className="text-sm font-medium">{t}</p>
                      <div className="flex gap-2"><Switch defaultChecked /><Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="w-3.5 h-3.5" /></Button></div>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" className="gap-1"><Plus className="w-3 h-3" />Add Order Type</Button>
                </TabsContent>
                <TabsContent value="apps" className="mt-4 space-y-3">
                  {["Swiggy","Zomato","Direct App","ONDC"].map(app => (
                    <div key={app} className="flex items-center justify-between p-3 border rounded-lg">
                      <p className="font-medium text-sm">{app}</p>
                      <div className="flex items-center gap-3"><Switch defaultChecked={app!=="ONDC"} /><Button size="sm" variant="outline" className="h-7 text-xs">Configure</Button></div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── REFUND REASONS ── */}
        <TabsContent value="refund" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm flex items-center justify-between">
              <span>Refund Reasons</span>
              <Button size="sm" className="h-7 text-xs gap-1"><Plus className="w-3 h-3" />Add</Button>
            </CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="text-left p-3 text-xs text-muted-foreground font-medium">REASON</th><th className="text-right p-3 text-xs text-muted-foreground font-medium">ACTION</th></tr></thead>
                <tbody>
                  {refundReasons.map(r => (
                    <tr key={r.id} className="border-b hover:bg-muted/30">
                      <td className="p-3">{r.reason}</td>
                      <td className="p-3 text-right"><div className="flex gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="w-3.5 h-3.5" /></Button>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Trash2 className="w-3.5 h-3.5 text-destructive" /></Button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── AI ── */}
        <TabsContent value="ai" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-500" />AI Assistant Settings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow label="Enable AI Assistant" description="Allow staff to use the AI assistant for insights and queries" />
              <ToggleRow label="AI Sales Insights" description="Auto-generate daily sales insights and recommendations" />
              <ToggleRow label="AI Menu Suggestions" description="Let AI suggest menu changes based on sales patterns" defaultChecked={false} />
              <ToggleRow label="AI Inventory Alerts" description="AI-powered smart inventory reorder suggestions" />
              <div className="space-y-1.5"><Label className="text-xs">AI Model</Label>
                <Select defaultValue="sonnet"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="sonnet">Claude Sonnet 4.6 (Recommended)</SelectItem><SelectItem value="haiku">Claude Haiku 4.5 (Fast)</SelectItem></SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── FONT CONTROL ── */}
        <TabsContent value="font" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Font Control</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5"><Label className="text-xs">App Font Family</Label>
                <Select defaultValue="dm-sans"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="dm-sans">DM Sans (Default)</SelectItem><SelectItem value="inter">Inter</SelectItem><SelectItem value="roboto">Roboto</SelectItem><SelectItem value="nunito">Nunito</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Base Font Size</Label>
                <Select defaultValue="14"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="12">12px (Small)</SelectItem><SelectItem value="14">14px (Default)</SelectItem><SelectItem value="16">16px (Large)</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="p-4 border rounded-lg"><p className="font-medium text-sm">Preview</p><p className="text-muted-foreground mt-2">The quick brown fox jumps over the lazy dog. ₹1,234.56</p></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── KIOSK ── */}
        <TabsContent value="kiosk" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Kiosk Settings</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow label="Enable Kiosk Mode" description="Allow self-ordering via dedicated kiosk terminals" defaultChecked={false} />
              <ToggleRow label="Kiosk Auto-logout" description="Auto-logout kiosk after each order" />
              <ToggleRow label="Show Nutrition Info" description="Display calorie and nutrition info on kiosk menu" defaultChecked={false} />
              <div className="space-y-1.5"><Label className="text-xs">Kiosk Idle Timeout (seconds)</Label><Input defaultValue="60" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Payment Method on Kiosk</Label>
                <Select defaultValue="card"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="card">Card Only</SelectItem><SelectItem value="upi">UPI Only</SelectItem><SelectItem value="both">Card + UPI</SelectItem></SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── LOYALTY PROGRAM ── */}
        <TabsContent value="loyalty" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">Loyalty Program Settings</CardTitle><p className="text-xs text-muted-foreground">Reward your customers with loyalty points. Customers earn points on completed orders and can redeem them for discounts on future orders.</p></CardHeader>
            <CardContent>
              <Tabs defaultValue="points">
                <TabsList><TabsTrigger value="tiers">Tiers</TabsTrigger><TabsTrigger value="points">Points</TabsTrigger></TabsList>
                <TabsContent value="points" className="mt-4 space-y-4">
                  <CheckRow label="Enable Loyalty Program" description="Activate the loyalty program for your restaurant" />
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Loyalty Type</h4>
                    <p className="text-xs text-muted-foreground mb-3">Choose which loyalty mechanism(s) to use for your customers</p>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 border-2 border-primary rounded-lg cursor-pointer bg-primary/5">
                        <input type="radio" name="loyaltyType" defaultChecked className="accent-primary" />
                        <div><p className="font-semibold text-sm">Points Only</p><p className="text-xs text-muted-foreground">Customers earn and redeem points based on their spending</p></div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/30">
                        <input type="radio" name="loyaltyType" className="accent-primary" />
                        <div><p className="font-semibold text-sm">Stamps Only</p><p className="text-xs text-muted-foreground">Customers earn stamps for specific menu items and redeem them for rewards</p></div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/30">
                        <input type="radio" name="loyaltyType" className="accent-primary" />
                        <div><p className="font-semibold text-sm">Both Points and Stamps</p><p className="text-xs text-muted-foreground">Customers can earn both points (for spending) and stamps (for specific items)</p></div>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 border rounded-lg flex items-center justify-between"><div><p className="text-sm font-medium">Points per ₹ spent</p></div><Input defaultValue="1" className="w-20 h-8 text-center" /></div>
                    <div className="p-3 border rounded-lg flex items-center justify-between"><div><p className="text-sm font-medium">Points value (₹ per point)</p></div><Input defaultValue="0.50" className="w-20 h-8 text-center" /></div>
                    <div className="p-3 border rounded-lg flex items-center justify-between"><div><p className="text-sm font-medium">Min points to redeem</p></div><Input defaultValue="100" className="w-20 h-8 text-center" /></div>
                    <div className="p-3 border rounded-lg flex items-center justify-between"><div><p className="text-sm font-medium">Max redemption per order</p></div><Input defaultValue="500" className="w-20 h-8 text-center" /></div>
                  </div>
                  <ToggleRow label="Birthday Bonus Points" description="Give extra 100 points on guest's birthday" />
                  <ToggleRow label="Show Points on Receipt" description="Print loyalty points balance on bill" />
                </TabsContent>
                <TabsContent value="tiers" className="mt-4 space-y-3">
                  {[
                    { name: "Bronze",   min: 0,    max: 999,  color: "bg-amber-100 text-amber-700",    perks: "5% discount" },
                    { name: "Silver",   min: 1000, max: 4999, color: "bg-slate-100 text-slate-700",    perks: "10% discount + priority seating" },
                    { name: "Gold",     min: 5000, max: 9999, color: "bg-yellow-100 text-yellow-700",  perks: "15% discount + complimentary dessert" },
                    { name: "Platinum", min: 10000,max: null, color: "bg-purple-100 text-purple-700",  perks: "20% discount + VIP events" },
                  ].map(tier => (
                    <div key={tier.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge className={`${tier.color}`}>{tier.name}</Badge>
                        <div><p className="text-sm font-medium">{tier.min.toLocaleString()} – {tier.max ? tier.max.toLocaleString() : "∞"} pts</p><p className="text-xs text-muted-foreground">{tier.perks}</p></div>
                      </div>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Edit className="w-3 h-3" />Edit</Button>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── MULTIPOS ── */}
        <TabsContent value="multipos" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm">MultiPOS Settings</CardTitle><p className="text-xs text-muted-foreground">Manage and configure your POS machines</p></CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-lg bg-muted/20">
                <p className="font-semibold text-sm mb-1">Machine Registration</p>
                <p className="text-xs text-muted-foreground">When users access the POS page without a registered device, they'll be prompted to register it. New registrations appear as "Pending" and require approval.</p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="font-semibold text-sm mb-2">Status Guide</p>
                <div className="space-y-1 text-xs">
                  <p><span className="text-green-600 font-semibold">Active</span> Approved and can process orders</p>
                  <p><span className="text-amber-600 font-semibold">Pending</span> Awaiting approval</p>
                  <p><span className="text-red-600 font-semibold">Declined</span> Access denied, please contact administrator</p>
                </div>
              </div>
              <div>
                <p className="font-semibold text-sm mb-3">Registered Machines for Branch: Hyd - Demo</p>
                <table className="w-full text-sm">
                  <thead><tr className="border-b"><th className="text-left p-2 text-xs text-muted-foreground font-medium">ALIAS</th><th className="text-left p-2 text-xs text-muted-foreground font-medium">MACHINE ID</th><th className="text-left p-2 text-xs text-muted-foreground font-medium">STATUS</th><th className="text-left p-2 text-xs text-muted-foreground font-medium">LAST SEEN</th><th className="text-left p-2 text-xs text-muted-foreground font-medium">REGISTERED</th><th className="p-2"></th></tr></thead>
                  <tbody>
                    {[
                      { alias: "POS1", id: "01KJS8TAD0FWD2DV09X87GMN60", status: "Active", seen: "1 hour ago",  reg: "Mar 03, 2026" },
                      { alias: "Pos1", id: "01KJQ3KZ1JTV6X7RXWZJ2K0P3G", status: "Active", seen: "21 hours ago",reg: "Mar 02, 2026" },
                    ].map(m => (
                      <tr key={m.id} className="border-b hover:bg-muted/30">
                        <td className="p-2 font-medium">{m.alias}</td>
                        <td className="p-2 font-mono text-xs text-muted-foreground">{m.id}</td>
                        <td className="p-2"><Badge className="bg-green-100 text-green-700 text-xs">{m.status}</Badge></td>
                        <td className="p-2 text-xs text-muted-foreground">{m.seen}</td>
                        <td className="p-2 text-xs text-muted-foreground">{m.reg}</td>
                        <td className="p-2"><div className="flex gap-1"><Button size="sm" variant="outline" className="h-7 w-7 p-0"><Edit className="w-3 h-3" /></Button><Button size="sm" variant="outline" className="h-7 w-7 p-0 text-destructive"><Trash2 className="w-3 h-3" /></Button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── WEBHOOKS ── */}
        <TabsContent value="webhooks" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader><CardTitle className="text-sm flex items-center justify-between"><span>Webhooks</span><Button size="sm" className="h-7 text-xs gap-1"><Plus className="w-3 h-3" />Add Webhook</Button></CardTitle>
              <p className="text-xs text-muted-foreground">Manage outbound webhooks. Only events from enabled modules will be sent and scoped to this restaurant.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg space-y-3">
                <h4 className="font-semibold text-sm">Create Webhook</h4>
                <p className="text-xs text-muted-foreground">HTTPS recommended; scoped to this restaurant/branch</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs">Name</Label><Input placeholder="e.g. POS Orders Integration" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Target URL</Label><Input placeholder="https://example.com/webhook" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Secret</Label><Input placeholder="Leave blank to auto-generate" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Max Attempts</Label><Input defaultValue="3" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Backoff (seconds)</Label><Input defaultValue="60" /></div>
                  <div className="flex items-center gap-2 pt-4"><Switch defaultChecked /><Label className="text-sm">Active</Label></div>
                </div>
                <div>
                  <Label className="text-xs">Subscribed Events</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {["order.created","order.updated","reservation.received","reservation.confirmed","kot.updated","bot.updated","payment.settled","inventory.low_stock"].map(e => (
                      <label key={e} className="flex items-center gap-2 text-xs"><input type="checkbox" className="accent-primary" /><code>{e}</code></label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Source Modules</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["Order","Reservation","Kitchen","Bar","Inventory","Payment"].map(m => (
                      <label key={m} className="flex items-center gap-2 text-xs"><input type="checkbox" className="accent-primary" defaultChecked /><span>{m}</span></label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2"><Button size="sm">Save</Button><Button size="sm" variant="outline">Reset</Button></div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-700">
                Webhooks created here apply only to the current branch.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}

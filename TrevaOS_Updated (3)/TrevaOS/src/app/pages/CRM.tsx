import { useState, useRef } from "react";
import { Users, Gift, Star, TrendingUp, Send, MessageSquare, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

// ── Types ──────────────────────────────────────────────────────────────────────

type Tier = "New" | "Silver" | "Gold" | "Platinum";

interface OrderHistoryItem {
  date: string;
  items: string;
  amount: number;
  paymentMode: string;
}

interface LoyaltyTransaction {
  date: string;
  description: string;
  points: number;
  type: "earned" | "redeemed";
}

interface FeedbackEntry {
  date: string;
  rating: number;
  comment: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  visits: number;
  spent: number;
  points: number;
  tier: Tier;
  favoriteItems: string[];
  dietaryRestrictions: string;
  smokingPreference: string;
  preferredSection: string;
  birthday: string;
  anniversary: string;
  orderHistory: OrderHistoryItem[];
  loyaltyHistory: LoyaltyTransaction[];
  feedbackHistory: FeedbackEntry[];
}

interface Campaign {
  id: number;
  name: string;
  type: "SMS" | "WhatsApp" | "Email";
  segment: string;
  dateSent: string;
  recipients: number;
}

interface FeedbackLog {
  id: number;
  date: string;
  guestName: string;
  rating: number;
  comment: string;
  staff: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const customers: Customer[] = [
  {
    id: 1,
    name: "Rajesh Sharma",
    phone: "+91 98765 43210",
    email: "rajesh.sharma@gmail.com",
    visits: 45,
    spent: 52500,
    points: 1250,
    tier: "Gold",
    favoriteItems: ["Butter Chicken", "Garlic Naan", "Gulab Jamun"],
    dietaryRestrictions: "None",
    smokingPreference: "Non-smoking",
    preferredSection: "Window seating",
    birthday: "1985-03-14",
    anniversary: "2010-11-20",
    orderHistory: [
      { date: "2025-07-10", items: "Butter Chicken, Naan x2, Lassi", amount: 1450, paymentMode: "UPI" },
      { date: "2025-06-28", items: "Dal Makhani, Roti x3, Kheer", amount: 980, paymentMode: "Card" },
      { date: "2025-06-15", items: "Paneer Tikka, Biryani, Raita", amount: 1800, paymentMode: "Cash" },
    ],
    loyaltyHistory: [
      { date: "2025-07-10", description: "Visit reward", points: 145, type: "earned" },
      { date: "2025-06-28", description: "Visit reward", points: 98, type: "earned" },
      { date: "2025-06-01", description: "Birthday redemption", points: 500, type: "redeemed" },
    ],
    feedbackHistory: [
      { date: "2025-07-10", rating: 5, comment: "Excellent food and service as always!" },
      { date: "2025-06-15", rating: 4, comment: "Biryani was slightly delayed but tasted great." },
    ],
  },
  {
    id: 2,
    name: "Priya Mehta",
    phone: "+91 98765 43211",
    email: "priya.mehta@outlook.com",
    visits: 32,
    spent: 38900,
    points: 890,
    tier: "Silver",
    favoriteItems: ["Paneer Butter Masala", "Mango Lassi", "Gulab Jamun"],
    dietaryRestrictions: "Vegetarian",
    smokingPreference: "Non-smoking",
    preferredSection: "Indoor AC",
    birthday: "1992-07-22",
    anniversary: "2018-02-14",
    orderHistory: [
      { date: "2025-07-08", items: "Paneer Butter Masala, Butter Naan x2, Mango Lassi", amount: 1100, paymentMode: "UPI" },
      { date: "2025-06-20", items: "Veg Biryani, Raita, Kheer", amount: 850, paymentMode: "Card" },
    ],
    loyaltyHistory: [
      { date: "2025-07-08", description: "Visit reward", points: 110, type: "earned" },
      { date: "2025-06-20", description: "Visit reward", points: 85, type: "earned" },
      { date: "2025-05-15", description: "Anniversary offer", points: 200, type: "redeemed" },
    ],
    feedbackHistory: [
      { date: "2025-07-08", rating: 5, comment: "The paneer was perfectly cooked!" },
      { date: "2025-06-20", rating: 4, comment: "Good food, ambience was a bit noisy." },
    ],
  },
  {
    id: 3,
    name: "Arjun Nair",
    phone: "+91 98765 43212",
    email: "arjun.nair@yahoo.com",
    visits: 67,
    spent: 93400,
    points: 2340,
    tier: "Platinum",
    favoriteItems: ["Mutton Rogan Josh", "Seekh Kebab", "Phirni"],
    dietaryRestrictions: "No pork",
    smokingPreference: "Smoking zone",
    preferredSection: "Private dining",
    birthday: "1978-12-05",
    anniversary: "2005-04-08",
    orderHistory: [
      { date: "2025-07-12", items: "Mutton Rogan Josh, Laccha Paratha, Seekh Kebab, Phirni", amount: 3200, paymentMode: "Card" },
      { date: "2025-07-02", items: "Chicken Tikka, Dal Tadka, Rice, Naan x2", amount: 1750, paymentMode: "UPI" },
      { date: "2025-06-22", items: "Fish Curry, Steamed Rice, Papad, Lassi", amount: 1400, paymentMode: "Cash" },
    ],
    loyaltyHistory: [
      { date: "2025-07-12", description: "Visit reward", points: 320, type: "earned" },
      { date: "2025-07-02", description: "Visit reward", points: 175, type: "earned" },
      { date: "2025-07-01", description: "Platinum tier bonus", points: 500, type: "earned" },
      { date: "2025-06-15", description: "Redemption - free dessert", points: 300, type: "redeemed" },
    ],
    feedbackHistory: [
      { date: "2025-07-12", rating: 5, comment: "Best Rogan Josh in the city, no doubt!" },
      { date: "2025-07-02", rating: 5, comment: "Consistently outstanding. Love the private dining." },
      { date: "2025-06-22", rating: 4, comment: "Fish curry was good but could use more spice." },
    ],
  },
  {
    id: 4,
    name: "Sunita Iyer",
    phone: "+91 98765 43213",
    email: "sunita.iyer@gmail.com",
    visits: 28,
    spent: 27600,
    points: 760,
    tier: "Silver",
    favoriteItems: ["Masala Dosa", "Filter Coffee", "Rava Kesari"],
    dietaryRestrictions: "Vegetarian, No onion/garlic",
    smokingPreference: "Non-smoking",
    preferredSection: "Outdoor terrace",
    birthday: "1990-09-30",
    anniversary: "",
    orderHistory: [
      { date: "2025-07-05", items: "Masala Dosa, Sambar, Chutney, Filter Coffee", amount: 620, paymentMode: "UPI" },
      { date: "2025-06-18", items: "Idli x3, Vada x2, Filter Coffee", amount: 480, paymentMode: "Cash" },
    ],
    loyaltyHistory: [
      { date: "2025-07-05", description: "Visit reward", points: 62, type: "earned" },
      { date: "2025-06-18", description: "Visit reward", points: 48, type: "earned" },
    ],
    feedbackHistory: [
      { date: "2025-07-05", rating: 4, comment: "Authentic South Indian taste. Filter coffee is superb!" },
    ],
  },
  {
    id: 5,
    name: "Vikram Patel",
    phone: "+91 98765 43214",
    email: "vikram.patel@hotmail.com",
    visits: 8,
    spent: 9200,
    points: 220,
    tier: "New",
    favoriteItems: ["Pav Bhaji", "Vada Pav"],
    dietaryRestrictions: "None",
    smokingPreference: "Non-smoking",
    preferredSection: "Any",
    birthday: "1998-01-17",
    anniversary: "",
    orderHistory: [
      { date: "2025-07-11", items: "Pav Bhaji, Vada Pav x2, Limca", amount: 550, paymentMode: "UPI" },
      { date: "2025-07-03", items: "Thali - Full Gujarati, Chaas", amount: 780, paymentMode: "UPI" },
    ],
    loyaltyHistory: [
      { date: "2025-07-11", description: "Welcome bonus", points: 100, type: "earned" },
      { date: "2025-07-11", description: "Visit reward", points: 55, type: "earned" },
      { date: "2025-07-03", description: "Visit reward", points: 78, type: "earned" },
    ],
    feedbackHistory: [
      { date: "2025-07-11", rating: 4, comment: "Nice place! Pav Bhaji was delicious." },
    ],
  },
];

const initialCampaigns: Campaign[] = [
  { id: 1, name: "Eid Mubarak Special", type: "WhatsApp", segment: "All", dateSent: "2025-06-15", recipients: 1234 },
  { id: 2, name: "VIP Anniversary Offer", type: "SMS", segment: "VIP", dateSent: "2025-06-01", recipients: 189 },
  { id: 3, name: "Win Back Lapsed Guests", type: "Email", segment: "Lapsed", dateSent: "2025-05-20", recipients: 312 },
  { id: 4, name: "Monsoon Combo Promo", type: "WhatsApp", segment: "Regular", dateSent: "2025-07-01", recipients: 678 },
  { id: 5, name: "New Member Welcome", type: "Email", segment: "New", dateSent: "2025-07-10", recipients: 45 },
];

const initialFeedbackLogs: FeedbackLog[] = [
  { id: 1, date: "2025-07-12", guestName: "Arjun Nair", rating: 5, comment: "Best Rogan Josh in the city!", staff: "Ravi Kumar" },
  { id: 2, date: "2025-07-11", guestName: "Vikram Patel", rating: 4, comment: "Pav Bhaji was delicious, will come back.", staff: "Meena S." },
  { id: 3, date: "2025-07-10", guestName: "Rajesh Sharma", rating: 5, comment: "Excellent food and service as always!", staff: "Ravi Kumar" },
  { id: 4, date: "2025-07-08", guestName: "Priya Mehta", rating: 5, comment: "The paneer was perfectly cooked!", staff: "Anita D." },
  { id: 5, date: "2025-07-05", guestName: "Sunita Iyer", rating: 4, comment: "Authentic South Indian taste.", staff: "Suresh P." },
  { id: 6, date: "2025-07-03", guestName: "Walk-in Guest", rating: 3, comment: "Food was okay, service was slow.", staff: "Meena S." },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function tierColor(tier: Tier) {
  switch (tier) {
    case "Platinum": return "bg-purple-100 text-purple-800";
    case "Gold":     return "bg-yellow-100 text-yellow-800";
    case "Silver":   return "bg-gray-200 text-gray-800";
    default:         return "bg-blue-100 text-blue-700";
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </span>
  );
}

function channelBadgeColor(type: Campaign["type"]) {
  switch (type) {
    case "WhatsApp": return "bg-green-100 text-green-800";
    case "SMS":      return "bg-blue-100 text-blue-800";
    case "Email":    return "bg-orange-100 text-orange-800";
  }
}

// ── Guest Profile Sheet ────────────────────────────────────────────────────────

function GuestProfileSheet({ customer, open, onClose }: { customer: Customer | null; open: boolean; onClose: () => void }) {
  if (!customer) return null;
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Guest Profile</SheetTitle>
        </SheetHeader>

        {/* Profile Header */}
        <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-lg mb-6">
          <Avatar className="w-16 h-16 text-xl">
            <AvatarFallback>{customer.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-semibold">{customer.name}</h2>
              <Badge className={tierColor(customer.tier)}>{customer.tier}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{customer.phone} · {customer.email}</p>
            <div className="flex gap-4 mt-2 text-sm">
              <span><span className="font-medium">{customer.visits}</span> visits</span>
              <span><span className="font-medium">₹{customer.spent.toLocaleString()}</span> total spend</span>
              <span><span className="font-medium">{customer.points}</span> pts</span>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">Preferences</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Favorite items: </span>{customer.favoriteItems.join(", ")}</div>
            <div><span className="text-muted-foreground">Dietary: </span>{customer.dietaryRestrictions}</div>
            <div><span className="text-muted-foreground">Smoking: </span>{customer.smokingPreference}</div>
            <div><span className="text-muted-foreground">Section: </span>{customer.preferredSection}</div>
          </div>
        </div>

        {/* Occasion Log */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">Occasions</h3>
          <div className="flex gap-6 text-sm">
            <div><span className="text-muted-foreground">Birthday: </span>{customer.birthday || "—"}</div>
            <div><span className="text-muted-foreground">Anniversary: </span>{customer.anniversary || "—"}</div>
          </div>
        </div>

        {/* Order History */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">Order History</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customer.orderHistory.map((o, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs whitespace-nowrap">{o.date}</TableCell>
                  <TableCell className="text-xs">{o.items}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">₹{o.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-xs">{o.paymentMode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Feedback History */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">Feedback History</h3>
          <div className="space-y-2">
            {customer.feedbackHistory.map((f, i) => (
              <div key={i} className="border rounded-md p-3">
                <div className="flex items-center justify-between mb-1">
                  <StarRating rating={f.rating} />
                  <span className="text-xs text-muted-foreground">{f.date}</span>
                </div>
                <p className="text-sm">{f.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty Points */}
        <div>
          <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
            Loyalty Points · Balance: <span className="text-foreground">{customer.points} pts</span>
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customer.loyaltyHistory.map((l, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs whitespace-nowrap">{l.date}</TableCell>
                  <TableCell className="text-xs">{l.description}</TableCell>
                  <TableCell className={`text-xs font-semibold ${l.type === "earned" ? "text-green-600" : "text-red-500"}`}>
                    {l.type === "earned" ? "+" : "−"}{l.points}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── New Campaign Dialog ────────────────────────────────────────────────────────

function NewCampaignDialog({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (c: Campaign) => void }) {
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<Campaign["type"]>("WhatsApp");
  const [segment, setSegment] = useState("All");
  const [message, setMessage] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const idRef = useRef(initialCampaigns.length + 1);

  function handleSave() {
    if (!name.trim()) return;
    onSave({ id: idRef.current++, name, type: channel, segment, dateSent: scheduleDate || new Date().toISOString().slice(0, 10), recipients: 0 });
    setName(""); setChannel("WhatsApp"); setSegment("All"); setMessage(""); setScheduleDate("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Campaign</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label>Campaign Name</Label>
            <Input placeholder="e.g. Diwali Special Offer" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Channel</Label>
              <Select value={channel} onValueChange={(v) => setChannel(v as Campaign["type"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Target Segment</Label>
              <Select value={segment} onValueChange={setSegment}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="VIP">VIP</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Lapsed">Lapsed</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Message Template</Label>
            <Textarea placeholder="Enter your message here…" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} />
          </div>
          <div className="space-y-1">
            <Label>Schedule Date</Label>
            <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}><Send className="w-4 h-4 mr-2" />Send Campaign</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Log Feedback Dialog ────────────────────────────────────────────────────────

function LogFeedbackDialog({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (f: FeedbackLog) => void }) {
  const [guestName, setGuestName] = useState("");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [staff, setStaff] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const idRef = useRef(initialFeedbackLogs.length + 1);

  function handleSave() {
    if (!guestName.trim()) return;
    onSave({ id: idRef.current++, date, guestName, rating: Number(rating), comment, staff });
    setGuestName(""); setRating("5"); setComment(""); setStaff(""); setDate(new Date().toISOString().slice(0, 10));
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Feedback</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Guest Name</Label>
              <Input placeholder="e.g. Rahul Gupta" value={guestName} onChange={(e) => setGuestName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Rating</Label>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <SelectItem key={r} value={String(r)}>{r} Star{r > 1 ? "s" : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Staff Served By</Label>
              <Input placeholder="e.g. Ravi Kumar" value={staff} onChange={(e) => setStaff(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Comments</Label>
            <Textarea placeholder="Guest feedback…" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main CRM Component ─────────────────────────────────────────────────────────

export function CRM() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [feedbackLogs, setFeedbackLogs] = useState<FeedbackLog[]>(initialFeedbackLogs);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  function openProfile(customer: Customer) {
    setSelectedCustomer(customer);
    setSheetOpen(true);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">CRM & Customers</h1>
          <p className="text-muted-foreground mt-1">Manage customer relationships and loyalty programs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Create Offer</Button>
          <Button>Add Customer</Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-semibold mt-1">1,234</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Offers</p>
                <p className="text-2xl font-semibold mt-1">8</p>
              </div>
              <Gift className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-semibold mt-1">4.6</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Retention Rate</p>
                <p className="text-2xl font-semibold mt-1">78%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="customers">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        {/* ── Customers Tab ── */}
        <TabsContent value="customers">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Visits</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} className="cursor-pointer hover:bg-muted/50" onClick={() => openProfile(customer)}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{customer.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.visits}</TableCell>
                      <TableCell>₹{customer.spent.toLocaleString()}</TableCell>
                      <TableCell>{customer.points}</TableCell>
                      <TableCell>
                        <Badge className={tierColor(customer.tier)}>{customer.tier}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); openProfile(customer); }}>
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Campaigns Tab ── */}
        <TabsContent value="campaigns">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Campaigns</CardTitle>
              <Button size="sm" onClick={() => setCampaignDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />New Campaign
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Date Sent</TableHead>
                    <TableHead>Recipients</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>
                        <Badge className={channelBadgeColor(c.type)}>{c.type}</Badge>
                      </TableCell>
                      <TableCell>{c.segment}</TableCell>
                      <TableCell>{c.dateSent}</TableCell>
                      <TableCell>{c.recipients > 0 ? c.recipients.toLocaleString() : <span className="text-muted-foreground text-xs">Scheduled</span>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Feedback Tab ── */}
        <TabsContent value="feedback">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Feedback Collection</CardTitle>
              <Button size="sm" onClick={() => setFeedbackDialogOpen(true)}>
                <MessageSquare className="w-4 h-4 mr-2" />Log Feedback
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Guest Name</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Staff</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbackLogs.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="whitespace-nowrap">{f.date}</TableCell>
                      <TableCell className="font-medium">{f.guestName}</TableCell>
                      <TableCell><StarRating rating={f.rating} /></TableCell>
                      <TableCell className="text-sm">{f.comment}</TableCell>
                      <TableCell className="text-sm">{f.staff}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Guest Profile Sheet */}
      <GuestProfileSheet customer={selectedCustomer} open={sheetOpen} onClose={() => setSheetOpen(false)} />

      {/* New Campaign Dialog */}
      <NewCampaignDialog
        open={campaignDialogOpen}
        onClose={() => setCampaignDialogOpen(false)}
        onSave={(c) => setCampaigns((prev) => [c, ...prev])}
      />

      {/* Log Feedback Dialog */}
      <LogFeedbackDialog
        open={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        onSave={(f) => setFeedbackLogs((prev) => [f, ...prev])}
      />
    </div>
  );
}

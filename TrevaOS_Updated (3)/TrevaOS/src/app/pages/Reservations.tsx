import { useState, useEffect, useRef } from "react";
import {
  CalendarCheck, Clock, Users, Phone, Plus, Check, X,
  Edit2, Bell, Trash2, AlertTriangle, Star, UserCheck,
  MapPin, Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "../components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "../components/ui/select";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "../components/ui/tabs";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReservationStatus = "confirmed" | "pending" | "cancelled" | "late" | "seated" | "completed";
type Section = "Indoor" | "Outdoor" | "Terrace" | "Private Dining" | "Banquet";
type Occasion = "None" | "Birthday" | "Anniversary" | "Corporate" | "Date Night";
type Source = "Walk-in" | "Phone" | "Zomato" | "UrbanPiper" | "EazyDiner" | "Website";

interface Reservation {
  id: number;
  name: string;
  phone: string;
  email: string;
  pax: number;
  date: string;
  time: string;
  table: string;
  section: Section;
  status: ReservationStatus;
  occasion: Occasion;
  source: Source;
  smoking: boolean;
  highChair: boolean;
  accessibility: boolean;
  notes: string;
}

interface WaitlistEntry {
  id: number;
  name: string;
  phone: string;
  pax: number;
  addedAt: string; // ISO timestamp
  position: number;
  isPriority: boolean; // late-reservation holder
}

interface CRMProfile {
  phone: string;
  name: string;
  email: string;
  visits: number;
  preferredSection: Section;
  smoking: boolean;
  highChair: boolean;
  accessibility: boolean;
}

// ─── Mock CRM profiles ────────────────────────────────────────────────────────

const crmProfiles: CRMProfile[] = [
  { phone: "9876543210", name: "Rahul Sharma",   email: "rahul.sharma@gmail.com",   visits: 12, preferredSection: "Indoor",         smoking: false, highChair: false, accessibility: false },
  { phone: "8765432109", name: "Priya Mehta",    email: "priya.mehta@gmail.com",    visits: 7,  preferredSection: "Outdoor",         smoking: false, highChair: true,  accessibility: false },
  { phone: "7654321098", name: "Amit Patel",     email: "amit.patel@outlook.com",   visits: 3,  preferredSection: "Terrace",         smoking: true,  highChair: false, accessibility: false },
  { phone: "9988776655", name: "Sunita Reddy",   email: "sunita.r@yahoo.in",        visits: 19, preferredSection: "Private Dining",  smoking: false, highChair: false, accessibility: true  },
  { phone: "9112233445", name: "Kavya Nair",     email: "kavya.nair@hotmail.com",   visits: 5,  preferredSection: "Indoor",         smoking: false, highChair: true,  accessibility: false },
];

// ─── Mock tables ──────────────────────────────────────────────────────────────

const availableTables = [
  "Table 1", "Table 2", "Table 3", "Table 4", "Table 5",
  "Table 6", "Table 7", "Table 8", "Table 9", "Table 10",
  "Corner Booth A", "Corner Booth B", "Terrace T1", "Terrace T2",
  "Private Room 1", "Private Room 2", "Banquet Hall",
];

const occupiedTables = ["Table 3", "Table 7", "Banquet Hall"];

// ─── Mock initial reservations ────────────────────────────────────────────────

const TODAY = "2026-03-04";

const initialReservations: Reservation[] = [
  { id: 1,  name: "Rahul Sharma",    phone: "9876543210", email: "rahul.sharma@gmail.com",   pax: 4,  date: TODAY,         time: "19:00", table: "Table 5",      section: "Indoor",        status: "confirmed",  occasion: "Birthday",    source: "Zomato",     smoking: false, highChair: false, accessibility: false, notes: "Window seat preferred" },
  { id: 2,  name: "Priya Mehta",     phone: "8765432109", email: "priya.mehta@gmail.com",    pax: 2,  date: TODAY,         time: "20:00", table: "Table 2",      section: "Outdoor",       status: "confirmed",  occasion: "None",        source: "EazyDiner",  smoking: false, highChair: true,  accessibility: false, notes: "" },
  { id: 3,  name: "Amit Patel",      phone: "7654321098", email: "amit.patel@outlook.com",   pax: 6,  date: TODAY,         time: "19:30", table: "Table 8",      section: "Terrace",       status: "pending",    occasion: "Anniversary", source: "Phone",      smoking: true,  highChair: false, accessibility: false, notes: "Candle arrangement requested" },
  { id: 4,  name: "Sneha Gupta",     phone: "6543210987", email: "sneha.gupta@gmail.com",    pax: 3,  date: TODAY,         time: "21:00", table: "Table 4",      section: "Indoor",        status: "cancelled",  occasion: "None",        source: "Website",    smoking: false, highChair: false, accessibility: false, notes: "" },
  { id: 5,  name: "Vikram Singh",    phone: "5432109876", email: "vikram.singh@corp.in",     pax: 8,  date: TODAY,         time: "19:00", table: "Private Room 1", section: "Private Dining", status: "confirmed", occasion: "Corporate",  source: "UrbanPiper", smoking: false, highChair: false, accessibility: false, notes: "Projector required" },
  { id: 6,  name: "Sunita Reddy",    phone: "9988776655", email: "sunita.r@yahoo.in",        pax: 2,  date: TODAY,         time: "13:00", table: "Table 1",      section: "Indoor",        status: "confirmed",  occasion: "Date Night",  source: "EazyDiner",  smoking: false, highChair: false, accessibility: true,  notes: "Wheelchair accessible seating" },
  { id: 7,  name: "Arjun Kapoor",    phone: "9876501234", email: "arjun.k@gmail.com",        pax: 5,  date: TODAY,         time: "18:30", table: "Terrace T1",   section: "Terrace",       status: "confirmed",  occasion: "Birthday",    source: "Zomato",     smoking: false, highChair: false, accessibility: false, notes: "Birthday cake pre-ordered" },
  { id: 8,  name: "Deepika Joshi",   phone: "8877665544", email: "deepika.j@rediffmail.com", pax: 4,  date: TODAY,         time: "20:30", table: "Table 9",      section: "Indoor",        status: "pending",    occasion: "Anniversary", source: "Walk-in",    smoking: false, highChair: true,  accessibility: false, notes: "" },
  { id: 9,  name: "Rohit Verma",     phone: "7766554433", email: "rohit.v@yahoo.in",         pax: 10, date: "2026-03-05",  time: "19:00", table: "Banquet Hall", section: "Banquet",       status: "confirmed",  occasion: "Corporate",   source: "Phone",      smoking: false, highChair: false, accessibility: false, notes: "Vegetarian menu only" },
  { id: 10, name: "Neha Bhatt",      phone: "6655443322", email: "neha.bhatt@gmail.com",     pax: 2,  date: "2026-03-05",  time: "20:00", table: "Corner Booth A", section: "Indoor",      status: "pending",    occasion: "Date Night",  source: "Website",    smoking: false, highChair: false, accessibility: false, notes: "" },
  { id: 11, name: "Kavya Nair",      phone: "9112233445", email: "kavya.nair@hotmail.com",   pax: 3,  date: "2026-03-06",  time: "13:30", table: "Table 6",      section: "Indoor",        status: "confirmed",  occasion: "Birthday",    source: "Zomato",     smoking: false, highChair: true,  accessibility: false, notes: "Allergy: nuts" },
  { id: 12, name: "Manish Tiwari",   phone: "8001122334", email: "manish.t@hotmail.com",     pax: 7,  date: "2026-03-07",  time: "19:30", table: "Private Room 2", section: "Private Dining", status: "confirmed", occasion: "Corporate", source: "UrbanPiper", smoking: false, highChair: false, accessibility: false, notes: "Pre-set menu confirmed" },
];

const initialWaitlist: WaitlistEntry[] = [
  { id: 1, name: "Tanvi Sharma",  phone: "9900112233", pax: 2, addedAt: new Date(Date.now() - 18 * 60000).toISOString(), position: 1, isPriority: true  },
  { id: 2, name: "Karan Mehta",   phone: "9811223344", pax: 4, addedAt: new Date(Date.now() - 32 * 60000).toISOString(), position: 2, isPriority: false },
  { id: 3, name: "Pooja Iyer",    phone: "9722334455", pax: 3, addedAt: new Date(Date.now() - 8  * 60000).toISOString(), position: 3, isPriority: false },
  { id: 4, name: "Suresh Bhat",   phone: "9633445566", pax: 6, addedAt: new Date(Date.now() - 45 * 60000).toISOString(), position: 4, isPriority: true  },
];

// ─── Helper utilities ─────────────────────────────────────────────────────────

const BLANK_FORM: Omit<Reservation, "id" | "status"> = {
  name: "", phone: "", email: "", pax: 2,
  date: TODAY, time: "19:00", table: "", section: "Indoor",
  occasion: "None", source: "Walk-in",
  smoking: false, highChair: false, accessibility: false, notes: "",
};

function normalizePhone(raw: string) {
  return raw.replace(/\D/g, "").slice(-10);
}

function waitMinutes(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
}

function graceInfo(date: string, time: string): { minutes: number; label: string; color: string } {
  const dt = new Date(`${date}T${time}:00`);
  const diff = Math.floor((Date.now() - dt.getTime()) / 60000);
  if (diff < 0)   return { minutes: diff, label: `in ${Math.abs(diff)}m`, color: "text-muted-foreground" };
  if (diff < 10)  return { minutes: diff, label: `+${diff}m`, color: "text-amber-500" };
  if (diff < 15)  return { minutes: diff, label: `+${diff}m`, color: "text-orange-500 font-semibold" };
  return { minutes: diff, label: "Grace expired", color: "text-red-600 font-semibold" };
}

// ─── Source badge ─────────────────────────────────────────────────────────────

const sourceBadgeClass: Record<Source, string> = {
  "Zomato":     "bg-red-100 text-red-700 border-red-200",
  "UrbanPiper": "bg-orange-100 text-orange-700 border-orange-200",
  "EazyDiner":  "bg-green-100 text-green-700 border-green-200",
  "Phone":      "bg-blue-100 text-blue-700 border-blue-200",
  "Walk-in":    "bg-gray-100 text-gray-700 border-gray-200",
  "Website":    "bg-purple-100 text-purple-700 border-purple-200",
};

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusBadgeClass: Record<ReservationStatus, string> = {
  confirmed: "bg-green-100 text-green-700",
  pending:   "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  late:      "bg-orange-100 text-orange-700",
  seated:    "bg-blue-100 text-blue-700",
  completed: "bg-gray-100 text-gray-600",
};

// ─── Reservation Form ─────────────────────────────────────────────────────────

interface ReservationFormProps {
  form: Omit<Reservation, "id" | "status">;
  onChange: (field: string, value: string | number | boolean) => void;
  crmMatch: CRMProfile | null;
  isEdit?: boolean;
  originalTable?: string;
}

function ReservationForm({ form, onChange, crmMatch, isEdit, originalTable }: ReservationFormProps) {
  const tableOccupied = isEdit && form.table !== originalTable && occupiedTables.includes(form.table);

  return (
    <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-1">
      {crmMatch && (
        <div className="flex items-center gap-2 rounded-md bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-700">
          <UserCheck className="w-4 h-4 shrink-0" />
          <span>Returning guest — <strong>{crmMatch.visits} visits</strong>. Preferences auto-filled.</span>
          <Badge className="ml-auto text-xs bg-blue-600 text-white">Returning Guest</Badge>
        </div>
      )}

      {tableOccupied && (
        <div className="flex items-center gap-2 rounded-md bg-amber-50 border border-amber-300 px-3 py-2 text-sm text-amber-800">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Manager confirmation required to change table assignment.
        </div>
      )}

      {/* Row 1: Name & Phone */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs font-medium">Guest Name</Label>
          <Input placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => onChange("name", e.target.value)} className="h-8 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Mobile Number</Label>
          <Input placeholder="+91 98765 43210" value={form.phone} onChange={e => onChange("phone", e.target.value)} className="h-8 text-sm" />
        </div>
      </div>

      {/* Row 2: Email */}
      <div className="space-y-1">
        <Label className="text-xs font-medium">Email</Label>
        <Input placeholder="guest@email.com" value={form.email} onChange={e => onChange("email", e.target.value)} className="h-8 text-sm" />
      </div>

      {/* Row 3: Date, Time, Pax */}
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs font-medium">Date</Label>
          <Input type="date" value={form.date} onChange={e => onChange("date", e.target.value)} className="h-8 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Time</Label>
          <Input type="time" value={form.time} onChange={e => onChange("time", e.target.value)} className="h-8 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Party Size</Label>
          <Input type="number" min={1} max={50} value={form.pax} onChange={e => onChange("pax", parseInt(e.target.value) || 1)} className="h-8 text-sm" />
        </div>
      </div>

      {/* Row 4: Section & Table */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs font-medium">Section Preference</Label>
          <Select value={form.section} onValueChange={v => onChange("section", v)}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(["Indoor", "Outdoor", "Terrace", "Private Dining", "Banquet"] as Section[]).map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Table Preference</Label>
          <Select value={form.table} onValueChange={v => onChange("table", v)}>
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select table" /></SelectTrigger>
            <SelectContent>
              {availableTables.map(t => (
                <SelectItem key={t} value={t}>
                  {t}{occupiedTables.includes(t) ? " 🔴" : " 🟢"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 5: Occasion & Source */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs font-medium">Occasion</Label>
          <Select value={form.occasion} onValueChange={v => onChange("occasion", v)}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(["None", "Birthday", "Anniversary", "Corporate", "Date Night"] as Occasion[]).map(o => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-medium">Booking Source</Label>
          <Select value={form.source} onValueChange={v => onChange("source", v)}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(["Walk-in", "Phone", "Zomato", "UrbanPiper", "EazyDiner", "Website"] as Source[]).map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 6: Toggles */}
      <div className="grid grid-cols-3 gap-3">
        {([
          { key: "smoking",       label: "Smoking Area"        },
          { key: "highChair",     label: "High Chair Needed"   },
          { key: "accessibility", label: "Accessibility Req."  },
        ] as { key: keyof typeof form; label: string }[]).map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between rounded-md border px-3 py-2">
            <span className="text-xs font-medium">{label}</span>
            <Switch checked={!!form[key]} onCheckedChange={v => onChange(key, v)} />
          </div>
        ))}
      </div>

      {/* Row 7: Notes */}
      <div className="space-y-1">
        <Label className="text-xs font-medium">Special Notes</Label>
        <Textarea placeholder="Allergies, special arrangements, seating preferences..." value={form.notes} onChange={e => onChange("notes", e.target.value)} className="text-sm resize-none h-20" />
      </div>
    </div>
  );
}

// ─── Grace Timer cell ─────────────────────────────────────────────────────────

function GraceCell({ date, time, status, onLate }: {
  date: string; time: string; status: ReservationStatus; onLate: () => void;
}) {
  const [, tick] = useState(0);
  const calledLate = useRef(false);

  useEffect(() => {
    if (status !== "confirmed" && status !== "late") return;
    const id = setInterval(() => tick(n => n + 1), 30000);
    return () => clearInterval(id);
  }, [status]);

  const { minutes, label, color } = graceInfo(date, time);

  useEffect(() => {
    if (status === "confirmed" && minutes >= 15 && !calledLate.current) {
      calledLate.current = true;
      onLate();
    }
  }, [minutes, status, onLate]);

  if (status === "cancelled" || status === "completed") return <span className="text-muted-foreground text-xs">—</span>;
  if (status === "seated") return <Badge className="text-xs bg-blue-100 text-blue-700">Seated</Badge>;
  if (minutes < 0) return <span className="text-xs text-muted-foreground">{label}</span>;
  if (minutes >= 15) {
    return (
      <div className="flex flex-col gap-1">
        <span className={`text-xs ${color}`}>{label}</span>
        <Badge className="text-xs bg-red-100 text-red-700 w-fit">Table Released</Badge>
      </div>
    );
  }
  return <span className={`text-xs ${color}`}>{label}</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [waitlist, setWaitlist]         = useState<WaitlistEntry[]>(initialWaitlist);

  const [search, setSearch]             = useState("");
  const [dateFilter, setDateFilter]     = useState<"all" | "today" | "tomorrow" | "week">("all");

  const [newOpen, setNewOpen]           = useState(false);
  const [editOpen, setEditOpen]         = useState(false);
  const [editTarget, setEditTarget]     = useState<Reservation | null>(null);

  const [form, setForm]                 = useState<Omit<Reservation, "id" | "status">>({ ...BLANK_FORM });
  const [crmMatch, setCrmMatch]         = useState<CRMProfile | null>(null);

  const [removeConfirm, setRemoveConfirm] = useState<number | null>(null);
  const [, tickWaitlist]                  = useState(0);

  // Live-refresh waitlist wait-times every minute
  useEffect(() => {
    const id = setInterval(() => tickWaitlist(n => n + 1), 60000);
    return () => clearInterval(id);
  }, []);

  // ── CRM auto-fill on phone change ──────────────────────────────────────────

  function handleFormChange(field: string, value: string | number | boolean) {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "phone") {
        const norm = normalizePhone(String(value));
        const profile = crmProfiles.find(p => p.phone === norm) ?? null;
        setCrmMatch(profile);
        if (profile) {
          return {
            ...updated,
            name:         profile.name,
            email:        profile.email,
            section:      profile.preferredSection,
            smoking:      profile.smoking,
            highChair:    profile.highChair,
            accessibility: profile.accessibility,
          };
        }
      }
      return updated;
    });
  }

  // ── Open New dialog ────────────────────────────────────────────────────────

  function openNew() {
    setForm({ ...BLANK_FORM });
    setCrmMatch(null);
    setNewOpen(true);
  }

  function saveNew() {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Guest name and phone are required.");
      return;
    }
    const next: Reservation = { ...form, id: Date.now(), status: "confirmed" };
    setReservations(prev => [next, ...prev]);
    setNewOpen(false);
    toast.success(`Reservation created for ${form.name}`);
  }

  // ── Open Edit dialog ───────────────────────────────────────────────────────

  function openEdit(r: Reservation) {
    const { id, status, ...rest } = r;
    setForm({ ...rest });
    setEditTarget(r);
    setCrmMatch(crmProfiles.find(p => p.phone === normalizePhone(r.phone)) ?? null);
    setEditOpen(true);
  }

  function saveEdit() {
    if (!editTarget) return;
    setReservations(prev =>
      prev.map(r => r.id === editTarget.id ? { ...r, ...form } : r)
    );
    setEditOpen(false);
    toast.success(`Reservation updated for ${form.name}`);
  }

  // ── Status helpers ─────────────────────────────────────────────────────────

  function confirmReservation(id: number) {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "confirmed" } : r));
    toast.success("Reservation confirmed.");
  }

  function cancelReservation(id: number) {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "cancelled" } : r));
    toast("Reservation cancelled.");
  }

  function markLate(id: number) {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: "late" } : r));
    toast.warning("Guest marked as Late — 15-min grace expired.");
  }

  // ── Waitlist actions ───────────────────────────────────────────────────────

  function seatNow(id: number) {
    setWaitlist(prev => prev.filter(w => w.id !== id).map((w, i) => ({ ...w, position: i + 1 })));
    toast.success("Table assigned.");
  }

  function notifyGuest(name: string) {
    toast.success(`SMS notification sent to ${name}.`);
  }

  function removeFromWaitlist(id: number) {
    setWaitlist(prev => prev.filter(w => w.id !== id).map((w, i) => ({ ...w, position: i + 1 })));
    setRemoveConfirm(null);
    toast("Guest removed from waitlist.");
  }

  // ── Filter reservations ────────────────────────────────────────────────────

  const TOMORROW = "2026-03-05";
  const WEEK_END  = "2026-03-11";

  const filtered = reservations.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search);
    const matchDate =
      dateFilter === "all"      ? true :
      dateFilter === "today"    ? r.date === TODAY :
      dateFilter === "tomorrow" ? r.date === TOMORROW :
      r.date >= TODAY && r.date <= WEEK_END;
    return matchSearch && matchDate;
  });

  // ── Stats ──────────────────────────────────────────────────────────────────

  const todayRes    = reservations.filter(r => r.date === TODAY);
  const confirmedN  = todayRes.filter(r => r.status === "confirmed" || r.status === "seated").length;
  const pendingN    = reservations.filter(r => r.status === "pending").length;
  const totalCovers = todayRes.reduce((a, r) => a + r.pax, 0);

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reservations</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage table bookings and guest reservations</p>
        </div>
        <Button className="gap-2" onClick={openNew}><Plus className="w-4 h-4" />New Reservation</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Today's Reservations", value: todayRes.length,  color: "text-blue-600"   },
          { label: "Confirmed Today",       value: confirmedN,       color: "text-green-600"  },
          { label: "Pending",               value: pendingN,         color: "text-yellow-600" },
          { label: "Total Covers Today",    value: totalCovers,      color: "text-purple-600" },
        ].map(s => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reservations">
        <TabsList className="w-fit">
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="waitlist">
            Waitlist
            {waitlist.length > 0 && (
              <span className="ml-1.5 rounded-full bg-orange-500 text-white text-[10px] px-1.5 py-0.5 leading-none">{waitlist.length}</span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ── RESERVATIONS TAB ── */}
        <TabsContent value="reservations" className="space-y-3 mt-3">
          <div className="flex gap-3 items-center flex-wrap">
            <Input placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} className="w-72 h-9 text-sm" />
            {(["all", "today", "tomorrow", "week"] as const).map(f => (
              <Button key={f} size="sm" variant={dateFilter === f ? "default" : "outline"}
                onClick={() => setDateFilter(f)} className="capitalize h-9">
                {f === "all" ? "All" : f === "week" ? "This Week" : f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      {["#", "Guest", "Date & Time", "Pax", "Table / Section", "Occasion", "Source", "Grace Timer", "Status", "Actions"].map(h => (
                        <th key={h} className="text-left text-xs font-medium text-muted-foreground px-3 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={10} className="px-4 py-8 text-center text-sm text-muted-foreground">No reservations found.</td>
                      </tr>
                    )}
                    {filtered.map(r => (
                      <tr key={r.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">

                        {/* # */}
                        <td className="px-3 py-3 text-xs text-muted-foreground">{r.id}</td>

                        {/* Guest */}
                        <td className="px-3 py-3">
                          <p className="font-medium text-sm">{r.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3" />{r.phone}</p>
                          {r.email && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" />{r.email}</p>}
                          {(() => {
                            const m = crmProfiles.find(p => p.phone === normalizePhone(r.phone));
                            return m ? <Badge className="mt-1 text-[10px] bg-blue-100 text-blue-700 gap-1 w-fit"><Star className="w-2.5 h-2.5" />{m.visits}× guest</Badge> : null;
                          })()}
                        </td>

                        {/* Date & Time */}
                        <td className="px-3 py-3 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-1 text-muted-foreground"><CalendarCheck className="w-3.5 h-3.5" />{r.date}</div>
                          <div className="flex items-center gap-1 text-muted-foreground mt-0.5"><Clock className="w-3.5 h-3.5" />{r.time}</div>
                        </td>

                        {/* Pax */}
                        <td className="px-3 py-3">
                          <span className="flex items-center gap-1 text-sm"><Users className="w-3.5 h-3.5 text-muted-foreground" />{r.pax}</span>
                        </td>

                        {/* Table / Section */}
                        <td className="px-3 py-3 text-sm">
                          <p className="font-medium">{r.table || "—"}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{r.section}</p>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {r.smoking      && <Badge variant="outline" className="text-[10px] px-1 py-0">🚬 Smoking</Badge>}
                            {r.highChair    && <Badge variant="outline" className="text-[10px] px-1 py-0">🪑 High Chair</Badge>}
                            {r.accessibility && <Badge variant="outline" className="text-[10px] px-1 py-0">♿ Access</Badge>}
                          </div>
                        </td>

                        {/* Occasion */}
                        <td className="px-3 py-3">
                          {r.occasion !== "None" && r.occasion
                            ? <Badge variant="outline" className="text-xs">{r.occasion}</Badge>
                            : <span className="text-muted-foreground text-xs">—</span>}
                        </td>

                        {/* Source */}
                        <td className="px-3 py-3">
                          <Badge className={`text-xs border ${sourceBadgeClass[r.source]}`}>{r.source}</Badge>
                        </td>

                        {/* Grace Timer */}
                        <td className="px-3 py-3 min-w-[100px]">
                          <GraceCell
                            date={r.date} time={r.time} status={r.status}
                            onLate={() => markLate(r.id)}
                          />
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3">
                          <Badge className={`text-xs capitalize ${statusBadgeClass[r.status]}`}>{r.status}</Badge>
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {r.status !== "cancelled" && r.status !== "completed" && (
                              <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1" onClick={() => openEdit(r)}>
                                <Edit2 className="w-3 h-3" />Edit
                              </Button>
                            )}
                            {r.status === "pending" && (
                              <Button size="sm" className="h-7 px-2 text-xs gap-1" onClick={() => confirmReservation(r.id)}>
                                <Check className="w-3 h-3" />Confirm
                              </Button>
                            )}
                            {r.status !== "cancelled" && r.status !== "completed" && (
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-red-500" onClick={() => cancelReservation(r.id)}>
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── WAITLIST TAB ── */}
        <TabsContent value="waitlist" className="mt-3">
          <Card className="shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base">Waitlist Queue</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {waitlist.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">Waitlist is empty.</p>
              )}
              {waitlist.map(w => (
                <div key={w.id} className="flex items-center justify-between gap-3 border-b last:border-0 px-4 py-3 hover:bg-muted/20 transition-colors">
                  {/* Position */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0">
                      {w.position}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{w.name}</p>
                        {w.isPriority && (
                          <Badge className="text-[10px] bg-red-100 text-red-700 gap-1"><AlertTriangle className="w-2.5 h-2.5" />Priority</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />{w.phone}
                        <span className="mx-1">·</span>
                        <Users className="w-3 h-3" />{w.pax} pax
                        <span className="mx-1">·</span>
                        <Clock className="w-3 h-3" />Waiting {waitMinutes(w.addedAt)}m
                      </p>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" className="h-7 px-2 text-xs gap-1 bg-green-600 hover:bg-green-700" onClick={() => seatNow(w.id)}>
                      <Check className="w-3 h-3" />Seat Now
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1" onClick={() => notifyGuest(w.name)}>
                      <Bell className="w-3 h-3" />Notify
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-red-500" onClick={() => setRemoveConfirm(w.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── NEW RESERVATION DIALOG ── */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="w-4 h-4" />New Reservation</DialogTitle>
          </DialogHeader>
          <ReservationForm form={form} onChange={handleFormChange} crmMatch={crmMatch} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button onClick={saveNew}>Create Reservation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── EDIT RESERVATION DIALOG ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Edit2 className="w-4 h-4" />Edit Reservation</DialogTitle>
          </DialogHeader>
          <ReservationForm
            form={form} onChange={handleFormChange} crmMatch={crmMatch}
            isEdit originalTable={editTarget?.table}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── REMOVE CONFIRM DIALOG ── */}
      <Dialog open={removeConfirm !== null} onOpenChange={open => { if (!open) setRemoveConfirm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600"><Trash2 className="w-4 h-4" />Remove from Waitlist</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to remove this guest from the waitlist?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => removeConfirm !== null && removeFromWaitlist(removeConfirm)}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

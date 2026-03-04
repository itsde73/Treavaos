import { useState } from "react";
import { Users, UserCheck, Clock, DollarSign, CalendarDays, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
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

// ── Types ──────────────────────────────────────────────────────────────────────
interface StaffMember {
  id: number;
  name: string;
  role: string;
  phone: string;
  email: string;
  pin: string;
  section: string;
  shift: string;
  attendance: number;
  status: "active" | "inactive";
}

interface AttendanceRecord {
  id: number;
  staffId: number;
  name: string;
  checkIn: string;
  checkOut: string;
  hours: string;
  status: "Present" | "Absent" | "Late" | "Half-day";
  punchedIn: boolean;
}

interface PerformanceRecord {
  staffId: number;
  name: string;
  tablesServed: number;
  ordersTaken: number;
  revenue: number;
  avgTicket: number;
  voidCount: number;
  tips: number;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────
const initialStaff: StaffMember[] = [
  { id: 1, name: "Arjun Sharma",    role: "Waiter",        phone: "9876543210", email: "arjun@spiceroute.in",   pin: "1234", section: "Main Hall",   shift: "Morning",   attendance: 96, status: "active" },
  { id: 2, name: "Priya Nair",      role: "Cashier",       phone: "9123456780", email: "priya@spiceroute.in",   pin: "2345", section: "Billing",     shift: "Morning",   attendance: 98, status: "active" },
  { id: 3, name: "Ravi Kumar",      role: "Chef",          phone: "9988776655", email: "ravi@spiceroute.in",    pin: "3456", section: "Kitchen",     shift: "Morning",   attendance: 99, status: "active" },
  { id: 4, name: "Sunita Patel",    role: "Manager",       phone: "9871234560", email: "sunita@spiceroute.in",  pin: "4567", section: "All",         shift: "Full Day",  attendance: 100, status: "active" },
  { id: 5, name: "Deepak Menon",    role: "Waiter",        phone: "9765432109", email: "deepak@spiceroute.in",  pin: "5678", section: "Terrace",     shift: "Afternoon", attendance: 91, status: "active" },
  { id: 6, name: "Kavitha Reddy",   role: "Bar Manager",   phone: "9654321098", email: "kavitha@spiceroute.in", pin: "6789", section: "Bar",         shift: "Evening",   attendance: 93, status: "active" },
  { id: 7, name: "Suresh Yadav",    role: "Waiter",        phone: "9543210987", email: "suresh@spiceroute.in",  pin: "7890", section: "Private",     shift: "Evening",   attendance: 88, status: "active" },
  { id: 8, name: "Meena Iyer",      role: "Store Manager", phone: "9432109876", email: "meena@spiceroute.in",   pin: "8901", section: "Store",       shift: "Morning",   attendance: 95, status: "active" },
  { id: 9, name: "Vikram Singh",    role: "Chef",          phone: "9321098765", email: "vikram@spiceroute.in",  pin: "9012", section: "Kitchen",     shift: "Afternoon", attendance: 97, status: "active" },
  { id: 10, name: "Anita Desai",   role: "Waiter",        phone: "9210987654", email: "anita@spiceroute.in",   pin: "0123", section: "Main Hall",   shift: "Afternoon", attendance: 90, status: "inactive" },
];

const initialShifts = {
  Morning:   ["Arjun Sharma", "Priya Nair", "Ravi Kumar", "Sunita Patel", "Meena Iyer"],
  Afternoon: ["Deepak Menon", "Vikram Singh", "Anita Desai"],
  Evening:   ["Kavitha Reddy", "Suresh Yadav"],
};

const initialAttendance: AttendanceRecord[] = [
  { id: 1,  staffId: 1,  name: "Arjun Sharma",  checkIn: "08:55", checkOut: "17:05", hours: "8h 10m", status: "Present",  punchedIn: true  },
  { id: 2,  staffId: 2,  name: "Priya Nair",    checkIn: "09:02", checkOut: "17:00", hours: "7h 58m", status: "Present",  punchedIn: true  },
  { id: 3,  staffId: 3,  name: "Ravi Kumar",    checkIn: "08:45", checkOut: "17:10", hours: "8h 25m", status: "Present",  punchedIn: true  },
  { id: 4,  staffId: 4,  name: "Sunita Patel",  checkIn: "09:00", checkOut: "18:00", hours: "9h 00m", status: "Present",  punchedIn: true  },
  { id: 5,  staffId: 5,  name: "Deepak Menon",  checkIn: "13:15", checkOut: "",      hours: "—",      status: "Present",  punchedIn: true  },
  { id: 6,  staffId: 6,  name: "Kavitha Reddy", checkIn: "",      checkOut: "",      hours: "—",      status: "Absent",   punchedIn: false },
  { id: 7,  staffId: 7,  name: "Suresh Yadav",  checkIn: "09:45", checkOut: "14:00", hours: "4h 15m", status: "Half-day", punchedIn: false },
  { id: 8,  staffId: 8,  name: "Meena Iyer",    checkIn: "09:30", checkOut: "17:00", hours: "7h 30m", status: "Late",     punchedIn: true  },
  { id: 9,  staffId: 9,  name: "Vikram Singh",  checkIn: "13:00", checkOut: "",      hours: "—",      status: "Present",  punchedIn: true  },
  { id: 10, staffId: 10, name: "Anita Desai",   checkIn: "",      checkOut: "",      hours: "—",      status: "Absent",   punchedIn: false },
];

const monthlySummary = [
  { name: "Arjun Sharma",  present: 23, absent: 1, late: 2, halfDay: 0 },
  { name: "Priya Nair",    present: 25, absent: 0, late: 1, halfDay: 0 },
  { name: "Ravi Kumar",    present: 26, absent: 0, late: 0, halfDay: 0 },
  { name: "Sunita Patel",  present: 26, absent: 0, late: 0, halfDay: 0 },
  { name: "Deepak Menon",  present: 22, absent: 2, late: 3, halfDay: 1 },
  { name: "Kavitha Reddy", present: 20, absent: 3, late: 2, halfDay: 1 },
  { name: "Suresh Yadav",  present: 19, absent: 4, late: 1, halfDay: 2 },
  { name: "Meena Iyer",    present: 23, absent: 1, late: 3, halfDay: 0 },
  { name: "Vikram Singh",  present: 25, absent: 1, late: 0, halfDay: 0 },
  { name: "Anita Desai",   present: 18, absent: 5, late: 2, halfDay: 1 },
];

const performanceData: PerformanceRecord[] = [
  { staffId: 1,  name: "Arjun Sharma",  tablesServed: 48, ordersTaken: 132, revenue: 58400,  avgTicket: 442,  voidCount: 2, tips: 3200 },
  { staffId: 2,  name: "Priya Nair",    tablesServed: 0,  ordersTaken: 260, revenue: 112000, avgTicket: 431,  voidCount: 1, tips: 0    },
  { staffId: 5,  name: "Deepak Menon",  tablesServed: 42, ordersTaken: 118, revenue: 51200,  avgTicket: 434,  voidCount: 4, tips: 2800 },
  { staffId: 6,  name: "Kavitha Reddy", tablesServed: 0,  ordersTaken: 95,  revenue: 43500,  avgTicket: 458,  voidCount: 1, tips: 5600 },
  { staffId: 7,  name: "Suresh Yadav",  tablesServed: 36, ordersTaken: 102, revenue: 44800,  avgTicket: 439,  voidCount: 5, tips: 2100 },
  { staffId: 10, name: "Anita Desai",   tablesServed: 30, ordersTaken: 87,  revenue: 38200,  avgTicket: 439,  voidCount: 3, tips: 1900 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

function statusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  if (status === "active" || status === "Present") return "default";
  if (status === "Late") return "outline";
  if (status === "Absent") return "destructive";
  return "secondary";
}

const currentHour = new Date().getHours();
const currentShift =
  currentHour >= 6 && currentHour < 14
    ? "Morning"
    : currentHour >= 14 && currentHour < 21
    ? "Afternoon"
    : "Evening";

// ── Component ─────────────────────────────────────────────────────────────────
export function Staff() {
  const [staffList, setStaffList] = useState<StaffMember[]>(initialStaff);
  const [shifts, setShifts] = useState(initialShifts);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [perfDateRange, setPerfDateRange] = useState({ from: "2025-06-01", to: "2025-06-26" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: "", role: "", phone: "", email: "", pin: "", section: "", status: "active" as "active" | "inactive",
  });

  // punch in / out toggle
  function handlePunch(id: number) {
    const now = new Date().toTimeString().slice(0, 5);
    setAttendance((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (!r.punchedIn) {
          return { ...r, punchedIn: true, checkIn: now, status: "Present" };
        } else {
          const [inH, inM] = r.checkIn.split(":").map(Number);
          const [outH, outM] = now.split(":").map(Number);
          const totalM = (outH * 60 + outM) - (inH * 60 + inM);
          const h = Math.floor(totalM / 60);
          const m = totalM % 60;
          return { ...r, punchedIn: false, checkOut: now, hours: `${h}h ${m}m` };
        }
      })
    );
  }

  // shift assignment
  function handleShiftAssign(shift: keyof typeof shifts, index: number, value: string) {
    setShifts((prev) => {
      const updated = [...prev[shift]];
      updated[index] = value;
      return { ...prev, [shift]: updated };
    });
  }

  // add staff member
  function handleAddStaff() {
    if (!newStaff.name || !newStaff.role) return;
    const member: StaffMember = {
      id: Math.max(0, ...staffList.map((s) => s.id)) + 1,
      name: newStaff.name,
      role: newStaff.role,
      phone: newStaff.phone,
      email: newStaff.email,
      pin: newStaff.pin,
      section: newStaff.section,
      shift: "Morning",
      attendance: 100,
      status: newStaff.status,
    };
    setStaffList((prev) => [...prev, member]);
    setNewStaff({ name: "", role: "", phone: "", email: "", pin: "", section: "", status: "active" });
    setDialogOpen(false);
  }

  const allNames = staffList.map((s) => s.name);

  return (
    <div className="p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Staff Management</h1>
          <p className="text-muted-foreground mt-1">Manage staff, shifts, attendance & performance</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>Add Staff Member</Button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Staff</p>
                <p className="text-2xl font-semibold mt-1">{staffList.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Duty Today</p>
                <p className="text-2xl font-semibold mt-1">
                  {attendance.filter((a) => a.punchedIn).length}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Attendance</p>
                <p className="text-2xl font-semibold mt-1">
                  {Math.round(staffList.reduce((s, m) => s + m.attendance, 0) / staffList.length)}%
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Payroll</p>
                <p className="text-2xl font-semibold mt-1">₹3.2L</p>
              </div>
              <DollarSign className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="staff">
        <TabsList className="mb-4">
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* ── Staff Tab ── */}
        <TabsContent value="staff">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffList.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{initials(member.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.section}</TableCell>
                      <TableCell>{member.phone}</TableCell>
                      <TableCell>{member.shift}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${member.attendance}%` }}
                            />
                          </div>
                          <span className="text-sm">{member.attendance}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.status === "active" ? "default" : "secondary"}>
                          {member.status}
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

        {/* ── Shifts Tab ── */}
        <TabsContent value="shifts">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["Morning", "Afternoon", "Evening"] as const).map((shift) => (
              <Card key={shift} className={`shadow-sm ${currentShift === shift ? "ring-2 ring-primary" : ""}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{shift} Shift</CardTitle>
                    {currentShift === shift && (
                      <Badge variant="default" className="text-xs">Current</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {shift === "Morning" ? "6:00 AM – 2:00 PM" : shift === "Afternoon" ? "2:00 PM – 9:00 PM" : "9:00 PM – 2:00 AM"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Slot</TableHead>
                        <TableHead className="text-xs">Assigned Staff</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shifts[shift].map((name, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="text-sm text-muted-foreground">#{idx + 1}</TableCell>
                          <TableCell>
                            <Select
                              value={name}
                              onValueChange={(val) => handleShiftAssign(shift, idx, val)}
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {allNames.map((n) => (
                                  <SelectItem key={n} value={n}>{n}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() =>
                      setShifts((prev) => ({ ...prev, [shift]: [...prev[shift], allNames[0]] }))
                    }
                  >
                    + Add Slot
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Attendance Tab ── */}
        <TabsContent value="attendance">
          <div className="space-y-4">
            {/* Daily log */}
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5" /> Daily Attendance Log
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff</TableHead>
                      <TableHead>Check-In</TableHead>
                      <TableHead>Check-Out</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((rec) => (
                      <TableRow key={rec.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-xs">{initials(rec.name)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{rec.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{rec.checkIn || "—"}</TableCell>
                        <TableCell className="text-sm">{rec.checkOut || "—"}</TableCell>
                        <TableCell className="text-sm">{rec.hours}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(rec.status)}>{rec.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={rec.punchedIn ? "destructive" : "default"}
                            onClick={() => handlePunch(rec.id)}
                          >
                            {rec.punchedIn ? "Punch Out" : "Punch In"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Monthly summary */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Monthly Attendance Summary – June 2025</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff</TableHead>
                      <TableHead>Present</TableHead>
                      <TableHead>Absent</TableHead>
                      <TableHead>Late</TableHead>
                      <TableHead>Half-day</TableHead>
                      <TableHead>%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlySummary.map((s) => {
                      const total = s.present + s.absent + s.late + s.halfDay;
                      const pct = Math.round((s.present / total) * 100);
                      return (
                        <TableRow key={s.name}>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell className="text-green-600 font-medium">{s.present}</TableCell>
                          <TableCell className="text-red-500 font-medium">{s.absent}</TableCell>
                          <TableCell className="text-amber-500 font-medium">{s.late}</TableCell>
                          <TableCell className="text-blue-500 font-medium">{s.halfDay}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-16 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="text-sm">{pct}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Performance Tab ── */}
        <TabsContent value="performance">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> Staff Performance
                </CardTitle>
                {/* Date range filter (UI only) */}
                <div className="flex items-center gap-2 text-sm">
                  <Label htmlFor="perf-from" className="whitespace-nowrap">From</Label>
                  <Input
                    id="perf-from"
                    type="date"
                    className="h-8 w-36"
                    value={perfDateRange.from}
                    onChange={(e) => setPerfDateRange((p) => ({ ...p, from: e.target.value }))}
                  />
                  <Label htmlFor="perf-to" className="whitespace-nowrap">To</Label>
                  <Input
                    id="perf-to"
                    type="date"
                    className="h-8 w-36"
                    value={perfDateRange.to}
                    onChange={(e) => setPerfDateRange((p) => ({ ...p, to: e.target.value }))}
                  />
                  <Button size="sm" variant="outline">Apply</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff</TableHead>
                    <TableHead>Tables Served</TableHead>
                    <TableHead>Orders Taken</TableHead>
                    <TableHead>Revenue (₹)</TableHead>
                    <TableHead>Avg Ticket (₹)</TableHead>
                    <TableHead>Voids / Cancels</TableHead>
                    <TableHead>Tips Earned (₹)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performanceData.map((p) => (
                    <TableRow key={p.staffId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs">{initials(p.name)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-sm">{p.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{p.tablesServed || "—"}</TableCell>
                      <TableCell>{p.ordersTaken}</TableCell>
                      <TableCell className="font-medium">₹{p.revenue.toLocaleString("en-IN")}</TableCell>
                      <TableCell>₹{p.avgTicket}</TableCell>
                      <TableCell>
                        <Badge variant={p.voidCount > 3 ? "destructive" : "secondary"}>{p.voidCount}</Badge>
                      </TableCell>
                      <TableCell className="text-green-600 font-medium">
                        {p.tips ? `₹${p.tips.toLocaleString("en-IN")}` : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Add Staff Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Staff Member</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 space-y-1">
              <Label htmlFor="s-name">Full Name</Label>
              <Input
                id="s-name"
                placeholder="e.g. Rahul Verma"
                value={newStaff.name}
                onChange={(e) => setNewStaff((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="s-role">Role</Label>
              <Select value={newStaff.role} onValueChange={(v) => setNewStaff((p) => ({ ...p, role: v }))}>
                <SelectTrigger id="s-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {["Waiter", "Cashier", "Manager", "Chef", "Bar Manager", "Store Manager"].map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="s-section">Section</Label>
              <Select value={newStaff.section} onValueChange={(v) => setNewStaff((p) => ({ ...p, section: v }))}>
                <SelectTrigger id="s-section">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {["Main Hall", "Terrace", "Private", "Bar", "Kitchen", "Billing", "Store", "All"].map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="s-phone">Phone</Label>
              <Input
                id="s-phone"
                placeholder="10-digit mobile"
                value={newStaff.phone}
                onChange={(e) => setNewStaff((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="s-email">Email</Label>
              <Input
                id="s-email"
                type="email"
                placeholder="staff@restaurant.in"
                value={newStaff.email}
                onChange={(e) => setNewStaff((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="s-pin">POS PIN</Label>
              <Input
                id="s-pin"
                type="password"
                maxLength={6}
                placeholder="4–6 digit PIN"
                value={newStaff.pin}
                onChange={(e) => setNewStaff((p) => ({ ...p, pin: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="s-status">Status</Label>
              <Select
                value={newStaff.status}
                onValueChange={(v) => setNewStaff((p) => ({ ...p, status: v as "active" | "inactive" }))}
              >
                <SelectTrigger id="s-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStaff}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

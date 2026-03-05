import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Store, Eye, EyeOff, Mail, Lock, ChevronLeft, MapPin, Delete } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStaff, DEMO_STAFF, type StaffMember } from "../context/StaffContext";
import { useOutlet, DEMO_OUTLETS, type Outlet } from "../context/OutletContext";

const DEMO_ACCOUNTS = [
  { email: "admin@trevaos.com",  password: "admin123", type: "super_admin" as const },
  { email: "owner@downtown.com", password: "owner123", type: "outlet_owner" as const },
  { email: "owner@mall.com",     password: "owner123", type: "outlet_owner" as const },
];

const STAFF_PINS: Record<number, string> = {
  // Demo PINs only — in production these would be hashed and stored server-side
  0: "0000",  // Admin / GM
  5: "5678",  // Manager - Suresh
  1: "1234",  // Captain - Rahul
  2: "2345",  // Captain - Priya
  3: "3456",  // Steward - Amit
  4: "4567",  // Cashier - Neha
  6: "6789",  // Chef - Ravi
  7: "7890",  // Bartender - Pooja
};

export function Login() {
  const { login, loginAsStaff, isAuthenticated, authUser } = useAuth();
  const { setCurrentStaff } = useStaff();
  const { setCurrentOutlet } = useOutlet();
  const navigate = useNavigate();

  // Tab state: "admin" | "staff"
  const [activeTab, setActiveTab] = useState<"admin" | "staff">("admin");

  // Admin/Owner login state
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  // Staff login state — step: "outlet" | "staff" | "pin"
  const [staffStep, setStaffStep]           = useState<"outlet" | "staff" | "pin">("outlet");
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);
  const [selectedStaff, setSelectedStaff]   = useState<StaffMember | null>(null);
  const [pin, setPin]                       = useState("");
  const [pinError, setPinError]             = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate(authUser?.type === "super_admin" ? "/admin" : "/", { replace: true });
    }
  }, [isAuthenticated, authUser, navigate]);

  // ── Admin/Owner handlers ──────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    const ok = login(email.trim(), password);
    setLoading(false);
    if (ok) {
      const user = DEMO_ACCOUNTS.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
      navigate(user?.type === "super_admin" ? "/admin" : "/");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  }

  function fillDemo(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  }

  // ── Staff PIN handlers ────────────────────────────────────────────

  function handleOutletSelect(outlet: Outlet) {
    setSelectedOutlet(outlet);
    setStaffStep("staff");
  }

  function handleStaffSelect(staff: StaffMember) {
    setSelectedStaff(staff);
    setPin("");
    setPinError("");
    setStaffStep("pin");
  }

  function handlePinDigit(digit: string) {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    if (newPin.length === 4) {
      // Brief delay lets React render the 4th filled dot before navigating
      setTimeout(() => verifyPin(newPin), 100);
    }
  }

  function handlePinClear() {
    setPin("");
    setPinError("");
  }

  function handlePinBackspace() {
    setPin(p => p.slice(0, -1));
    setPinError("");
  }

  function verifyPin(enteredPin: string) {
    if (!selectedStaff || !selectedOutlet) return;
    const correctPin = STAFF_PINS[selectedStaff.id];
    if (enteredPin === correctPin) {
      setCurrentStaff(selectedStaff);
      setCurrentOutlet(selectedOutlet);
      loginAsStaff(selectedStaff.name, selectedOutlet.id);
      const role = selectedStaff.role;
      if (role === "Chef" || role === "Bartender") {
        navigate("/kitchens");
      } else if (role === "Cashier") {
        navigate("/pos");
      } else {
        navigate("/");
      }
    } else {
      setPin("");
      setPinError("Incorrect PIN. Please try again.");
    }
  }

  function resetStaffFlow() {
    setStaffStep("outlet");
    setSelectedOutlet(null);
    setSelectedStaff(null);
    setPin("");
    setPinError("");
  }

  // ── Render ────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white tracking-tight">TrevaOS</h1>
              <p className="text-slate-400 text-sm">Restaurant Management System</p>
            </div>
          </div>
          <h2 className="text-slate-200 text-xl font-semibold">Welcome back</h2>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-4 bg-white/5 border border-white/10 rounded-2xl p-1.5">
          <button
            onClick={() => { setActiveTab("admin"); setError(""); }}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "admin"
                ? "bg-white/15 text-white border border-white/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Admin / Owner
          </button>
          <button
            onClick={() => { setActiveTab("staff"); resetStaffFlow(); }}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "staff"
                ? "bg-white/15 text-white border border-white/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Staff Login
          </button>
        </div>

        {/* ── Admin / Owner tab ── */}
        {activeTab === "admin" && (
          <>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white/10 border border-white/15 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                    <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/10 border border-white/15 text-white placeholder-slate-500 rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-primary focus:ring-primary"
                  />
                  <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">Remember me</label>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading}
                  className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-150 shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : "Sign In"}
                </button>
              </form>

              <p className="text-center text-sm text-slate-400 mt-5">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Register
                </Link>
              </p>
            </div>

            {/* Demo credentials */}
            <div className="mt-5 bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-xs text-slate-400 font-medium mb-3 uppercase tracking-wider">Demo Accounts</p>
              <div className="space-y-2">
                {[
                  { label: "Super Admin",                    email: "admin@trevaos.com",  password: "admin123" },
                  { label: "Outlet Owner (Downtown Bistro)", email: "owner@downtown.com", password: "owner123" },
                  { label: "Outlet Owner (Mall Express)",    email: "owner@mall.com",     password: "owner123" },
                ].map(d => (
                  <button key={d.email} onClick={() => fillDemo(d.email, d.password)}
                    className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-2 transition-colors text-left">
                    <div>
                      <p className="text-xs font-medium text-slate-300">{d.label}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{d.email}</p>
                    </div>
                    <span className="text-[11px] text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-lg">{d.password}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Staff Login tab ── */}
        {activeTab === "staff" && (
          <>
            {/* Step 1: Select Outlet */}
            {staffStep === "outlet" && (
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-white font-semibold text-base mb-1">Select Your Outlet</h3>
                <p className="text-slate-400 text-sm mb-4">Choose the outlet you're logging into</p>
                <div className="grid grid-cols-2 gap-3">
                  {DEMO_OUTLETS.map(outlet => (
                    <button
                      key={outlet.id}
                      onClick={() => handleOutletSelect(outlet)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-4 text-left transition-all group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-colors">
                        <Store className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-white text-sm font-semibold leading-tight">{outlet.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <p className="text-slate-500 text-[11px] truncate">{outlet.address}</p>
                      </div>
                      <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        outlet.status === "open" ? "bg-green-500/15 text-green-400" :
                        outlet.status === "pre-open" ? "bg-yellow-500/15 text-yellow-400" :
                        "bg-slate-500/15 text-slate-400"
                      }`}>
                        {outlet.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Select Staff */}
            {staffStep === "staff" && selectedOutlet && (
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setStaffStep("outlet")} className="text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-white font-semibold text-base leading-none">Select Staff Profile</h3>
                    <p className="text-slate-400 text-xs mt-0.5">{selectedOutlet.name}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {DEMO_STAFF.map(staff => (
                    <button
                      key={staff.id}
                      onClick={() => handleStaffSelect(staff)}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-4 text-left transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/30 transition-colors">
                        <span className="text-primary font-bold text-sm">{staff.avatar}</span>
                      </div>
                      <p className="text-white text-sm font-semibold leading-tight truncate">{staff.name}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">{staff.role}</p>
                      {staff.section && (
                        <p className="text-slate-500 text-[10px] mt-0.5">{staff.section}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Enter PIN */}
            {staffStep === "pin" && selectedStaff && selectedOutlet && (
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-5">
                  <button onClick={() => { setStaffStep("staff"); setPin(""); setPinError(""); }} className="text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="text-white font-semibold text-base leading-none">Enter PIN</h3>
                    <p className="text-slate-400 text-xs mt-0.5">{selectedOutlet.name}</p>
                  </div>
                </div>

                {/* Staff profile display */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-3">
                    <span className="text-primary font-bold text-xl">{selectedStaff.avatar}</span>
                  </div>
                  <p className="text-white font-semibold">{selectedStaff.name}</p>
                  <p className="text-slate-400 text-sm">{selectedStaff.role}</p>
                </div>

                {/* PIN dots */}
                <div className="flex justify-center gap-4 mb-2">
                  {[0, 1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        i < pin.length
                          ? "bg-primary border-primary"
                          : "bg-transparent border-white/30"
                      }`}
                    />
                  ))}
                </div>

                {/* PIN error */}
                {pinError && (
                  <p className="text-center text-red-400 text-xs mb-3">{pinError}</p>
                )}

                {/* Numpad */}
                <div className="grid grid-cols-3 gap-2 mt-5">
                  {["1","2","3","4","5","6","7","8","9"].map(d => (
                    <button
                      key={d}
                      onClick={() => handlePinDigit(d)}
                      className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-semibold text-xl transition-all"
                    >
                      {d}
                    </button>
                  ))}
                  <button
                    onClick={handlePinClear}
                    className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-slate-400 text-sm font-medium transition-all"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => handlePinDigit("0")}
                    className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-semibold text-xl transition-all"
                  >
                    0
                  </button>
                  <button
                    onClick={handlePinBackspace}
                    className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-white/20 text-slate-400 flex items-center justify-center transition-all"
                  >
                    <Delete className="w-5 h-5" />
                  </button>
                </div>

                {/* Demo hint */}
                <div className="mt-4 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-center">
                  <p className="text-[11px] text-slate-500">
                    Demo PIN for <span className="text-slate-400 font-medium">{selectedStaff.name}</span>:{" "}
                    <span className="text-primary font-mono font-semibold">{STAFF_PINS[selectedStaff.id]}</span>
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        <p className="text-center text-slate-500 text-xs mt-5">
          TrevaOS v1.0 · Restaurant Management Platform · © 2026
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Store, ShieldCheck, ChefHat, Wine, UserCheck, CreditCard, Crown } from "lucide-react";
import { useStaff, DEMO_STAFF, type StaffMember } from "../context/StaffContext";

const ROLE_META: Record<string, { icon: any; color: string; bg: string; desc: string }> = {
  Admin:     { icon: Crown,      color: "text-red-600",    bg: "bg-red-50 border-red-200",     desc: "Full system access"          },
  Manager:   { icon: ShieldCheck,color: "text-purple-600", bg: "bg-purple-50 border-purple-200",desc: "Full access except settings" },
  Captain:   { icon: UserCheck,  color: "text-blue-600",   bg: "bg-blue-50 border-blue-200",   desc: "Orders, tables & billing"    },
  Steward:   { icon: UserCheck,  color: "text-cyan-600",   bg: "bg-cyan-50 border-cyan-200",   desc: "Take orders only"            },
  Cashier:   { icon: CreditCard, color: "text-green-600",  bg: "bg-green-50 border-green-200", desc: "Bill & payment only"         },
  Chef:      { icon: ChefHat,    color: "text-orange-600", bg: "bg-orange-50 border-orange-200",desc: "Kitchen KDS access"          },
  Bartender: { icon: Wine,       color: "text-violet-600", bg: "bg-violet-50 border-violet-200",desc: "Bar KDS access"              },
};

// Demo PIN map
const STAFF_PINS: Record<number, string> = {
  0: "0000",  // Admin
  5: "5678",  // Manager
  1: "1234",  // Rahul - Captain
  2: "2345",  // Priya - Captain
  3: "3456",  // Amit - Steward
  4: "4567",  // Neha - Cashier
  6: "6789",  // Ravi - Chef
  7: "7890",  // Pooja - Bartender
};

export function Login() {
  const { setCurrentStaff } = useStaff();
  const navigate = useNavigate();
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"select" | "pin">("select");

  function handleSelectStaff(staff: StaffMember) {
    setSelectedStaff(staff);
    setPin("");
    setError("");
    setStep("pin");
  }

  function handlePinInput(digit: string) {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) handleLogin(newPin);
    }
  }

  function handleLogin(enteredPin?: string) {
    const p = enteredPin ?? pin;
    if (!selectedStaff) return;
    const correct = STAFF_PINS[selectedStaff.id];
    if (p === correct) {
      setCurrentStaff(selectedStaff);
      // Navigate based on role
      if (selectedStaff.role === "Chef" || selectedStaff.role === "Bartender") {
        navigate("/kitchens");
      } else if (selectedStaff.role === "Cashier") {
        navigate("/pos");
      } else {
        navigate("/");
      }
    } else {
      setError("Incorrect PIN. Please try again.");
      setPin("");
    }
  }

  function handleBack() {
    setStep("select");
    setPin("");
    setError("");
    setSelectedStaff(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white tracking-tight">TrevaOS</h1>
              <p className="text-slate-400 text-sm">Restaurant Management System</p>
            </div>
          </div>
          <h2 className="text-slate-300 text-lg">
            {step === "select" ? "Select your profile to sign in" : "Enter your PIN"}
          </h2>
        </div>

        {/* Step 1: Staff selection */}
        {step === "select" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {DEMO_STAFF.map(staff => {
              const meta = ROLE_META[staff.role];
              const Icon = meta.icon;
              return (
                <button key={staff.id} onClick={() => handleSelectStaff(staff)}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-black/30">
                  {/* Avatar */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold border-2 transition-all ${meta.bg} ${meta.color}`}>
                    {staff.avatar}
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold text-sm leading-tight">{staff.name}</p>
                    <div className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${meta.bg} ${meta.color}`}>
                      <Icon className="w-3 h-3" />{staff.role}
                    </div>
                    {staff.section && <p className="text-slate-400 text-xs mt-1">{staff.section}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: PIN entry */}
        {step === "pin" && selectedStaff && (
          <div className="flex justify-center">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
              {/* Selected staff */}
              <div className="flex flex-col items-center gap-3 mb-8">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold border-2 ${ROLE_META[selectedStaff.role].bg} ${ROLE_META[selectedStaff.role].color}`}>
                  {selectedStaff.avatar}
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg">{selectedStaff.name}</p>
                  <p className="text-slate-400 text-sm">{selectedStaff.role}{selectedStaff.section ? ` · ${selectedStaff.section}` : ""}</p>
                </div>
              </div>

              {/* PIN dots */}
              <div className="flex justify-center gap-4 mb-6">
                {[0,1,2,3].map(i => (
                  <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-200
                    ${i < pin.length ? "bg-primary border-primary scale-110" : "border-white/30"}`} />
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2 text-red-400 text-sm text-center mb-4">
                  {error}
                </div>
              )}

              {/* PIN pad */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {["1","2","3","4","5","6","7","8","9"].map(d => (
                  <button key={d} onClick={() => handlePinInput(d)}
                    className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xl transition-all duration-150 border border-white/10">
                    {d}
                  </button>
                ))}
                <button onClick={() => setPin("")}
                  className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-medium transition-all border border-white/10">
                  Clear
                </button>
                <button onClick={() => handlePinInput("0")}
                  className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-xl transition-all duration-150 border border-white/10">
                  0
                </button>
                <button onClick={() => setPin(p => p.slice(0, -1))}
                  className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 text-xl font-bold transition-all border border-white/10">
                  ⌫
                </button>
              </div>

              <button onClick={() => handleLogin()}
                disabled={pin.length < 4}
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-lg transition-all duration-150 shadow-lg shadow-primary/30">
                Sign In
              </button>

              <button onClick={handleBack} className="w-full mt-3 text-slate-400 hover:text-white text-sm transition-colors">
                ← Back to staff selection
              </button>

              {/* Demo hint */}
              <div className="mt-5 p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-400 text-center">
                Demo PIN for <span className="text-white font-medium">{selectedStaff.name}</span>:
                <span className="ml-2 font-mono text-primary font-bold">{STAFF_PINS[selectedStaff.id]}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8">
          TrevaOS v1.0 · Restaurant Management Platform · © 2026
        </p>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Store, Eye, EyeOff, User, Mail, Phone, Lock, Building2, ChevronDown } from "lucide-react";
import { useAuth, type RegisterData } from "../context/AuthContext";

const OUTLET_OPTIONS = ["1", "2-5", "5-10", "10+"];

export function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterData>({
    fullName: "", email: "", phone: "", password: "",
    restaurantName: "", numOutlets: "1",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  function update(field: keyof RegisterData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    const ok = register(form);
    setLoading(false);

    if (ok) {
      navigate("/login?registered=1");
    } else {
      setError("Registration failed. Please try again.");
    }
  }

  const inputClass =
    "w-full bg-white/10 border border-white/15 text-white placeholder-slate-500 rounded-xl py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
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
          <h2 className="text-slate-200 text-xl font-semibold">Create your account</h2>
          <p className="text-slate-400 text-sm mt-1">Get started with TrevaOS today</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" required value={form.fullName}
                  onChange={e => update("fullName", e.target.value)}
                  placeholder="John Doe"
                  className={`${inputClass} pl-10 pr-4`} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" required value={form.email}
                  onChange={e => update("email", e.target.value)}
                  placeholder="you@example.com"
                  className={`${inputClass} pl-10 pr-4`} />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="tel" required value={form.phone}
                  onChange={e => update("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className={`${inputClass} pl-10 pr-4`} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPw ? "text" : "password"} required value={form.password}
                  onChange={e => update("password", e.target.value)}
                  placeholder="Min. 6 characters"
                  className={`${inputClass} pl-10 pr-12`} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showConfirm ? "text" : "password"} required value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError(""); }}
                  placeholder="Repeat password"
                  className={`${inputClass} pl-10 pr-12`} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Restaurant Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Restaurant / Brand Name</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" required value={form.restaurantName}
                  onChange={e => update("restaurantName", e.target.value)}
                  placeholder="My Restaurant"
                  className={`${inputClass} pl-10 pr-4`} />
              </div>
            </div>

            {/* Number of Outlets */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Number of Outlets</label>
              <div className="relative">
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <select value={form.numOutlets} onChange={e => update("numOutlets", e.target.value)}
                  className={`${inputClass} px-4 appearance-none cursor-pointer`}>
                  {OUTLET_OPTIONS.map(o => (
                    <option key={o} value={o} className="bg-slate-800 text-white">{o}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-150 shadow-lg shadow-primary/30 flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Login
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-500 text-xs mt-5">
          TrevaOS v1.0 · Restaurant Management Platform · © 2026
        </p>
      </div>
    </div>
  );
}

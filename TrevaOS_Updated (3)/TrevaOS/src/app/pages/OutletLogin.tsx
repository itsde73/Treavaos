import { useNavigate } from "react-router";
import { MapPin, Store, Users, TableProperties, ArrowRight, BarChart2 } from "lucide-react";
import { DEMO_OUTLETS, useOutlet, type Outlet } from "../context/OutletContext";

function StatusBadge({ status }: { status: Outlet["status"] }) {
  if (status === "open") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
        Open
      </span>
    );
  }
  if (status === "pre-open") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Pre-Open
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
      Closed
    </span>
  );
}

export function OutletLogin() {
  const navigate = useNavigate();
  const { setCurrentOutlet } = useOutlet();

  function handleEnterOutlet(outlet: Outlet) {
    setCurrentOutlet(outlet);
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6">
      {/* Background dot pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white tracking-tight">TrevaOS</h1>
              <p className="text-slate-400 text-sm">Multi-Outlet Restaurant Platform</p>
            </div>
          </div>
          <h2 className="text-slate-200 text-xl font-semibold">Select Your Outlet</h2>
          <p className="text-slate-400 text-sm mt-1">Choose the outlet you want to manage</p>
        </div>

        {/* Outlet cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
          {DEMO_OUTLETS.map((outlet) => (
            <div
              key={outlet.id}
              className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:shadow-xl hover:shadow-black/30"
            >
              {/* Top row: name + status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-white text-lg font-bold leading-tight">{outlet.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-slate-400 text-sm">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    {outlet.address}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <StatusBadge status={outlet.status} />
                  <span className="text-xs text-slate-400 bg-white/10 px-2 py-0.5 rounded-full">
                    {outlet.type}
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl px-3 py-2 flex items-center gap-2">
                  <TableProperties className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-white font-semibold text-sm">{outlet.tables}</p>
                    <p className="text-slate-400 text-xs">Tables</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-white font-semibold text-sm">{outlet.staffOnDuty}</p>
                    <p className="text-slate-400 text-xs">Staff On-Duty</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl px-3 py-2 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-white font-semibold text-sm">
                      ₹{(outlet.todayRevenue / 1000).toFixed(0)}K
                    </p>
                    <p className="text-slate-400 text-xs">Today's Revenue</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Store className="w-4 h-4 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-white font-semibold text-sm">{outlet.todayOrders}</p>
                    <p className="text-slate-400 text-xs">Today's Orders</p>
                  </div>
                </div>
              </div>

              {/* Enter button */}
              <button
                onClick={() => handleEnterOutlet(outlet)}
                className="mt-auto w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all duration-150 shadow-lg shadow-primary/20 group-hover:shadow-primary/40"
              >
                Enter Outlet
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-8">
          TrevaOS v1.0 · Multi-Outlet Restaurant Platform · © 2026
        </p>
      </div>
    </div>
  );
}

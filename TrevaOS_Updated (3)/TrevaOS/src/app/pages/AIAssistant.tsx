import { useState } from "react";
import { Sparkles, Send, TrendingUp, AlertTriangle, Lightbulb, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";

const suggestions = [
  { icon: TrendingUp, title: "Revenue Insight", message: "Your Saturday dinner service generates 38% of weekly revenue. Consider extending Saturday hours by 1 hour.", type: "insight" },
  { icon: AlertTriangle, title: "Low Stock Alert", message: "Based on current orders, Chicken will run out in ~4 hours. Recommend placing emergency order with Meat Masters.", type: "alert" },
  { icon: Lightbulb, title: "Menu Suggestion", message: "Margherita Pizza has 89% order completion rate. Consider adding a Premium variant at ₹50 more.", type: "suggestion" },
  { icon: BarChart2, title: "Staff Optimization", message: "Thursday 8–10 PM has highest table wait times. Deploying 1 extra steward could reduce wait by 40%.", type: "insight" },
];

const quickPrompts = [
  "What was our best-selling item this week?",
  "Show me tables with longest wait times today",
  "Which staff member has the highest upsell rate?",
  "Predict tonight's revenue",
  "Which menu items should I 86 based on stock?",
];

const badgeStyle: Record<string, string> = {
  insight: "bg-blue-100 text-blue-700",
  alert: "bg-red-100 text-red-700",
  suggestion: "bg-green-100 text-green-700",
};

const chatHistory = [
  { role: "user", content: "What were our top 3 selling items yesterday?" },
  { role: "assistant", content: "Yesterday's top 3 items were:\n1. **Margherita Pizza** — 47 orders (₹9,400)\n2. **Chicken Burger** — 38 orders (₹6,840)\n3. **Pasta Alfredo** — 31 orders (₹6,820)\n\nThese 3 items together contributed 42% of yesterday's total revenue of ₹54,200." },
  { role: "user", content: "Any recommendations to boost dinner revenue?" },
  { role: "assistant", content: "Here are 3 data-backed recommendations:\n\n1. **Happy Hour Bundle** — Your 7–8 PM slot has 60% table occupancy. A drink + starter combo at ₹299 could increase average cover by ₹120.\n\n2. **Dessert Upsell** — Only 18% of tables order dessert. Training captains to suggest it after mains could add ₹3,000–4,000/day.\n\n3. **Pre-booking Push** — 34% of Friday tables are walk-ins. An advance booking discount of 10% can spread load better and reduce kitchen pressure." },
];

export function AIAssistant() {
  const [input, setInput] = useState("");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2"><Sparkles className="w-6 h-6 text-purple-500" />AI Assistant</h1>
          <p className="text-muted-foreground text-sm mt-1">Powered by your restaurant data — get insights, predictions & recommendations</p>
        </div>
        <Badge className="bg-purple-100 text-purple-700 gap-1"><Sparkles className="w-3 h-3" />Enabled</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {suggestions.map((s, i) => (
          <Card key={i} className="shadow-sm border-l-4 border-l-purple-300">
            <CardContent className="py-3 px-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <s.icon className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{s.title}</span>
                    <Badge className={`text-xs ${badgeStyle[s.type]}`}>{s.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="w-4 h-4 text-purple-500" />Chat with AI</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="h-72 overflow-y-auto space-y-3 bg-muted/20 rounded-lg p-4">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-white border border-border"}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((p, i) => (
              <Button key={i} variant="outline" size="sm" className="text-xs h-7" onClick={() => setInput(p)}>{p}</Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="Ask anything about your restaurant..." value={input} onChange={e => setInput(e.target.value)} className="h-9 text-sm" onKeyDown={e => e.key === "Enter" && setInput("")} />
            <Button size="sm" className="gap-1.5 px-4" onClick={() => setInput("")}><Send className="w-3.5 h-3.5" />Send</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

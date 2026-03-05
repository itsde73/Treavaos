import { Settings, Bell, Shield, Globe, CreditCard, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

const SETTING_SECTIONS = [
  {
    icon: Globe,
    title: "Platform Settings",
    description: "Configure general platform settings, domain, and branding",
    color: "text-blue-500",
  },
  {
    icon: Bell,
    title: "Notification Settings",
    description: "Manage email, SMS, and push notification preferences",
    color: "text-amber-500",
  },
  {
    icon: Shield,
    title: "Security & Access",
    description: "Two-factor authentication, IP whitelisting, session management",
    color: "text-red-500",
  },
  {
    icon: CreditCard,
    title: "Billing Configuration",
    description: "Payment gateways, invoice templates, tax settings",
    color: "text-green-500",
  },
  {
    icon: Palette,
    title: "Appearance",
    description: "Platform theme, logo, and white-labeling options",
    color: "text-purple-500",
  },
];

export function SuperAdminSettings() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Configure global settings for the TrevaOS platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {SETTING_SECTIONS.map(section => (
          <Card key={section.title} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg bg-muted flex items-center justify-center`}>
                  <section.icon className={`w-5 h-5 ${section.color}`} />
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{section.description}</p>
              <Button size="sm" variant="outline" className="text-xs">Configure</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="pt-6 flex flex-col items-center text-center py-10">
          <Settings className="w-10 h-10 text-muted-foreground mb-3" />
          <p className="font-medium text-muted-foreground">More settings coming soon</p>
          <p className="text-sm text-muted-foreground mt-1">Additional platform configuration options will be available in future updates.</p>
        </CardContent>
      </Card>
    </div>
  );
}

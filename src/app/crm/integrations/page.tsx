import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const integrations = [
  { name: "WhatsApp Business", desc: "Send messages to leads via WhatsApp", connected: true },
  { name: "Google Calendar", desc: "Sync appointments with Google Calendar", connected: true },
  { name: "Zapier", desc: "Automate workflows with 5000+ apps", connected: false },
  { name: "Mailchimp", desc: "Email marketing automation", connected: false },
  { name: "99acres", desc: "Sync property listings", connected: true },
  { name: "MagicBricks", desc: "Import leads from MagicBricks", connected: false },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Integrations</h2>
        <p className="text-sm text-slate-500">Connect your favorite tools</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {integrations.map((item) => (
          <Card key={item.name} className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900">{item.name}</p>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
            {item.connected ? (
              <Badge variant="success">Connected</Badge>
            ) : (
              <Button variant="outline" size="sm">Connect</Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

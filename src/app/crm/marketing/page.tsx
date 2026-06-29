import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const campaigns = [
  { id: "1", name: "Summer Property Launch", type: "Email", status: "active", budget: 5000 },
  { id: "2", name: "Social Media Ads Q2", type: "Social", status: "active", budget: 8000 },
  { id: "3", name: "Google Ads - Luxury Homes", type: "PPC", status: "draft", budget: 12000 },
];

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Marketing</h2>
          <p className="text-sm text-slate-500">Campaign management</p>
        </div>
        <Button><Plus className="h-4 w-4" />New Campaign</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {campaigns.map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-slate-900">{c.name}</h3>
              <Badge variant={c.status === "active" ? "success" : "default"}>{c.status}</Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">{c.type}</p>
            <p className="mt-2 text-lg font-bold text-[#4F6BF5]">${c.budget.toLocaleString()}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

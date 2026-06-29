import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { dealPipeline } from "@/lib/mock-data";
import { DEAL_STAGES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export default function DealsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Deals</h2>
          <p className="text-sm text-slate-500">Manage your sales pipeline</p>
        </div>
        <Button><Plus className="h-4 w-4" />New Deal</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {DEAL_STAGES.map((stage) => {
          const data = dealPipeline.find((d) => d.stage === stage.key);
          return (
            <Card key={stage.key}>
              <div className="mb-3 flex items-center gap-2">
                <span className={`h-3 w-3 rounded-full ${stage.color}`} />
                <h3 className="font-semibold text-slate-900">{stage.label}</h3>
              </div>
              <p className="text-2xl font-bold text-slate-900">{data?.count ?? 0}</p>
              <p className="text-sm text-slate-500">{formatCurrency(data?.value ?? 0)} total value</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface PipelineItem {
  stage: string;
  label: string;
  count: number;
  value: number;
  percent: number;
}

interface DealPipelineProps {
  data: PipelineItem[];
}

export function DealPipeline({ data }: DealPipelineProps) {
  const empty = data.every((d) => d.count === 0);

  return (
    <Card className="crm-card border-slate-100/80">
      <CardHeader>
        <div>
          <CardTitle className="text-lg">Lead Pipeline</CardTitle>
          <p className="mt-0.5 text-xs text-slate-400">Stage-wise from live leads</p>
        </div>
      </CardHeader>
      {empty ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-400">
          No leads in pipeline yet
        </div>
      ) : (
        <ul className="space-y-4">
          {data.filter((d) => d.count > 0).map((item) => (
            <li key={item.stage}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-800">{item.label}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-600">{item.count} leads</span>
                  {item.value > 0 && (
                    <span className="font-bold text-violet-700">{formatCurrency(item.value)}</span>
                  )}
                </div>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
                  style={{ width: `${Math.max(item.percent, 4)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

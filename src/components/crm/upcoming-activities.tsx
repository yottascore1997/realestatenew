import { Calendar, Users, Phone, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const typeConfig = {
  PROPERTY_SHOWING: { icon: Calendar, bg: "bg-violet-100", color: "text-violet-600" },
  CLIENT_MEETING: { icon: Users, bg: "bg-indigo-100", color: "text-indigo-600" },
  FOLLOW_UP_CALL: { icon: Phone, bg: "bg-emerald-100", color: "text-emerald-600" },
  DOCUMENT_SIGNING: { icon: FileText, bg: "bg-amber-100", color: "text-amber-600" },
};

interface Activity {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  type: keyof typeof typeConfig;
}

interface UpcomingActivitiesProps {
  data: Activity[];
}

export function UpcomingActivities({ data }: UpcomingActivitiesProps) {
  return (
    <Card className="crm-card border-slate-100/80">
      <CardHeader>
        <div>
          <CardTitle className="text-lg">Upcoming Activities</CardTitle>
          <p className="mt-0.5 text-xs text-slate-400">Site visits & follow-ups</p>
        </div>
      </CardHeader>
      {data.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-400">
          No upcoming follow-ups or site visits
        </div>
      ) : (
        <ul className="space-y-2">
          {data.map((activity) => {
            const config = typeConfig[activity.type] ?? typeConfig.FOLLOW_UP_CALL;
            const Icon = config.icon;
            return (
              <li key={activity.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-all hover:border-violet-100 hover:bg-violet-50/30">
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm", config.bg)}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                  <p className="truncate text-xs text-slate-500">{activity.subtitle}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-violet-700 ring-1 ring-violet-100">
                  {activity.time}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

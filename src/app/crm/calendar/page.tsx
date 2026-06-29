import { Card } from "@/components/ui/card";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dates = Array.from({ length: 35 }, (_, i) => i + 1);

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Calendar</h2>
        <p className="text-sm text-slate-500">June 2026</p>
      </div>
      <Card>
        <div className="mb-4 grid grid-cols-7 gap-1">
          {days.map((d) => (
            <div key={d} className="py-2 text-center text-xs font-semibold text-slate-500">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {dates.map((date) => (
            <div
              key={date}
              className={`flex h-16 items-start justify-center rounded-lg p-2 text-sm ${
                date === 23 ? "bg-[#4F6BF5] font-bold text-white" : "hover:bg-slate-50 text-slate-700"
              }`}
            >
              {date <= 30 ? date : date - 30}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

import { Card } from "@/components/ui/card";

const messages = [
  { id: "1", from: "Michael Chen", subject: "Property inquiry", preview: "I'm interested in the Modern Family Home...", time: "2h ago", unread: true },
  { id: "2", from: "Emily Rodriguez", subject: "Meeting confirmation", preview: "Confirmed for tomorrow at 2:30 PM", time: "5h ago", unread: true },
  { id: "3", from: "David Thompson", subject: "Budget discussion", preview: "Can we discuss the pricing options?", time: "1d ago", unread: false },
];

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Messages</h2>
        <p className="text-sm text-slate-500">12 unread messages</p>
      </div>
      <Card className="divide-y divide-slate-100 p-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-4 px-5 py-4 hover:bg-slate-50 ${msg.unread ? "bg-blue-50/50" : ""}`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4F6BF5] text-sm font-bold text-white">
              {msg.from[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className={`text-sm ${msg.unread ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}>{msg.from}</p>
                <span className="text-xs text-slate-400">{msg.time}</span>
              </div>
              <p className="text-sm font-medium text-slate-800">{msg.subject}</p>
              <p className="text-sm text-slate-500">{msg.preview}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const contacts = [
  { id: "1", name: "Michael Chen", email: "michael.chen@email.com", phone: "+1 555-0101", company: "Tech Corp", avatar: "https://i.pravatar.cc/150?u=michael" },
  { id: "2", name: "Emily Rodriguez", email: "emily.r@email.com", phone: "+1 555-0102", company: "Design Studio", avatar: "https://i.pravatar.cc/150?u=emily" },
  { id: "3", name: "David Thompson", email: "david.t@email.com", phone: "+1 555-0103", company: "Finance Inc", avatar: "https://i.pravatar.cc/150?u=david" },
];

export default function ContactsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Contacts</h2>
          <p className="text-sm text-slate-500">Your CRM contact directory</p>
        </div>
        <Button><Plus className="h-4 w-4" />Add Contact</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {contacts.map((c) => (
          <Card key={c.id} className="flex items-center gap-4">
            <img src={c.avatar} alt="" className="h-12 w-12 rounded-full" />
            <div>
              <p className="font-semibold text-slate-900">{c.name}</p>
              <p className="text-sm text-slate-500">{c.email}</p>
              <p className="text-xs text-slate-400">{c.company}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

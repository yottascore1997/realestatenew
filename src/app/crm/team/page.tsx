import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const team = [
  { id: "1", name: "Sarah Johnson", email: "sarah@estatepro.com", role: "ADMIN", avatar: "https://i.pravatar.cc/150?u=sarahjohnson" },
  { id: "2", name: "James Wilson", email: "james@estatepro.com", role: "AGENT", avatar: "https://i.pravatar.cc/150?u=james" },
  { id: "3", name: "Lisa Park", email: "lisa@estatepro.com", role: "MANAGER", avatar: "https://i.pravatar.cc/150?u=lisa" },
];

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Team</h2>
          <p className="text-sm text-slate-500">Manage your team members</p>
        </div>
        <Button><Plus className="h-4 w-4" />Invite Member</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {team.map((member) => (
          <Card key={member.id} className="text-center">
            <img src={member.avatar} alt="" className="mx-auto h-16 w-16 rounded-full" />
            <p className="mt-3 font-semibold text-slate-900">{member.name}</p>
            <p className="text-sm text-slate-500">{member.email}</p>
            <Badge className="mt-2" variant="info">{member.role}</Badge>
          </Card>
        ))}
      </div>
    </div>
  );
}

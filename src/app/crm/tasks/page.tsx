import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tasks = [
  { id: "1", title: "Follow up with Michael Chen", priority: "HIGH", status: "TODO", due: "Today" },
  { id: "2", title: "Prepare property documents", priority: "MEDIUM", status: "IN_PROGRESS", due: "Tomorrow" },
  { id: "3", title: "Schedule site visit", priority: "URGENT", status: "TODO", due: "Jun 24" },
  { id: "4", title: "Send proposal to Emily", priority: "HIGH", status: "COMPLETED", due: "Jun 22" },
];

const priorityVariant: Record<string, "danger" | "warning" | "info" | "default"> = {
  URGENT: "danger",
  HIGH: "warning",
  MEDIUM: "info",
  LOW: "default",
};

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>
          <p className="text-sm text-slate-500">Stay on top of your to-dos</p>
        </div>
        <Button><Plus className="h-4 w-4" />Add Task</Button>
      </div>
      <Card className="divide-y divide-slate-100 p-0">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={task.status === "COMPLETED"} readOnly className="h-4 w-4 rounded" />
              <span className={task.status === "COMPLETED" ? "text-slate-400 line-through" : "font-medium text-slate-900"}>
                {task.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
              <span className="text-sm text-slate-500">{task.due}</span>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

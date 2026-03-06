import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Calendar } from "lucide-react";
import type { TaskGroup } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  group: TaskGroup;
}

export function TaskCard({ group }: TaskCardProps) {
  const completedCount = group.subtasks.filter((t) => t.completed).length;
  const totalCount = group.subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <span>{group.emoji}</span>
            <span>{group.title}</span>
          </CardTitle>
          <div className="flex-shrink-0">
            <StatusBadge status={group.status} progress={progress} />
          </div>
        </div>
        {group.description && (
          <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
        )}
        {totalCount > 0 && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{completedCount} / {totalCount} 完成</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div
                className="bg-accent rounded-full h-1.5 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {group.subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className={cn(
              "flex items-start gap-2 py-1.5 px-2 rounded-md",
              subtask.completed ? "opacity-50" : "hover:bg-muted/50"
            )}
          >
            {subtask.completed ? (
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
            ) : (
              <Circle className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm", subtask.completed && "line-through text-muted-foreground")}>
                {subtask.text}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {subtask.tags.map((tag) => (
                  <Badge key={tag} variant="accent" className="text-xs px-1.5 py-0">
                    #{tag}
                  </Badge>
                ))}
                {subtask.date && (
                  <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {subtask.date}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status, progress }: { status: TaskGroup["status"]; progress: number }) {
  if (status === "idea") {
    return (
      <span className="text-xs font-medium px-2 py-0.5 rounded-full border bg-purple-50 text-purple-700 border-purple-200">
        構思中
      </span>
    );
  }

  const derived =
    progress === 100 ? "done" : progress === 0 ? "pending" : "todo";

  const config = {
    todo:    { label: "進行中", className: "bg-accent-light text-accent border-accent/20" },
    done:    { label: "完成",   className: "bg-green-50 text-green-700 border-green-200" },
    pending: { label: "待開始", className: "bg-gray-50 text-gray-500 border-gray-200" },
  };
  const { label, className } = config[derived];
  return (
    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap", className)}>
      {label}
    </span>
  );
}

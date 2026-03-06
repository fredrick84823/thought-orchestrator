import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import type { IdeaItem } from "@/types/task";

interface IdeaCardProps {
  idea: IdeaItem;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <Card className="border-dashed hover:shadow-sm transition-shadow duration-200">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">{idea.title}</p>
            {idea.description && (
              <p className="text-xs text-muted-foreground mt-0.5">{idea.description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export type TaskStatus = "todo" | "done" | "idea";

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
  tags: string[];
  date: string | null;
}

export interface TaskGroup {
  id: string;
  title: string;
  emoji: string;
  status: TaskStatus;
  description: string;
  subtasks: SubTask[];
}

export interface ParsedTodo {
  title: string;
  quotes: string[];
  groups: TaskGroup[];
  ideas: IdeaItem[];
  lastUpdated: string | null;
}

export interface IdeaItem {
  id: string;
  title: string;
  description: string;
}

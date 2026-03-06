import { promises as fs } from "fs";
import path from "path";
import { parseTodoMarkdown } from "@/lib/task-parser";
import { fetchTodoFromGitHub } from "@/lib/github-fetcher";
import { TaskCard } from "@/components/TaskCard";
import { IdeaCard } from "@/components/IdeaCard";
import { Brain, RefreshCw, Github } from "lucide-react";

type DataSource = "github" | "local";

async function getTasks(): Promise<{ content: string; source: DataSource }> {
  // 優先從 GitHub thoughts repo 讀取
  if (process.env.GITHUB_TOKEN) {
    try {
      const content = await fetchTodoFromGitHub();
      return { content, source: "github" };
    } catch (err) {
      console.warn("[getTasks] GitHub 讀取失敗，切換為本地 fallback：", err);
    }
  }

  // Fallback：讀本地 TODO.md
  const todoPath = path.join(process.cwd(), "TODO.md");
  const content = await fs.readFile(todoPath, "utf-8");
  return { content, source: "local" };
}

export default async function Home() {
  const { content, source } = await getTasks();
  const data = parseTodoMarkdown(content);

  const totalSubtasks = data.groups.reduce((acc, g) => acc + g.subtasks.length, 0);
  const completedSubtasks = data.groups.reduce(
    (acc, g) => acc + g.subtasks.filter((t) => t.completed).length,
    0
  );
  const overallProgress = totalSubtasks > 0
    ? Math.round((completedSubtasks / totalSubtasks) * 100)
    : 0;

  const activeGroups = data.groups.filter((g) => g.status !== "idea");
  const ideaGroups = data.groups.filter((g) => g.status === "idea");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-accent" />
            <h1 className="font-heading text-2xl text-foreground">
              Thought Orchestrator
            </h1>
            {/* 資料來源指示器 */}
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${
              source === "github"
                ? "bg-accent-light text-accent border-accent/20"
                : "bg-muted text-muted-foreground border-border"
            }`}>
              {source === "github" ? (
                <><Github className="w-3 h-3" /> thoughts repo</>
              ) : (
                "本地 TODO.md"
              )}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">整體進度</p>
              <p className="text-sm font-semibold text-foreground">
                {completedSubtasks} / {totalSubtasks}
                <span className="text-accent ml-1">({overallProgress}%)</span>
              </p>
            </div>
            <div className="w-24 bg-muted rounded-full h-2">
              <div
                className="bg-accent rounded-full h-2 transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-10">
        {/* Page Title */}
        <div>
          <h2 className="font-heading text-4xl text-foreground">
            {data.title || "個人任務儀表板"}
          </h2>
          {data.lastUpdated && (
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              最後更新：{data.lastUpdated}
            </p>
          )}
        </div>

        {/* Quotes */}
        {data.quotes.length > 0 && (
          <div className="space-y-2">
            {data.quotes.map((quote, i) => (
              <blockquote key={i} className="border-l-2 border-accent pl-4 text-muted-foreground italic text-sm">
                {quote}
              </blockquote>
            ))}
          </div>
        )}

        {/* Active Task Groups */}
        {activeGroups.length > 0 && (
          <section>
            <h3 className="font-heading text-2xl text-foreground mb-4">
              📋 當前任務
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {activeGroups.map((group) => (
                <TaskCard key={group.id} group={group} />
              ))}
            </div>
          </section>
        )}

        {/* Idea Groups (subtasks) */}
        {ideaGroups.length > 0 && ideaGroups.some((g) => g.subtasks.length > 0) && (
          <section>
            <h3 className="font-heading text-2xl text-foreground mb-4">
              💡 構思清單
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {ideaGroups.map((group) => (
                <TaskCard key={group.id} group={group} />
              ))}
            </div>
          </section>
        )}

        {/* Standalone Ideas */}
        {data.ideas.length > 0 && (
          <section>
            <h3 className="font-heading text-2xl text-foreground mb-4">
              🧠 心智模型腦力激盪
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {data.ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {activeGroups.length === 0 && data.ideas.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-heading text-xl">TODO.md 尚無資料</p>
            <p className="text-sm mt-1">設定 GITHUB_TOKEN 或在根目錄新增 TODO.md</p>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-6 text-center text-xs text-muted-foreground">
        Thought Orchestrator · 資料來源：
        {source === "github" ? "github.com/fredrick84823/thoughts" : "本地 TODO.md"}
      </footer>
    </div>
  );
}

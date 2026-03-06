import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { parseTodoMarkdown } from "@/lib/task-parser";
import { fetchTodoFromGitHub } from "@/lib/github-fetcher";

export async function GET() {
  try {
    let content: string;
    let source: "github" | "local";

    if (process.env.GITHUB_TOKEN) {
      content = await fetchTodoFromGitHub();
      source = "github";
    } else {
      const todoPath = path.join(process.cwd(), "TODO.md");
      content = await fs.readFile(todoPath, "utf-8");
      source = "local";
    }

    const parsed = parseTodoMarkdown(content);
    return NextResponse.json({ ...parsed, source });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

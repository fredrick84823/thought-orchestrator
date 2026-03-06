import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { parseTodoMarkdown } from "@/lib/task-parser";

export async function GET() {
  try {
    const todoPath = path.join(process.cwd(), "TODO.md");
    const content = await fs.readFile(todoPath, "utf-8");
    const parsed = parseTodoMarkdown(content);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Failed to read TODO.md" },
      { status: 500 }
    );
  }
}

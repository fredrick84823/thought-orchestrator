import type { ParsedTodo, TaskGroup, SubTask, IdeaItem, TaskStatus } from "@/types/task";

/**
 * 從 Markdown 文字中提取 #tag 標籤
 * 格式：#tag（字母數字或中文，排除 Markdown 標題）
 */
function extractTags(text: string): string[] {
  const tagPattern = /#([\w\u4e00-\u9fff]+)/g;
  const matches = [...text.matchAll(tagPattern)];
  return matches.map((m) => m[1]);
}

/**
 * 從 Markdown 文字中提取 @date 日期
 * 格式：@YYYY-MM-DD 或 @日期描述
 */
function extractDate(text: string): string | null {
  const datePattern = /@([\d-]+|[\w\u4e00-\u9fff]+)/;
  const match = text.match(datePattern);
  return match ? match[1] : null;
}

/**
 * 清理文字，移除 tags 和 date metadata
 */
function cleanText(text: string): string {
  return text
    .replace(/#[\w\u4e00-\u9fff]+/g, "")
    .replace(/@[\d-]+/g, "")
    .replace(/\*\*/g, "")
    .trim();
}

/**
 * 從區段標題判斷 emoji 與狀態
 */
function parseGroupMeta(heading: string): { emoji: string; status: TaskStatus } {
  const emojiMatch = heading.match(/^(\p{Emoji})/u);
  const emoji = emojiMatch ? emojiMatch[1] : "📌";

  const lowerHeading = heading.toLowerCase();
  if (lowerHeading.includes("idea") || lowerHeading.includes("腦力") || lowerHeading.includes("想法")) {
    return { emoji, status: "idea" };
  }
  return { emoji, status: "todo" };
}

/**
 * 解析 checkbox 子任務行
 * 格式：- [ ] 或 - [x]
 */
function parseSubtaskLine(line: string, index: number, groupId: string): SubTask | null {
  const checkboxPattern = /^[-*]\s+\[([ xX])\]\s+(.+)$/;
  const match = line.trim().match(checkboxPattern);
  if (!match) return null;

  const completed = match[1].toLowerCase() === "x";
  const rawText = match[2];
  const tags = extractTags(rawText);
  const date = extractDate(rawText);
  const text = cleanText(rawText);

  return {
    id: `${groupId}-subtask-${index}`,
    text,
    completed,
    tags,
    date,
  };
}

/**
 * 解析 ideas 清單（非 checkbox 的列表項）
 */
function parseIdeaItem(line: string, index: number): IdeaItem | null {
  // 符合 **標題**：描述 格式
  const ideaPattern = /^[-*]\s+\*\*(.+?)\*\*[：:]?\s*(.*)$/;
  const match = line.trim().match(ideaPattern);
  if (!match) return null;

  return {
    id: `idea-${index}`,
    title: match[1].trim(),
    description: match[2].trim(),
  };
}

/**
 * 主解析函數：將 TODO.md 內容轉為結構化 JSON
 */
export function parseTodoMarkdown(markdown: string): ParsedTodo {
  const lines = markdown.split("\n");
  const groups: TaskGroup[] = [];
  const ideas: IdeaItem[] = [];

  let title = "";
  let lastUpdated: string | null = null;
  let currentGroup: TaskGroup | null = null;
  let isIdeaSection = false;
  let isQuoteSection = false;
  let groupIndex = 0;
  let subtaskIndex = 0;
  let ideaIndex = 0;
  const quotes: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 文件主標題
    if (trimmed.startsWith("# ") && !title) {
      title = trimmed.replace(/^#\s+/, "").replace(/^\p{Emoji}\s*/u, "").trim();
      continue;
    }

    // 最後更新日期
    const dateFooterMatch = trimmed.match(/最後更新日期[：:](.+)/);
    if (dateFooterMatch) {
      lastUpdated = dateFooterMatch[1].trim();
      continue;
    }

    // H2 區段標題（主分類）
    if (trimmed.startsWith("## ")) {
      // 儲存前一個 group
      if (currentGroup) {
        if (isIdeaSection && currentGroup.subtasks.length === 0) {
          // idea section handled separately
        } else {
          groups.push(currentGroup);
        }
      }

      const headingText = trimmed.replace(/^##\s+/, "");
      const lowerHeading = headingText.toLowerCase();
      isQuoteSection = lowerHeading.includes("句子") || lowerHeading.includes("quote");
      if (isQuoteSection) {
        currentGroup = null;
        continue;
      }

      const { emoji, status } = parseGroupMeta(headingText);
      isIdeaSection = status === "idea";
      groupIndex++;
      subtaskIndex = 0;

      currentGroup = {
        id: `group-${groupIndex}`,
        title: cleanText(headingText).replace(/^\p{Emoji}\s*/u, "").trim(),
        emoji,
        status,
        description: "",
        subtasks: [],
      };
      continue;
    }

    // H3 子區段（子分類標題）
    if (trimmed.startsWith("### ")) {
      // 如果有當前 group，先儲存再建新的
      if (currentGroup) {
        groups.push(currentGroup);
      }

      const headingText = trimmed.replace(/^###\s+/, "");
      const { emoji, status } = parseGroupMeta(headingText);
      groupIndex++;
      subtaskIndex = 0;

      currentGroup = {
        id: `group-${groupIndex}`,
        title: cleanText(headingText).replace(/^\p{Emoji}\s*/u, "").trim(),
        emoji,
        status,
        description: "",
        subtasks: [],
      };
      isIdeaSection = status === "idea";
      continue;
    }

    // 句子區塊的列表項
    if (isQuoteSection && /^[-*]\s+/.test(trimmed)) {
      const text = trimmed.replace(/^[-*]\s+/, "").trim();
      if (text && text !== "待填入") quotes.push(text);
      continue;
    }

    if (!currentGroup) continue;

    // **描述** 行（支援有無 list 前綴）
    const boldKeyValue = trimmed.match(/^(?:[-*]\s+)?\*\*(描述|Description)\*\*[：:]\s*(.+)$/);
    if (boldKeyValue) {
      currentGroup.description = boldKeyValue[2].trim();
      continue;
    }

    // Checkbox 子任務
    if (/^[-*]\s+\[[ xX]\]/.test(trimmed)) {
      const subtask = parseSubtaskLine(trimmed, subtaskIndex++, currentGroup.id);
      if (subtask) {
        currentGroup.subtasks.push(subtask);
      }
      continue;
    }

    // Idea 項目（非 checkbox 的列表項，格式為 **標題**：描述）
    if (isIdeaSection && /^[-*]\s+\*\*/.test(trimmed)) {
      const idea = parseIdeaItem(trimmed, ideaIndex++);
      if (idea) {
        ideas.push(idea);
      }
      continue;
    }
  }

  // 最後一個 group
  if (currentGroup) {
    groups.push(currentGroup);
  }

  return {
    title,
    quotes,
    groups: groups.filter((g) => g.subtasks.length > 0 || g.description),
    ideas,
    lastUpdated,
  };
}

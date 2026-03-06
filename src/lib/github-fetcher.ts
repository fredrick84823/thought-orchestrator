/**
 * 從 GitHub API 讀取 thoughts repo 的 TODO.md
 * 使用 GitHub Contents API：https://api.github.com/repos/{owner}/{repo}/contents/{path}
 */

interface GitHubContentsResponse {
  content: string;
  encoding: string;
  sha: string;
  name: string;
}

export async function fetchTodoFromGitHub(): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER ?? "fredrick84823";
  const repo = process.env.GITHUB_REPO_NAME ?? "thoughts";
  const filePath = process.env.GITHUB_TODO_PATH ?? "TODO.md";
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (!token) {
    throw new Error(
      "GITHUB_TOKEN 未設定。請在 .env.local 中加入你的 GitHub Personal Access Token。"
    );
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    // Next.js: 每 60 秒重新驗證一次（ISR）
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `GitHub API 回應錯誤 ${res.status}：${body}`
    );
  }

  const data: GitHubContentsResponse = await res.json();

  // GitHub API 回傳的內容是 Base64 編碼
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  return decoded;
}

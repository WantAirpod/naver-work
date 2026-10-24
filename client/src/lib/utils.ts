import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const JIRA_KEY = /^[A-Z][A-Z0-9_]+-\d+$/;

function toUrl(url: string): URL | null {
  try {
    return new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
  } catch {
    return null;
  }
}

export function extractJiraKey(url: string | null | undefined): string {
  const value = url?.trim();
  if (!value) return "";
  if (JIRA_KEY.test(value.toUpperCase())) return value.toUpperCase();
  const urlObj = toUrl(value);
  if (!urlObj) return "";
  const param = urlObj.searchParams.get("selectedIssue") || urlObj.searchParams.get("issueKey");
  if (param && JIRA_KEY.test(param.toUpperCase())) return param.toUpperCase();
  const segments = urlObj.pathname.split("/").filter(Boolean);
  const browseIdx = segments.findIndex((s) => s.toLowerCase() === "browse");
  const browseKey = browseIdx >= 0 ? segments[browseIdx + 1]?.toUpperCase() : undefined;
  if (browseKey && JIRA_KEY.test(browseKey)) return browseKey;
  return segments.find((s) => JIRA_KEY.test(s)) ?? "";
}

export function extractTicketNumber(url: string | null | undefined): string {
  const value = url?.trim();
  if (!value) return "";
  const jiraKey = extractJiraKey(value);
  if (jiraKey) return jiraKey;
  return value.match(/\/(\d+)\/?(?:[?#].*)?$/)?.[1] ?? "";
}

export function getTicketLabel(url: string | null | undefined): string {
  const value = url?.trim();
  if (!value) return "Todo";
  const jiraKey = extractJiraKey(value);
  if (jiraKey) return jiraKey;
  const number = extractTicketNumber(value);
  if (number) return `#${number}`;
  const urlObj = toUrl(value);
  return urlObj?.pathname.split("/").filter(Boolean).pop() || urlObj?.hostname || value;
}

export function getTicketLinkText(url: string | null | undefined): string {
  const value = url?.trim();
  if (!value) return "";
  const jiraKey = extractJiraKey(value);
  if (jiraKey) return `${extractRepoPath(value)}/browse/${jiraKey}`;
  const number = extractTicketNumber(value);
  const repo = extractRepoPath(value);
  return number && repo ? `${repo}/issues/${number}` : repo || value;
}

export function extractRepoPath(url: string | null | undefined): string {
  if (!url) return "";
  if (extractJiraKey(url)) return /[./]/.test(url) ? toUrl(url)?.hostname ?? "Jira" : "Jira";
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]}/${parts[1]}`;
    }
    return parts.join("/");
  } catch {
    return url;
  }
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  return d.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

export function getPriorityConfig(priority: string) {
  switch (priority) {
    case "high":
      return { label: "높음", className: "bg-destructive/10 text-destructive dark:bg-destructive/20", accent: "border-l-red-500 bg-red-50/60 dark:bg-red-950/20", dot: "bg-red-500" };
    case "low":
      return { label: "낮음", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", accent: "border-l-blue-400 bg-card", dot: "bg-blue-400" };
    default:
      return { label: "보통", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", accent: "border-l-amber-400 bg-card", dot: "bg-amber-400" };
  }
}

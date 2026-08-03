import type { HealthItem } from "./scan";
import { updateHealth } from "./scan";

export interface DatabaseScanResult {
  ok: boolean;
  totalTables: number;
  missingTables: string[];
  message: string;
}

export async function scanDatabase(
  list: HealthItem[],
  result: DatabaseScanResult
) {
  list = updateHealth(list, "database", {
    status: "running",
    progress: 25,
    message: "Scanning database...",
  });

  if (result.ok) {
    list = updateHealth(list, "database", {
      status: "success",
      progress: 100,
      message: `${result.totalTables} tables verified`,
    });
  } else {
    list = updateHealth(list, "database", {
      status:
        result.missingTables.length > 0
          ? "error"
          : "warning",
      progress: 100,
      message:
        result.missingTables.length > 0
          ? `Missing: ${result.missingTables.join(", ")}`
          : result.message,
    });
  }

  return list;
}

export function expectedTables() {
  return [
    "leaderboard",
    "ai_predictions",
    "exams",
    "kingdom",
    "weekly_answers",
    "historical_eras",
    "videos",
    "students",
    "timeline",
    "banners",
    "events",
    "results",
    "assistants",
    "announcements",
    "settings",
    "exam_answers",
    "weekly_questions",
    "student_activity",
    "notifications",
    "aws_settings",
    "exam_attempts",
    "student_subscriptions",
    "teacher_style",
    "device_sessions",
    "live_chat",
    "exam_questions",
    "attachments",
    "video_views",
    "live_streams",
  ];
}
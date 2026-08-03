import type { HealthItem } from "./scan";
import { updateHealth } from "./scan";

export const REQUIRED_FUNCTIONS = [
  "ai-chat",
  "ai-prediction",
  "announcement-create",
  "announcement-delete",
  "calculate-results",
  "create-live-channel",
  "create-upload-url",
  "event-create",
  "event-delete",
  "exam-delete",
  "generate-video-url",
  "history-delete",
  "kingdom-update",
  "leaderboard-update",
  "live-end",
  "live-update",
  "notification-delete",
  "notification-send",
  "publish-exam",
  "release-results",
  "settings-update",
  "student-delete",
  "student-reset-attempt",
  "unpublish-exam",
  "video-delete",
  "weekly-question-create",
  "weekly-question-delete",
  "weekly-question-toggle",
  "system-health",
];

export interface FunctionScanResult {
  ok: boolean;
  existing: string[];
}

export async function scanFunctions(
  list: HealthItem[],
  result: FunctionScanResult
) {
  list = updateHealth(list, "functions", {
    status: "running",
    progress: 20,
    message: "Checking edge functions...",
  });

  const missing = REQUIRED_FUNCTIONS.filter(
    (func) => !result.existing.includes(func)
  );

  if (missing.length === 0) {
    list = updateHealth(list, "functions", {
      status: "success",
      progress: 100,
      message: `${REQUIRED_FUNCTIONS.length} functions OK`,
    });
  } else {
    list = updateHealth(list, "functions", {
      status: "error",
      progress: 100,
      message: `Missing: ${missing.join(", ")}`,
    });
  }

  return list;
}
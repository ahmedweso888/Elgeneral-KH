import type { HealthItem } from "./scan";
import { updateHealth } from "./scan";

export const REQUIRED_TRIGGERS = [
  "log_weekly_activity",
  "update_weekly_points",
  "update_student_last_activity",
  "log_video_activity",
  "update_exam_points",
  "log_exam_activity",
  "update_device_session",
  "touch_leaderboard",
  "touch_subscription",
];

export interface TriggerScanResult {
  ok: boolean;
  existing: string[];
}

export async function scanTriggers(
  list: HealthItem[],
  result: TriggerScanResult
) {
  list = updateHealth(list, "triggers", {
    status: "running",
    progress: 20,
    message: "Checking triggers...",
  });

  const missing = REQUIRED_TRIGGERS.filter(
    (trigger) => !result.existing.includes(trigger)
  );

  if (missing.length === 0) {
    list = updateHealth(list, "triggers", {
      status: "success",
      progress: 100,
      message: `${REQUIRED_TRIGGERS.length} triggers OK`,
    });
  } else {
    list = updateHealth(list, "triggers", {
      status: "error",
      progress: 100,
      message: `Missing: ${missing.join(", ")}`,
    });
  }

  return list;
}
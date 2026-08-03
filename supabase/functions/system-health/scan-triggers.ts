import type { TriggersResult } from "./types.ts";

const REQUIRED_TRIGGERS = [
  "trg_exam_activity",
  "trg_exam_points",
  "trg_log_video_activity",
  "trg_subscription_date",
  "trg_touch_leaderboard",
  "trg_update_device_session",
  "trg_video_view_activity",
  "trg_weekly_activity",
  "trg_weekly_points",
];

export async function scanTriggers(
  supabase: any,
): Promise<TriggersResult> {
  try {
const { data, error } = await supabase.rpc(
  "system_health_triggers"
);

    if (error) throw error;

    const existing = new Set(
      (data ?? []).map((x: any) => x.trigger_name),
    );

    const missing = REQUIRED_TRIGGERS.filter(
      (name) => !existing.has(name),
    );

    return {
      ok: missing.length === 0,

      total: REQUIRED_TRIGGERS.length,

      found:
        REQUIRED_TRIGGERS.length - missing.length,

      missing,

      message:
        missing.length === 0
          ? "All Triggers OK"
          : `${missing.length} Missing Trigger(s)`,
    };
  } catch (error) {
    return {
      ok: false,

      total: REQUIRED_TRIGGERS.length,

      found: 0,

      missing: REQUIRED_TRIGGERS,

      message:
        error instanceof Error
          ? error.message
          : "Trigger Scan Failed",
    };
  }
}
import type { IndexesResult } from "./types.ts";

const REQUIRED_INDEXES = [
  "idx_weekly_answers_student",
  "idx_weekly_answers_question",

  "idx_exam_answers_student",
  "idx_exam_answers_exam",

  "idx_exam_attempts_student",
  "idx_exam_attempts_exam",

  "idx_results_student",

  "idx_video_views_student",
  "idx_video_views_video",


  "idx_student_activity_student",

  "idx_leaderboard_points",
];

export async function scanIndexes(
  supabase: any,
): Promise<IndexesResult> {
  try {
const { data, error } = await supabase.rpc(
  "system_health_indexes"
);

    if (error) throw error;

    const existing = new Set(
      (data ?? []).map((x: any) => x.indexname),
    );

    const missing = REQUIRED_INDEXES.filter(
      (index) => !existing.has(index),
    );

    return {
      ok: missing.length === 0,

      total: REQUIRED_INDEXES.length,

      found:
        REQUIRED_INDEXES.length - missing.length,

      missing,

      message:
        missing.length === 0
          ? "All Indexes OK"
          : `${missing.length} Missing Index(es)`,
    };
  } catch (error) {
    return {
      ok: false,

      total: REQUIRED_INDEXES.length,

      found: 0,

      missing: REQUIRED_INDEXES,

      message:
        error instanceof Error
          ? error.message
          : "Indexes Scan Failed",
    };
  }
}
import type { PoliciesResult } from "./types.ts";

const REQUIRED_POLICIES = [
  // students
  { table: "students", name: "students_select" },
  { table: "students", name: "students_update" },
  { table: "students", name: "students_insert" },

  // settings
  { table: "settings", name: "Admin Full Access" },
  { table: "settings", name: "Students Read" },

  // leaderboard
  { table: "leaderboard", name: "Admin Full Access" },
  { table: "leaderboard", name: "Students Read" },

  // weekly
  { table: "weekly_questions", name: "Admin Full Access" },
  { table: "weekly_questions", name: "Students Read" },

  { table: "weekly_answers", name: "Admin Full Access" },
  { table: "weekly_answers", name: "Student Insert Weekly" },
  { table: "weekly_answers", name: "Student Read Weekly" },

  // activity
  { table: "student_activity", name: "Admin Full Access" },
  { table: "student_activity", name: "Student Own Activity" },

  // exams
  { table: "exam_answers", name: "Admin Full Access" },
  { table: "exam_attempts", name: "Admin Full Access" },

  // notifications
  { table: "notifications", name: "Admin Full Access" },

  // videos
  { table: "videos", name: "Students Read" },

  // announcements
  { table: "announcements", name: "Students Read" },
];

export async function scanPolicies(
  supabase: any,
): Promise<PoliciesResult> {

  try {

 await supabase
const { data, error } = await supabase.rpc(
  "system_health_policies"
);

console.log("RPC DATA =", data);
console.log("RPC ERROR =", error);

if (error) throw error;

    const existing =
      new Set(
        (data ?? []).map(
          (x: any) =>
            `${x.tablename}:${x.policyname}`,
        ),
      );

    const missing = REQUIRED_POLICIES.filter(
      (x) =>
        !existing.has(
          `${x.table}:${x.name}`,
        ),
    );

    return {

      ok: missing.length === 0,

      total: REQUIRED_POLICIES.length,

      found:
        REQUIRED_POLICIES.length -
        missing.length,

      missing,

      message:
        missing.length === 0
          ? "All RLS Policies OK"
          : `${missing.length} Missing Policies`,

    };

  } catch (error) {

    return {

      ok: false,

      total: REQUIRED_POLICIES.length,

      found: 0,

      missing: REQUIRED_POLICIES,

      message:
        error instanceof Error
          ? error.message
          : "Policy Scan Failed",

    };

  }

}
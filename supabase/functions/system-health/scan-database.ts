import { DatabaseResult } from "./types.ts";

export const REQUIRED_TABLES = [

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

export async function scanDatabase(
  supabase: any
): Promise<DatabaseResult> {

  const existing: string[] = [];

  for (const table of REQUIRED_TABLES) {

    const { error } = await supabase
      .from(table)
      .select("*")
      .limit(1);

    if (!error) {
      existing.push(table);
    }

  }

  const missing = REQUIRED_TABLES.filter(
    x => !existing.includes(x)
  );

  return {

    ok: missing.length === 0,

    total: REQUIRED_TABLES.length,

    existing,

    missing,

  };

}
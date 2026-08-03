import type { FunctionResult } from "./types.ts";

const REQUIRED_FUNCTIONS = [

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

];

export async function scanEdgeFunctions(): Promise<FunctionResult> {

  const token = Deno.env.get("MGMT_ACCESS_TOKEN");

  const project = Deno.env.get("PROJECT_REF");

  if (!token || !project) {

    return {

      ok: false,

      total: REQUIRED_FUNCTIONS.length,

      existing: [],

      missing: REQUIRED_FUNCTIONS,

    };

  }

  const res = await fetch(

    `https://api.supabase.com/v1/projects/${project}/functions`,

    {

      headers: {

        Authorization: `Bearer ${token}`,

        apikey: token,

      },

    },

  );

  if (!res.ok) {

    throw new Error("Unable to load Edge Functions.");

  }

  const functions = await res.json();

  const names: string[] = functions.map(

    (fn: any) => fn.name,

  );

  const existing: string[] = [];

  const missing: string[] = [];

  for (const fn of REQUIRED_FUNCTIONS) {

    if (names.includes(fn))

      existing.push(fn);

    else

      missing.push(fn);

  }

  return {

    ok: missing.length === 0,

    total: REQUIRED_FUNCTIONS.length,

    existing,

    missing,

  };

}
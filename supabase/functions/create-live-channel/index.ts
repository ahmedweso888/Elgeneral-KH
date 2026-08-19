import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { requireAdmin } from "../_shared/require-admin.ts";

export default {
  fetch: withSupabase({ auth: "user" }, async (_req, ctx) => {
    const authorization = await requireAdmin(ctx);

    if (!authorization.ok) {
      return authorization.response;
    }

    return Response.json(
      {
        code: "LIVE_NOT_CONFIGURED",
        message: "Live streaming is not configured yet.",
      },
      { status: 503 },
    );
  }),
};

import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({}, async (req, ctx) => {
    try {

      const {
        title,
        message,
        grade,
        send_to_all,
      } = await req.json();

      if (!title || !message) {
        return Response.json(
          {
            success: false,
            error: "title and message are required",
          },
          {
            status: 400,
          }
        );
      }

      await ctx.supabaseAdmin
        .from("notifications")
        .insert({
          title,
          message,
          target_grade: send_to_all ? null : grade,
          is_sent: true,
          created_at: new Date().toISOString(),
        });

      return Response.json({
        success: true,
      });

    } catch (error) {

      console.error(error);

      return Response.json(
        {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Unknown Error",
        },
        {
          status: 500,
        }
      );

    }
  }),
};
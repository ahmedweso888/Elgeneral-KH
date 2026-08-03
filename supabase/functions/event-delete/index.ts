import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    {
    },

    async (req, ctx) => {

      try {

        const { eventId } = await req.json();

        const { error } =
          await ctx.supabaseAdmin
            .from("events")
            .delete()
            .eq("id", eventId);

        if (error) throw error;

        return Response.json({
          success: true,
        });

      }

      catch (error) {

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

    },

  ),

};
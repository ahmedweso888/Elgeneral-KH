import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    {
    },

    async (req, ctx) => {

      try {

        const body = await req.json();

        if (!body.liveId) {

          return Response.json(
            {
              success: false,
              error: "liveId is required",
            },
            {
              status: 400,
            }
          );

        }

        const { liveId, ...updates } = body;

        const {
          data,
          error,
        } = await ctx.supabaseAdmin
          .from("live_channels")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("id", liveId)
          .select()
          .single();

        if (error) throw error;

        return Response.json({
          success: true,
          live: data,
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
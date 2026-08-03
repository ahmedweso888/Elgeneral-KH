import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    {
    },

    async (req, ctx) => {

      try {

        const body = await req.json();

        const {
          data,
          error,
        } = await ctx.supabaseAdmin
          .from("events")
          .insert({
            ...body,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        return Response.json({
          success: true,
          event: data,
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
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    {
    },

    async (req, ctx) => {

      try {

        const body = await req.json();

        if (!body.student_id) {

          return Response.json(
            {
              success: false,
              error: "student_id is required",
            },
            {
              status: 400,
            }
          );

        }

        const {
          student_id,
          ...updates
        } = body;

        //--------------------------------------------------
        // Check Kingdom
        //--------------------------------------------------

        const {
          data: kingdom,
        } = await ctx.supabaseAdmin
          .from("kingdom")
          .select("id")
          .eq("student_id", student_id)
          .maybeSingle();

        //--------------------------------------------------
        // Update
        //--------------------------------------------------

        if (kingdom) {

          const {
            data,
            error,
          } = await ctx.supabaseAdmin
            .from("kingdom")
            .update({
              ...updates,
              updated_at:
                new Date().toISOString(),
            })
            .eq("student_id", student_id)
            .select()
            .single();

          if (error) throw error;

          return Response.json({
            success: true,
            kingdom: data,
          });

        }

        //--------------------------------------------------
        // Create
        //--------------------------------------------------

        const {
          data,
          error,
        } = await ctx.supabaseAdmin
          .from("kingdom")
          .insert({
            student_id,
            ...updates,
            created_at:
              new Date().toISOString(),
            updated_at:
              new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        return Response.json({
          success: true,
          kingdom: data,
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
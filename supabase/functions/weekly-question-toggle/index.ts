import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    {
    },

    async (req, ctx) => {

      try {

        const {
          questionId,
          isActive,
        } = await req.json();

        if (!questionId) {

          return Response.json(
            {
              success: false,
              error: "questionId is required",
            },
            {
              status: 400,
            }
          );

        }

        //--------------------------------------------------
        // Check Question
        //--------------------------------------------------

        const {
          data,
          error,
        } = await ctx.supabaseAdmin
          .from("weekly_questions")
          .select("id")
          .eq("id", questionId)
          .single();

        if (error || !data) {

          return Response.json(
            {
              success: false,
              error: "Question not found",
            },
            {
              status: 404,
            }
          );

        }

        //--------------------------------------------------
// Toggle
//--------------------------------------------------

const { error: updateError } =
  await ctx.supabaseAdmin
    .from("weekly_questions")
    .update({
      is_active: isActive,
    })
    .eq("id", questionId);

if (updateError) {
  throw updateError;
}

        //--------------------------------------------------
        // Done
        //--------------------------------------------------

        return Response.json({

          success: true,

          message: "Weekly question updated successfully",

        });

      }

      catch (error) {

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

    }

  ),

};
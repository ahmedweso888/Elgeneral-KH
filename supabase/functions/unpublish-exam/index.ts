import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    {
    },

    async (req, ctx) => {
      try {
        const { examId } = await req.json();

        if (!examId) {
          return Response.json(
            {
              success: false,
              error: "examId is required",
            },
            {
              status: 400,
            }
          );
        }

        //--------------------------------------------------
        // Check Exam
        //--------------------------------------------------

        const {
          data: exam,
          error: examError,
        } = await ctx.supabaseAdmin
          .from("exams")
          .select("id,is_published")
          .eq("id", examId)
          .single();

        if (examError || !exam) {
          return Response.json(
            {
              success: false,
              error: "Exam not found",
            },
            {
              status: 404,
            }
          );
        }

        //--------------------------------------------------
        // Unpublish
        //--------------------------------------------------

        const {
          error: updateError,
        } = await ctx.supabaseAdmin
          .from("exams")
          .update({
            is_published: false,
            updated_at: new Date().toISOString(),
          })
          .eq("id", examId);

        if (updateError) {
          throw updateError;
        }

        //--------------------------------------------------
        // Done
        //--------------------------------------------------

        return Response.json({
          success: true,
          message: "Exam unpublished successfully",
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
    }
  ),
};
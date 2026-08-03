import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({}, async (req, ctx) => {
    try {
      const { studentId } = await req.json();

      if (!studentId) {
        return Response.json(
          {
            error: "studentId is required",
          },
          {
            status: 400,
          }
        );
      }

      //--------------------------------------------------
      // Load All Attempts
      //--------------------------------------------------

      const { data: attempts, error: attemptsError } =
        await ctx.supabaseAdmin
          .from("exam_attempts")
          .select("id")
          .eq("student_id", studentId);

      if (attemptsError) throw attemptsError;

      //--------------------------------------------------
      // Delete Answers
      //--------------------------------------------------

      if (attempts && attempts.length > 0) {
        const attemptIds = attempts.map((a) => a.id);

        await ctx.supabaseAdmin
          .from("exam_answers")
          .delete()
          .in("attempt_id", attemptIds);

        await ctx.supabaseAdmin
          .from("exam_attempts")
          .delete()
          .in("id", attemptIds);
      }

      //--------------------------------------------------
      // Delete Results
      //--------------------------------------------------

      await ctx.supabaseAdmin
        .from("results")
        .delete()
        .eq("student_id", studentId);

      //--------------------------------------------------
      // Done
      //--------------------------------------------------

      return Response.json({
        success: true,
        message: "All student attempts have been reset successfully.",
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
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    {
    },

    async (req, ctx) => {

      try {

        const { weeklyQuestionId } = await req.json();

        if (!weeklyQuestionId) {

          return Response.json(
            {
              error: "weeklyQuestionId is required",
            },
            {
              status: 400,
            }
          );

        }

        //--------------------------------------------------
        // Load Weekly Question
        //--------------------------------------------------

        const {

          data: question,

          error: questionError,

        } = await ctx.supabaseAdmin

          .from("weekly_questions")

          .select("*")

          .eq("id", weeklyQuestionId)

          .single();

        if (questionError || !question) {

          return Response.json(
            {
              error: "Weekly Question not found",
            },
            {
              status: 404,
            }
          );

        }

        //--------------------------------------------------
        // Delete Image
        //--------------------------------------------------

        if (question.image_url) {

          try {

            const path =
              question.image_url.split("/history-images/")[1];

            if (path) {

              await ctx.supabaseAdmin.storage

                .from("history-images")

                .remove([path]);

            }

          } catch (e) {

            console.error(
              "Weekly image delete error",
              e
            );

          }

        }

        //--------------------------------------------------
        // Delete Answers
        //--------------------------------------------------

        const {

          error: answersError,

        } = await ctx.supabaseAdmin

          .from("weekly_answers")

          .delete()

          .eq(
            "weekly_question_id",
            weeklyQuestionId
          );

        if (answersError) {

          throw answersError;

        }

        //--------------------------------------------------
        // Delete Question
        //--------------------------------------------------

        const {

          error: deleteQuestionError,

        } = await ctx.supabaseAdmin

          .from("weekly_questions")

          .delete()

          .eq("id", weeklyQuestionId);

        if (deleteQuestionError) {

          throw deleteQuestionError;

        }

        //--------------------------------------------------
        // Done
        //--------------------------------------------------

        return Response.json({

          success: true,

          message:
            "Weekly question deleted successfully.",

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

    },

  ),

};
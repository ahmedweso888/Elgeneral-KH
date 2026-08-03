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

              error: "examId is required",

            },

            {

              status: 400,

            }

          );

        }

        //--------------------------------------------------
        // تحميل الامتحان
        //--------------------------------------------------

        const {

          data: exam,

          error,

        } = await ctx.supabaseAdmin

          .from("exams")

          .select("*")

          .eq("id", examId)

          .single();

        if (error || !exam) {

          return Response.json(

            {

              error: "Exam not found",

            },

            {

              status:404,

            }

          );

        }

        //--------------------------------------------------
        // تحميل الأسئلة
        //--------------------------------------------------

        const {

          data: questions,

        } = await ctx.supabaseAdmin

          .from("exam_questions")

          .select("question_image")

          .eq("exam_id", examId);

        //--------------------------------------------------
        // حذف صور الأسئلة
        //--------------------------------------------------

        if (questions) {

          for (const q of questions) {

            if (!q.question_image) continue;

            const path =
              q.question_image.split("/exam-questions/")[1];

            if (path) {

              await ctx.supabaseAdmin.storage

                .from("exam-questions")

                .remove([path]);

            }

          }

        }

        //--------------------------------------------------
        // حذف صورة الامتحان
        //--------------------------------------------------

        if (exam.cover_image) {

          const path =
            exam.cover_image.split("/exam-images/")[1];

          if (path) {

            await ctx.supabaseAdmin.storage

              .from("exam-images")

              .remove([path]);

          }

        }

        //--------------------------------------------------
        // حذف الامتحان
        //--------------------------------------------------

        await ctx.supabaseAdmin

          .from("exams")

          .delete()

          .eq("id", examId);

        // PostgreSQL CASCADE
        // سيحذف تلقائياً:
        // exam_questions
        // exam_attempts
        // exam_answers
        // results

        return Response.json({

          success:true,

        });

      }

      catch(error){

        console.error(error);

        return Response.json({

          success:false,

          error:
            error instanceof Error
              ? error.message
              : "Unknown Error"

        },{

          status:500

        });

      }

    },

  ),

};
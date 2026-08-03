import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    {
    },

    async (req, ctx) => {

      try {

        const {

          examId,

        } = await req.json();

        if (!examId) {

          return Response.json(

            {

              error:"examId is required",

            },

            {

              status:400,

            }

          );

        }

        //--------------------------------------------------
        // Load Exam
        //--------------------------------------------------

        const {

          data: exam,

          error: examError,

        } = await ctx.supabaseAdmin

          .from("exams")

          .select("*")

          .eq("id", examId)

          .single();

        if (

          examError ||

          !exam

        ) {

          return Response.json(

            {

              error:"Exam not found",

            },

            {

              status:404,

            }

          );

        }

        //--------------------------------------------------
        // Release Results
        //--------------------------------------------------

        const {

          data,

          error,

        } = await ctx.supabaseAdmin

          .from("exams")

          .update({

            result_release_at:

              new Date().toISOString(),

            show_answers_after_result:true,

          })

          .eq("id",examId)

          .select()

          .single();

        if(error){

          throw error;

        }
                //--------------------------------------------------
        // Notify Students
        //--------------------------------------------------

        await ctx.supabaseAdmin

          .from("notifications")

          .insert({

            title:"ظهور النتيجة",

            message:`تم إعلان نتيجة امتحان ${exam.title}`,

            target_grade:exam.grade,

            is_sent:true,

          });

        //--------------------------------------------------
        // Done
        //--------------------------------------------------

        return Response.json({

          success:true,

          exam:data,

          message:

            "Results released successfully.",

        });

      }

      catch(error){

        console.error(error);

        return Response.json(

          {

            success:false,

            error:

              error instanceof Error

                ? error.message

                : "Unknown Error",

          },

          {

            status:500,

          }

        );

      }

    },

  ),

};
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    {
    },

    async (req, ctx) => {

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
        // Load Student
        //--------------------------------------------------

        const {

          data: student,

          error: studentError,

        } = await ctx.supabaseAdmin

          .from("students")

          .select("*")

          .eq("id", studentId)

          .single();

        if (studentError || !student) {

          return Response.json(
            {
              error: "Student not found",
            },
            {
              status: 404,
            }
          );

        }

        //--------------------------------------------------
        // Delete Avatar
        //--------------------------------------------------

        if (student.avatar) {

          try {

            const path =
              student.avatar.split("/avatars/")[1];

            if (path) {

              await ctx.supabaseAdmin.storage

                .from("avatars")

                .remove([path]);

            }

          } catch (e) {

            console.error(
              "Avatar delete error",
              e
            );

          }

        }

        //--------------------------------------------------
        // Delete Student Related Tables
        //--------------------------------------------------

        await ctx.supabaseAdmin
          .from("results")
          .delete()
          .eq("student_id", studentId);

        await ctx.supabaseAdmin
          .from("ai_predictions")
          .delete()
          .eq("student_id", studentId);

        await ctx.supabaseAdmin
          .from("leaderboard")
          .delete()
          .eq("student_id", studentId);

        await ctx.supabaseAdmin
          .from("kingdom")
          .delete()
          .eq("student_id", studentId);

        await ctx.supabaseAdmin
          .from("student_activity")
          .delete()
          .eq("student_id", studentId);

        await ctx.supabaseAdmin
          .from("device_sessions")
          .delete()
          .eq("student_id", studentId);

        await ctx.supabaseAdmin
          .from("live_chat")
          .delete()
          .eq("student_id", studentId);

        await ctx.supabaseAdmin
          .from("video_views")
          .delete()
          .eq("student_id", studentId);

        await ctx.supabaseAdmin
          .from("exam_answers")
          .delete()
          .eq("student_id", studentId);

        await ctx.supabaseAdmin
          .from("exam_attempts")
          .delete()
          .eq("student_id", studentId);

        await ctx.supabaseAdmin
          .from("weekly_answers")
          .delete()
          .eq("student_id", studentId);

        await ctx.supabaseAdmin
          .from("student_subscriptions")
          .delete()
          .eq("student_id", studentId);
                  //--------------------------------------------------
        // Delete Student
        //--------------------------------------------------

        const {

          error: deleteStudentError,

        } = await ctx.supabaseAdmin

          .from("students")

          .delete()

          .eq("id", studentId);

        if (deleteStudentError) {

          throw deleteStudentError;

        }

        //--------------------------------------------------
        // Done
        //--------------------------------------------------

        return Response.json({

          success: true,

          message: "Student deleted successfully.",

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
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    {
    },

    async(req,ctx)=>{

      try{

        //--------------------------------------------------
        // Load Students
        //--------------------------------------------------

        const{

          data:students,

          error,

        }=await ctx.supabaseAdmin

          .from("students")

          .select("id,xp,coins,level")

          .order(

            "xp",

            {

              ascending:false,

            }

          );

        if(error){

          throw error;

        }

        let rank=1;
                //--------------------------------------------------
        // Rebuild Leaderboard
        //--------------------------------------------------

        for (

          const student of students ?? []

        ) {

          await ctx.supabaseAdmin

            .from("leaderboard")

            .upsert({

              student_id:

                student.id,

              total_points:

                student.xp ?? 0,

              coins:

                student.coins ?? 0,

              level:

                student.level ?? 1,

              current_rank:

                rank,

              updated_at:

                new Date().toISOString(),

            });

          rank++;

        }

        //--------------------------------------------------
        // Done
        //--------------------------------------------------

        return Response.json({

          success:true,

          message:

            "Leaderboard rebuilt successfully.",

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
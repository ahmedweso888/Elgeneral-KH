import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    {
    },

    async (req, ctx) => {

      try {

        const {

          title,

          question,

          option_a,

          option_b,

          option_c,

          option_d,

          correct_answer,

          reward_title,

          reward_description,

          reward_points,

          image_url,

          start_at,

          end_at,

          is_active,

        } = await req.json();

        if (

          !title ||

          !question ||

          !option_a ||

          !option_b ||

          !option_c ||

          !option_d ||

          !correct_answer

        ) {

          return Response.json(

            {

              error:

                "Required fields are missing",

            },

            {

              status:400,

            }

          );

        }

        //--------------------------------------------------
        // Create Weekly Question
        //--------------------------------------------------

        const {

          data,

          error,

        } = await ctx.supabaseAdmin

          .from("weekly_questions")

          .insert({

            title,

            question,

            option_a,

            option_b,

            option_c,

            option_d,

            correct_answer,

            reward_title:

              reward_title ?? null,

            reward_description:

              reward_description ?? null,

            reward_points:

              reward_points ?? 0,

            image_url:

              image_url ?? null,

            start_at:

              start_at ?? null,

            end_at:

              end_at ?? null,

            is_active:

              is_active ?? false,

          })

          .select()

          .single();

        if(error){

          throw error;

        }

        //--------------------------------------------------
        // Done
        //--------------------------------------------------

        return Response.json({

          success:true,

          weekly_question:data,

          message:

            "Weekly question created successfully.",

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
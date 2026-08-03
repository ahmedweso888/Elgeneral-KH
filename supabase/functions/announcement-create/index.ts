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

          content,

          image_url,

          is_published,

        } = await req.json();

        if (

          !title ||

          !content

        ) {

          return Response.json(

            {

              error:

                "title and content are required",

            },

            {

              status:400,

            }

          );

        }

        //--------------------------------------------------
        // Create Announcement
        //--------------------------------------------------

        const {

          data,

          error,

        } = await ctx.supabaseAdmin

          .from("announcements")

          .insert({

            title,

            content,

            image_url: image_url ?? null,

            is_published:

              is_published ?? false,

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

          announcement:data,

          message:

            "Announcement created successfully.",

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
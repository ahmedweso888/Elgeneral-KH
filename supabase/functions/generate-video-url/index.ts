import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    {
     
    },

    async (req, ctx) => {

      try {

        const {

          videoId,

          studentId,

        } = await req.json();

        if (

          !videoId ||

          !studentId

        ) {

          return Response.json(

            {

              error:

                "videoId and studentId are required",

            },

            {

              status:400,

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

        if (

          studentError ||

          !student ||

          !student.is_active

        ) {

          return Response.json(

            {

              error:"Student not found",

            },

            {

              status:404,

            }

          );

        }

        //--------------------------------------------------
        // Load Video
        //--------------------------------------------------

        const {

          data: video,

          error: videoError,

        } = await ctx.supabaseAdmin

          .from("videos")

          .select("*")

          .eq("id", videoId)

          .single();

        if (

          videoError ||

          !video

        ) {

          return Response.json(

            {

              error:"Video not found",

            },

            {

              status:404,

            }

          );

        }

        //--------------------------------------------------
        // Check Published
        //--------------------------------------------------

        if (

          !video.is_published

        ) {

          return Response.json(

            {

              error:

                "Video not published",

            },

            {

              status:403,

            }

          );

        }
                //--------------------------------------------------
        // Check Subscription
        //--------------------------------------------------

        if (!video.is_free) {

          const {

            data: subscription,

            error: subscriptionError,

          } = await ctx.supabaseAdmin

            .from("student_subscriptions")

            .select("*")

            .eq("student_id", studentId)

            .eq("is_active", true)

            .gte(
              "expires_at",
              new Date().toISOString()
            )

            .maybeSingle();

          if (subscriptionError) {

            throw subscriptionError;

          }

          if (!subscription) {

            return Response.json(

              {

                error: "Subscription required",

              },

              {

                status: 403,

              }

            );

          }

        }

        //--------------------------------------------------
        // Load AWS Settings
        //--------------------------------------------------

        const {

          data: aws,

          error: awsError,

        } = await ctx.supabaseAdmin

          .from("aws_settings")

          .select("*")

          .limit(1)

          .single();

        if (awsError || !aws) {

          return Response.json(

            {

              error: "AWS settings not configured",

            },

            {

              status: 500,

            }

          );

        }

        //--------------------------------------------------
        // Check S3 Key
        //--------------------------------------------------

        if (!video.s3_key) {

          return Response.json(

            {

              error: "Video has no S3 Key",

            },

            {

              status: 500,

            }

          );

        }

        //--------------------------------------------------
        // TODO
        // Generate Signed URL
        //--------------------------------------------------
                //--------------------------------------------------
        // Placeholder Until AWS Is Configured
        //--------------------------------------------------

        return Response.json({

          success: true,

          provider: "aws",

          expires_in: 60,

          video: {

            id: video.id,

            title: video.title,

            playback_type: video.playback_type,

            s3_key: video.s3_key,

            cloudfront_url: video.cloudfront_url,

            hls_url: video.hls_url,

            ivs_playback_url: video.ivs_playback_url,

          },

          message:

            "AWS Signed URL will be generated here after AWS configuration.",

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
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

import {
  S3Client,
  DeleteObjectCommand,
} from "npm:@aws-sdk/client-s3";

export default {
  fetch: withSupabase(
    {
    },

    async (req, ctx) => {

      try {

        const { videoId } = await req.json();

        if (!videoId) {

          return Response.json(

            {

              error: "videoId is required",

            },

            {

              status: 400,

            }

          );

        }

        //--------------------------------------------------
        // قراءة مفاتيح AWS
        //--------------------------------------------------

        const accessKey =
          Deno.env.get("AWS_ACCESS_KEY_ID");

        const secretKey =
          Deno.env.get("AWS_SECRET_ACCESS_KEY");

        const region =
          Deno.env.get("AWS_REGION");

        if (
          !accessKey ||
          !secretKey ||
          !region
        ) {

          throw new Error(
            "AWS Secrets are missing."
          );

        }

        //--------------------------------------------------
        // تحميل إعدادات AWS
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

          throw new Error(
            "AWS settings not found."
          );

        }

        //--------------------------------------------------
        // إنشاء S3 Client
        //--------------------------------------------------

        const s3 = new S3Client({

          region,

          credentials: {

            accessKeyId: accessKey,

            secretAccessKey: secretKey,

          },

        });

        //--------------------------------------------------
        // تحميل بيانات الفيديو
        //--------------------------------------------------

        const {

          data: video,

          error: videoError,

        } = await ctx.supabaseAdmin

          .from("videos")

          .select("*")

          .eq("id", videoId)

          .single();

        if (videoError || !video) {

          return Response.json(

            {

              error: "Video not found.",

            },

            {

              status:404,

            }

          );

        }
                //--------------------------------------------------
        // حذف الفيديو من AWS S3
        //--------------------------------------------------

        if (video.s3_key) {

          try {

            await s3.send(

              new DeleteObjectCommand({

                Bucket: aws.s3_bucket,

                Key: video.s3_key,

              })

            );

            console.log(
              "Video deleted from S3."
            );

          } catch (e) {

            console.error(
              "S3 video delete error",
              e
            );

          }

        }

        //--------------------------------------------------
        // حذف الـ Thumbnail من S3
        //--------------------------------------------------

        if (video.thumbnail_url) {

          try {

            let thumbnailKey = "";

            if (
              video.thumbnail_url.includes(
                "amazonaws.com/"
              )
            ) {

              thumbnailKey =
                video.thumbnail_url.split(".com/")[1];

            } else if (
              video.thumbnail_url.includes(
                aws.cloudfront_domain
              )
            ) {

              thumbnailKey =
                video.thumbnail_url.replace(
                  `https://${aws.cloudfront_domain}/`,
                  ""
                );

            }

            if (thumbnailKey) {

              await s3.send(

                new DeleteObjectCommand({

                  Bucket: aws.s3_bucket,

                  Key: thumbnailKey,

                })

              );

              console.log(
                "Thumbnail deleted from S3."
              );

            }

          } catch (e) {

            console.error(
              "Thumbnail delete error",
              e
            );

          }

        }

        //--------------------------------------------------
        // TODO
        // حذف تسجيل IVS
        //--------------------------------------------------
                //--------------------------------------------------
        // حذف الفيديو من قاعدة البيانات
        //--------------------------------------------------

        const {

          error: deleteVideoError,

        } = await ctx.supabaseAdmin

          .from("videos")

          .delete()

          .eq("id", videoId);

        if (deleteVideoError) {

          throw deleteVideoError;

        }

        //--------------------------------------------------
        // Done
        //--------------------------------------------------

        return Response.json({

          success: true,

          message: "Video deleted successfully.",

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
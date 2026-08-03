import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    {
    
    },

    async (req, ctx) => {

      try {

        const { announcementId } = await req.json();

        if (!announcementId) {

          return Response.json(
            {
              error: "announcementId is required",
            },
            {
              status: 400,
            }
          );

        }

        //--------------------------------------------------
        // Load Announcement
        //--------------------------------------------------

        const {

          data: announcement,

          error: announcementError,

        } = await ctx.supabaseAdmin

          .from("announcements")

          .select("*")

          .eq("id", announcementId)

          .single();

        if (announcementError || !announcement) {

          return Response.json(
            {
              error: "Announcement not found",
            },
            {
              status: 404,
            }
          );

        }

        //--------------------------------------------------
        // Delete Image
        //--------------------------------------------------

        if (announcement.image_url) {

          try {

            const path =
              announcement.image_url.split("/announcements/")[1];

            if (path) {

              await ctx.supabaseAdmin.storage

                .from("announcements")

                .remove([path]);

            }

          } catch (e) {

            console.error(
              "Announcement image delete error",
              e
            );

          }

        }

        //--------------------------------------------------
        // Delete Row
        //--------------------------------------------------

        const {

          error: deleteAnnouncementError,

        } = await ctx.supabaseAdmin

          .from("announcements")

          .delete()

          .eq("id", announcementId);

        if (deleteAnnouncementError) {

          throw deleteAnnouncementError;

        }

        //--------------------------------------------------
        // Done
        //--------------------------------------------------

        return Response.json({

          success: true,

          message: "Announcement deleted successfully.",

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
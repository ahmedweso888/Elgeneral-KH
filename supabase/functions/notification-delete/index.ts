import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    {
    },

    async (req, ctx) => {
      try {

        const { notificationId } = await req.json();

        if (!notificationId) {
          return Response.json(
            {
              success: false,
              error: "notificationId is required",
            },
            {
              status: 400,
            }
          );
        }

        //--------------------------------------------------
        // Check Notification
        //--------------------------------------------------

        const {
          data: notification,
          error: notificationError,
        } = await ctx.supabaseAdmin
          .from("notifications")
          .select("id")
          .eq("id", notificationId)
          .maybeSingle();

        if (notificationError) {
          throw notificationError;
        }

        if (!notification) {
          return Response.json(
            {
              success: false,
              error: "Notification not found",
            },
            {
              status: 404,
            }
          );
        }

        //--------------------------------------------------
        // Delete Notification
        //--------------------------------------------------

        const { error: deleteError } =
          await ctx.supabaseAdmin
            .from("notifications")
            .delete()
            .eq("id", notificationId);

        if (deleteError) {
          throw deleteError;
        }

        //--------------------------------------------------
        // Done
        //--------------------------------------------------

        return Response.json({
          success: true,
          message: "Notification deleted successfully",
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
    }
  ),
};
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase(
    {
    },

    async (req, ctx) => {
      try {
        const {
          bucket,
          fileName,
        } = await req.json();

        if (!bucket || !fileName) {
          return Response.json(
            {
              success: false,
              error: "bucket and fileName are required",
            },
            {
              status: 400,
            }
          );
        }

        const { data, error } =
          await ctx.supabaseAdmin.storage
            .from(bucket)
            .createSignedUploadUrl(fileName);

        if (error) {
          return Response.json(
            {
              success: false,
              error: error.message,
            },
            {
              status: 500,
            }
          );
        }

        return Response.json({
          success: true,
          token: data.token,
          path: data.path,
        });
      } catch (e) {
        return Response.json(
          {
            success: false,
            error:
              e instanceof Error
                ? e.message
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
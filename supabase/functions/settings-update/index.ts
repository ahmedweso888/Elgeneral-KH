import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({}, async (req, ctx) => {
    try {
      const settings = await req.json();

      //--------------------------------------------------
      // Update Existing Settings
      //--------------------------------------------------

      if (settings.id) {
        const { data, error } = await ctx.supabaseAdmin
          .from("settings")
          .update({
            academy_name: settings.academy_name,
            logo_url: settings.logo_url,
            hero_image: settings.hero_image,

            whatsapp_number: settings.whatsapp_number,

            facebook_url: settings.facebook_url,
            telegram_url: settings.telegram_url,
            youtube_url: settings.youtube_url,
            tiktok_url: settings.tiktok_url,
            instagram_url: settings.instagram_url,

            support_email: settings.support_email,
            location: settings.location,

            ai_enabled: settings.ai_enabled,
            weekly_question_enabled: settings.weekly_question_enabled,
            leaderboard_enabled: settings.leaderboard_enabled,
            maintenance_mode: settings.maintenance_mode,
          })
          .eq("id", settings.id)
          .select()
          .single();

        if (error) throw error;

        return Response.json({
          success: true,
          settings: data,
        });
      }

      //--------------------------------------------------
      // Create First Settings Row
      //--------------------------------------------------

      const { data, error } = await ctx.supabaseAdmin
        .from("settings")
        .insert({
          academy_name: settings.academy_name,
          logo_url: settings.logo_url,
          hero_image: settings.hero_image,

          whatsapp_number: settings.whatsapp_number,

          facebook_url: settings.facebook_url,
          telegram_url: settings.telegram_url,
          youtube_url: settings.youtube_url,
          tiktok_url: settings.tiktok_url,
          instagram_url: settings.instagram_url,

          support_email: settings.support_email,
          location: settings.location,

          ai_enabled: settings.ai_enabled,
          weekly_question_enabled: settings.weekly_question_enabled,
          leaderboard_enabled: settings.leaderboard_enabled,
          maintenance_mode: settings.maintenance_mode,
        })
        .select()
        .single();

      if (error) throw error;

      return Response.json({
        success: true,
        settings: data,
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
  }),
};
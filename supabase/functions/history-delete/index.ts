import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({}, async (req, ctx) => {
    try {
      console.log("========== HISTORY DELETE START ==========");

      const body = await req.json();
      console.log("BODY =", body);

      const eraId = body?.eraId;

      console.log("ERA ID =", eraId);

      if (!eraId) {
        return Response.json(
          {
            success: false,
            error: "eraId is required",
          },
          {
            status: 400,
          }
        );
      }

      console.log("STEP 1");

      // اختبار الاتصال بقاعدة البيانات
      const all = await ctx.supabaseAdmin
        .from("historical_eras")
        .select("*");

      console.log("ALL ERAS =", all.data);
      console.log("ALL ERROR =", all.error);

      console.log("STEP 2");

      // اختبار الفلترة
      const eraQuery = await ctx.supabaseAdmin
        .from("historical_eras")
        .select("*")
        .eq("id", eraId);

      console.log("FILTER DATA =", eraQuery.data);
      console.log("FILTER ERROR =", eraQuery.error);

      console.log("STEP 3");

      if (!eraQuery.data || eraQuery.data.length === 0) {
        return Response.json(
          {
            success: false,
            error: "Era not found",
          },
          {
            status: 404,
          }
        );
      }

      const era = eraQuery.data[0];

      console.log("ERA =", era);

      console.log("STEP 4");

      // تحميل الـ timeline
      const timeline = await ctx.supabaseAdmin
        .from("timeline")
        .select("*")
        .eq("era_id", eraId);

      console.log("TIMELINE =", timeline.data);
      console.log("TIMELINE ERROR =", timeline.error);

      console.log("STEP 5");

      // حذف الأحداث
      const deleteTimeline = await ctx.supabaseAdmin
        .from("timeline")
        .delete()
        .eq("era_id", eraId);

      console.log("DELETE TIMELINE =", deleteTimeline);

      console.log("STEP 6");

      // حذف العصر
      const deleteEra = await ctx.supabaseAdmin
        .from("historical_eras")
        .delete()
        .eq("id", eraId);

      console.log("DELETE ERA =", deleteEra);

      console.log("STEP 7");

      return Response.json({
        success: true,
      });

    } catch (e: any) {
      console.error("========== FULL ERROR ==========");
      console.error(e);
      console.error(e?.stack);

      return Response.json(
        {
          success: false,
          error: String(e),
          stack: e?.stack ?? null,
        },
        {
          status: 500,
        }
      );
    }
  }),
};
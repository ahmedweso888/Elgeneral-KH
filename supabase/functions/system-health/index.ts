import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

import { scanDatabase } from "./scan-database.ts";
import { scanStorage } from "./scan-storage.ts";
import { scanBuckets } from "./scan-buckets.ts";
import { scanAuth } from "./scan-auth.ts";
import { scanPolicies } from "./scan-policies.ts";
import { scanTriggers } from "./scan-triggers.ts";
import { scanIndexes } from "./scan-indexes.ts";
import { scanSettings } from "./scan-settings.ts";
import { scanPerformance } from "./scan-performance.ts";

export default {
  fetch: withSupabase({}, async (_req, ctx) => {
    const started = performance.now();

    try {
      //--------------------------------------------------
      // Run All Scans
      //--------------------------------------------------

      const [
        database,
        storage,
        buckets,
        auth,
        policies,
        triggers,
        indexes,
        settings,
        performanceScan,
      ] = await Promise.all([
        scanDatabase(ctx.supabaseAdmin),
        scanStorage(ctx.supabaseAdmin),
        scanBuckets(),
        scanAuth(ctx.supabaseAdmin),
        scanPolicies(ctx.supabaseAdmin),
        scanTriggers(ctx.supabaseAdmin),
        scanIndexes(ctx.supabaseAdmin),
        scanSettings(ctx.supabaseAdmin),
        scanPerformance(ctx.supabaseAdmin),
      ]);

      //--------------------------------------------------
      // Summary
      //--------------------------------------------------

      const sections = [
        database,
        storage,
        buckets,
        auth,
        policies,
        triggers,
        indexes,
        settings,
        performanceScan,
      ];

      const passed = sections.filter((x) => x.ok).length;
      const errors = sections.filter((x) => !x.ok).length;
      const warnings = 0;

      const score = Math.round(
        (passed / sections.length) * 100,
      );

      let grade = "F";

      if (score >= 98) grade = "A+";
      else if (score >= 90) grade = "A";
      else if (score >= 80) grade = "B";
      else if (score >= 70) grade = "C";
      else if (score >= 60) grade = "D";

      //--------------------------------------------------
      // Response
      //--------------------------------------------------

      return Response.json({
        success: true,

        score,
        grade,

        duration: Math.round(
          performance.now() - started,
        ),

        timestamp: new Date().toISOString(),

        summary: {
          passed,
          warnings,
          errors,
        },

        database,
        storage,
        buckets,
        auth,
        policies,
        triggers,
        indexes,
        settings,
        performance: performanceScan,
      });
    } catch (error) {
      console.error(error);

      return Response.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Unknown Error",
        },
        {
          status: 500,
        },
      );
    }
  }),
};
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

import type { AutoHealResult } from "./types.ts";

import { fixSettings } from "./fix-settings.ts";
import { fixStorage } from "./fix-storage.ts";
import { fixIndexes } from "./fix-indexes.ts";
import { fixPolicies } from "./fix-policies.ts";
import { fixTriggers } from "./fix-triggers.ts";
import { fixPerformance } from "./fix-performance.ts";
import { fixAuth } from "./fix-auth.ts";

export default {
  fetch: withSupabase({}, async (_req, ctx) => {

    const started = performance.now();

    const logs: string[] = [];

    let fixed = 0;

    try {

      //--------------------------------------------------
      // Fix Settings
      //--------------------------------------------------

      fixed += await fixSettings(
        ctx.supabaseAdmin,
        logs,
      );

      //--------------------------------------------------
      // Fix Storage
      //--------------------------------------------------

      fixed += await fixStorage(
        ctx.supabaseAdmin,
        logs,
      );

      //--------------------------------------------------
      // Fix Indexes
      //--------------------------------------------------

      fixed += await fixIndexes(
        ctx.supabaseAdmin,
        logs,
      );

      //--------------------------------------------------
      // Fix Policies
      //--------------------------------------------------

      fixed += await fixPolicies(
        ctx.supabaseAdmin,
        logs,
      );

      //--------------------------------------------------
      // Fix Triggers
      //--------------------------------------------------

      fixed += await fixTriggers(
        ctx.supabaseAdmin,
        logs,
      );

      //--------------------------------------------------
      // Auth
      //--------------------------------------------------

      fixed += await fixAuth(
        ctx.supabaseAdmin,
        logs,
      );

      //--------------------------------------------------
      // Performance
      //--------------------------------------------------

      fixed += await fixPerformance(
        ctx.supabaseAdmin,
        logs,
      );

      //--------------------------------------------------
      // Done
      //--------------------------------------------------

      const result: AutoHealResult = {

        success: true,

        fixed,

        duration: Math.round(
          performance.now() - started,
        ),

        logs,

      };

      return Response.json(result);

    } catch (e) {

      logs.push(
        e instanceof Error
          ? e.message
          : "Unknown Error",
      );

      return Response.json(

        {

          success: false,

          fixed,

          duration: Math.round(
            performance.now() - started,
          ),

          logs,

        },

        {

          status: 500,

        },

      );

    }

  }),
};
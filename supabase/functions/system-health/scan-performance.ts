import type { PerformanceResult } from "./types.ts";

export async function scanPerformance(
  supabase: any,
): Promise<PerformanceResult> {

  const started = performance.now();

  try {

    //--------------------------------------------------
    // Simple Database Query
    //--------------------------------------------------

    const {
      error,
    } = await supabase
      .from("settings")
      .select("id")
      .limit(1);

    if (error) throw error;

    //--------------------------------------------------
    // Time
    //--------------------------------------------------

    const duration =
      Math.round(
        performance.now() - started,
      );

    //--------------------------------------------------
    // Score
    //--------------------------------------------------

    let status: "excellent" | "good" | "slow";

    if (duration < 150) {

      status = "excellent";

    }

    else if (duration < 400) {

      status = "good";

    }

    else {

      status = "slow";

    }

    return {

      ok: true,

      duration,

      status,

      message:
        `Database responded in ${duration} ms`,

    };

  }

  catch (error) {

    return {

      ok: false,

      duration: 0,

      status: "slow",

      message:
        error instanceof Error
          ? error.message
          : "Performance Scan Failed",

    };

  }

}
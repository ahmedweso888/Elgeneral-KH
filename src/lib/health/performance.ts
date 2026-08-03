import type { HealthItem } from "./scan";
import { updateHealth } from "./scan";

export interface PerformanceScanResult {
  ok: boolean;

  databaseMs: number;

  storageMs: number;

  functionsMs: number;
}

export async function scanPerformance(
  list: HealthItem[],
  result: PerformanceScanResult,
) {

  list = updateHealth(list, "performance", {

    status: "running",

    progress: 40,

    message: "Running benchmarks...",

  });

  //--------------------------------------------------
  // Worst Response
  //--------------------------------------------------

  const worst = Math.max(

    result.databaseMs,

    result.storageMs,

    result.functionsMs,

  );

  //--------------------------------------------------
  // Status
  //--------------------------------------------------

  let status: "success" | "warning" | "error";

  if (worst >= 1000) {

    status = "error";

  }

  else if (worst >= 500) {

    status = "warning";

  }

  else {

    status = "success";

  }

  //--------------------------------------------------
  // Message
  //--------------------------------------------------

  const message =
    `DB ${result.databaseMs}ms • ` +
    `Storage ${result.storageMs}ms • ` +
    `Functions ${result.functionsMs}ms`;

  //--------------------------------------------------

  list = updateHealth(list, "performance", {

    status,

    progress: 100,

    message,

  });

  return list;

}
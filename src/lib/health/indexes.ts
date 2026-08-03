import type { HealthItem } from "./scan";
import { updateHealth } from "./scan";

export interface IndexScanResult {
  ok: boolean;
  total: number;
  missing: string[];
}

export async function scanIndexes(
  list: HealthItem[],
  result: IndexScanResult
) {
  list = updateHealth(list, "indexes", {
    status: "running",
    progress: 15,
    message: "Checking indexes...",
  });

  if (result.ok) {
    list = updateHealth(list, "indexes", {
      status: "success",
      progress: 100,
      message: `${result.total} indexes verified`,
    });
  } else {
    list = updateHealth(list, "indexes", {
      status: "warning",
      progress: 100,
      message:
        result.missing.length > 0
          ? `Missing: ${result.missing.join(", ")}`
          : "Index issues detected",
    });
  }

  return list;
}
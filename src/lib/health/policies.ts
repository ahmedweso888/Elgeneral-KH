import type { HealthItem } from "./scan";
import { updateHealth } from "./scan";

export interface PolicyScanResult {
  ok: boolean;
  total: number;
  issues: string[];
}

export async function scanPolicies(
  list: HealthItem[],
  result: PolicyScanResult
) {
  list = updateHealth(list, "policies", {
    status: "running",
    progress: 25,
    message: "Checking RLS Policies...",
  });

  if (result.ok) {
    list = updateHealth(list, "policies", {
      status: "success",
      progress: 100,
      message: `${result.total} policies verified`,
    });
  } else {
    list = updateHealth(list, "policies", {
      status: "error",
      progress: 100,
      message:
        result.issues.length > 0
          ? result.issues.join(" • ")
          : "Policy errors detected",
    });
  }

  return list;
}
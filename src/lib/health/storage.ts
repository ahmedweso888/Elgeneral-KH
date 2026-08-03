import type { HealthItem } from "./scan";
import { updateHealth } from "./scan";

export interface StorageScanResult {
  ok: boolean;
  buckets: number;
  files: number;
  message: string;
}

export async function scanStorage(
  list: HealthItem[],
  result: StorageScanResult
) {
  list = updateHealth(list, "storage", {
    status: "running",
    progress: 20,
    message: "Checking storage...",
  });

  if (result.ok) {
    list = updateHealth(list, "storage", {
      status: "success",
      progress: 100,
      message: `${result.buckets} buckets • ${result.files} files`,
    });
  } else {
    list = updateHealth(list, "storage", {
      status: "error",
      progress: 100,
      message: result.message,
    });
  }

  return list;
}
import { invokeFunction } from "@/lib/functions";
import type { ScanResult } from "./types";

export async function runSystemHealth(): Promise<ScanResult> {
  const data = await invokeFunction(
    "system-health",
    {}
  );

  return data as ScanResult;
}
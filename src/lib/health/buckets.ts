import type { HealthItem } from "./scan";
import { updateHealth } from "./scan";

export const REQUIRED_BUCKETS = [
  "avatars",
  "exam-questions",
  "exam-images",
  "history-images",
  "videos",
  "video-thumbnails",
  "events",
  "weekly-question-images",
  "attachments",
  "logos",
  "live",
  "event-images",
  "announcement-images",
];

export interface BucketScanResult {
  ok: boolean;
  existing: string[];
}

export async function scanBuckets(
  list: HealthItem[],
  result: BucketScanResult
) {
  list = updateHealth(list, "buckets", {
    status: "running",
    progress: 25,
    message: "Checking buckets...",
  });

  const missing = REQUIRED_BUCKETS.filter(
    (bucket) => !result.existing.includes(bucket)
  );

  if (missing.length === 0) {
    list = updateHealth(list, "buckets", {
      status: "success",
      progress: 100,
      message: `${REQUIRED_BUCKETS.length} buckets OK`,
    });
  } else {
    list = updateHealth(list, "buckets", {
      status: "error",
      progress: 100,
      message: `Missing: ${missing.join(", ")}`,
    });
  }

  return list;
}
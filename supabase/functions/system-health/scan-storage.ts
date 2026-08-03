import type { StorageResult } from "./types.ts";

export async function scanStorage(
  _supabase: any
): Promise<StorageResult> {

  return {

    ok: true,

    buckets: 13,

    files: 0,

  };

}
const REQUIRED_BUCKETS = [
  {
    id: "avatars",
    public: true,
  },
  {
    id: "videos",
    public: false,
  },
  {
    id: "exam-pdfs",
    public: false,
  },
  {
    id: "weekly",
    public: false,
  },
  {
    id: "event-images",
    public: true,
  },
];

export async function fixStorage(
  supabase: any,
  log: string[],
): Promise<number> {

  let fixed = 0;

  //--------------------------------------------------
  // Existing Buckets
  //--------------------------------------------------

  const {
    data,
    error,
  } = await supabase.storage.listBuckets();

  if (error) {

    log.push(
      `❌ Storage Error: ${error.message}`,
    );

    return 0;

  }

  const existing =
    new Set(
      data.map((x: any) => x.id),
    );

  //--------------------------------------------------
  // Create Missing
  //--------------------------------------------------

  for (const bucket of REQUIRED_BUCKETS) {

    if (
      existing.has(bucket.id)
    ) continue;

    const { error } =
      await supabase.storage.createBucket(
        bucket.id,
        {
          public: bucket.public,
        },
      );

    if (error) {

      log.push(
        `❌ Failed creating ${bucket.id}`,
      );

      continue;

    }

    fixed++;

    log.push(
      `✔ Bucket created: ${bucket.id}`,
    );

  }

  //--------------------------------------------------

  if (fixed === 0) {

    log.push(
      "✔ Storage healthy",
    );

  }

  return fixed;

}
export async function fixPerformance(
  supabase: any,
  log: string[],
): Promise<number> {

  let fixed = 0;

  //--------------------------------------------------
  // Database Ping
  //--------------------------------------------------

  const dbStart = performance.now();

  const {
    error: dbError,
  } = await supabase
    .from("settings")
    .select("id")
    .limit(1);

  const dbTime =
    Math.round(
      performance.now() - dbStart,
    );

  if (dbError) {

    log.push(
      "❌ Database unreachable",
    );

  } else {

    log.push(
      `✔ Database ${dbTime} ms`,
    );

  }

  //--------------------------------------------------
  // Storage Ping
  //--------------------------------------------------

  const storageStart =
    performance.now();

  const {
    error: storageError,
  } =
    await supabase
      .storage
      .listBuckets();

  const storageTime =
    Math.round(
      performance.now() -
      storageStart,
    );

  if (storageError) {

    log.push(
      "❌ Storage unreachable",
    );

  } else {

    log.push(
      `✔ Storage ${storageTime} ms`,
    );

  }

  //--------------------------------------------------
  // Summary
  //--------------------------------------------------

  const average =
    Math.round(
      (dbTime + storageTime) / 2,
    );

  if (average < 150) {

    log.push(
      "🚀 Performance Excellent",
    );

  }

  else if (average < 400) {

    log.push(
      "🟢 Performance Good",
    );

  }

  else {

    log.push(
      "🟡 Performance Slow",
    );

  }

  return fixed;

}
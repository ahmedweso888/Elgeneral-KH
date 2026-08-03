export async function fixIndexes(
  supabase: any,
  log: string[],
): Promise<number> {

  const {

    data,

    error,

  } = await supabase.rpc(
    "system_health_fix_indexes",
  );

  if (error) {

    log.push(
      `❌ Index repair failed: ${error.message}`,
    );

    return 0;

  }

  log.push(
    `✔ Index repair completed (${data})`,
  );

  return Number(data ?? 0);

}
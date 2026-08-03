export async function fixTriggers(
  supabase: any,
  log: string[],
): Promise<number> {

  const {
    data,
    error,
  } = await supabase.rpc(
    "system_health_fix_triggers",
  );

  if (error) {

    log.push(
      `❌ Trigger repair failed: ${error.message}`,
    );

    return 0;

  }

  log.push(
    `✔ Trigger repair completed (${data})`,
  );

  return Number(data ?? 0);

}
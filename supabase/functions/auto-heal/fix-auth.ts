import { success, warning } from "./utils.ts";

export async function fixAuth(
  supabase: any,
  logs: string[],
): Promise<number> {

  let fixed = 0;

  try {

    const {
      data,
      error,
    } = await supabase.auth.admin.listUsers();

    if (error) {

      warning(
        logs,
        `Auth: ${error.message}`,
      );

      return fixed;

    }

    success(
      logs,
      `${data.users.length} user(s) found`,
    );

  } catch (e) {

    warning(
      logs,
      e instanceof Error
        ? e.message
        : "Unknown Auth Error",
    );

  }

  return fixed;

}
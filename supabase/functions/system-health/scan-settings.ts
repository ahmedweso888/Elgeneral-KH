import type { SettingsResult } from "./types.ts";

export async function scanSettings(
  supabase: any,
): Promise<SettingsResult> {
  try {
    //--------------------------------------------------
    // Load Settings
    //--------------------------------------------------

    const {
      data,
      error,
    } = await supabase
      .from("settings")
      .select("*");

    if (error) throw error;

    //--------------------------------------------------
    // Exists
    //--------------------------------------------------

    if (!data || data.length === 0) {
      return {
        ok: false,

        configured: false,

        rows: 0,

        issues: [
          "Settings table is empty",
        ],

        message:
          "No Settings Found",
      };
    }

    //--------------------------------------------------
    // Only One Row
    //--------------------------------------------------

    const settings = data[0];

    const issues: string[] = [];

    if (data.length > 1) {
      issues.push(
        "More than one settings row found",
      );
    }

    if (!settings.academy_name)
      issues.push("academy_name");

    if (!settings.logo_url)
      issues.push("logo_url");

    if (!settings.hero_image)
      issues.push("hero_image");

    if (!settings.support_email)
      issues.push("support_email");

    if (!settings.whatsapp_number)
      issues.push("whatsapp_number");

    return {
      ok: issues.length === 0,

      configured: true,

      rows: data.length,

      issues,

      message:
        issues.length === 0
          ? "Settings OK"
          : `${issues.length} Setting Issue(s)`,
    };
  } catch (error) {
    return {
      ok: false,

      configured: false,

      rows: 0,

      issues: [],

      message:
        error instanceof Error
          ? error.message
          : "Settings Scan Failed",
    };
  }
}
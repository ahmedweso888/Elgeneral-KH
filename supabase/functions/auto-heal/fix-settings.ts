export async function fixSettings(
  supabase: any,
  log: string[],
): Promise<number> {

  //--------------------------------------------------
  // Load
  //--------------------------------------------------

  const {
    data,
    error,
  } = await supabase
    .from("settings")
    .select("*");

  if (error) {

    log.push(
      "❌ Unable to load settings",
    );

    return 0;

  }

  //--------------------------------------------------
  // No Row
  //--------------------------------------------------

  if (!data || data.length === 0) {

    const { error } =
      await supabase
        .from("settings")
        .insert({

          academy_name: "",

          logo_url: "",

          hero_image: "",

          whatsapp_number: "",

          facebook_url: "",

          telegram_url: "",

          youtube_url: "",

          tiktok_url: "",

          instagram_url: "",

          location: "",

          support_email: "",

          ai_enabled: true,

          weekly_question_enabled: true,

          leaderboard_enabled: true,

          maintenance_mode: false,

        });

    if (error) {

      log.push(
        "❌ Failed creating settings row",
      );

      return 0;

    }

    log.push(
      "✔ Settings row created",
    );

    return 1;

  }

  //--------------------------------------------------
  // Multiple Rows
  //--------------------------------------------------

  if (data.length > 1) {

    log.push(
      "⚠ Multiple settings rows detected",
    );

  }

  //--------------------------------------------------
  // Validate
  //--------------------------------------------------

  const row = data[0];

  const missing: string[] = [];

  const check = (
    value: any,
    field: string,
  ) => {

    if (

      value === null ||

      value === "" ||

      value === "غير موجود" ||

      value === "لا يوجد"

    ) {

      missing.push(field);

    }

  };

  check(
    row.academy_name,
    "academy_name",
  );

  check(
    row.logo_url,
    "logo_url",
  );

  check(
    row.hero_image,
    "hero_image",
  );

  check(
    row.support_email,
    "support_email",
  );

  check(
    row.whatsapp_number,
    "whatsapp_number",
  );

  //--------------------------------------------------
  // Nothing
  //--------------------------------------------------

  if (missing.length === 0) {

    log.push(
      "✔ Settings healthy",
    );

  }

  else {

    log.push(

      `⚠ Missing settings: ${missing.join(", ")}`,

    );

  }

  //--------------------------------------------------
  // Fix Boolean Values
  //--------------------------------------------------

  const update: Record<string, any> = {};

  let fixed = 0;

  if (row.ai_enabled == null) {

    update.ai_enabled = true;

    fixed++;

  }

  if (
    row.weekly_question_enabled == null
  ) {

    update.weekly_question_enabled = true;

    fixed++;

  }

  if (
    row.leaderboard_enabled == null
  ) {

    update.leaderboard_enabled = true;

    fixed++;

  }

  if (
    row.maintenance_mode == null
  ) {

    update.maintenance_mode = false;

    fixed++;

  }

  if (fixed > 0) {

    await supabase

      .from("settings")

      .update(update)

      .eq("id", row.id);

    log.push(
      `✔ Fixed ${fixed} setting value(s)`,
    );

  }

  return fixed;

}
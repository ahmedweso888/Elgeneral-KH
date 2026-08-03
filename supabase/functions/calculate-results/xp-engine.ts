export async function xpEngine(
  ctx: any,
  result: any
) {
  //----------------------------------
  // Calculate XP
  //----------------------------------

  let xp = result.totalScore * 10;

  if (result.percentage === 100) {
    xp += 100;
  }

  //----------------------------------
  // Load Student
  //----------------------------------

  const {
    data: student,
    error,
  } = await ctx.supabaseAdmin
    .from("students")
    .select("id, xp")
    .eq("id", result.student_id)
    .single();

  if (error || !student) {
    return;
  }

  //----------------------------------
  // Update XP
  //----------------------------------

  const { error: updateError } =
    await ctx.supabaseAdmin
      .from("students")
      .update({
        xp: (student.xp ?? 0) + xp,
      })
      .eq("id", result.student_id);

  if (updateError) {
    console.error(updateError);
  }
}
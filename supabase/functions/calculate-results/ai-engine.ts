export async function aiEngine(

  ctx:any,

  result:any

){

  //--------------------------------------------------
  // Save Prediction Data
  //--------------------------------------------------

  await ctx.supabaseAdmin

    .from("ai_predictions")

    .insert({

      student_id:

        result.student_id,

      exam_id:

        result.exam_id,

      score:

        result.totalScore,

      percentage:

        result.percentage,

      correct_answers:

        result.correctCount,

      wrong_answers:

        result.wrongCount,

      created_at:

        new Date().toISOString(),

    });

}
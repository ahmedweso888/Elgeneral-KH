export async function activityEngine(

  ctx:any,

  result:any

){

  //--------------------------------------------------
  // Calculate Rewards
  //--------------------------------------------------

  let xp=

    result.totalScore*10;

  if(result.percentage===100){

    xp+=100;

  }

  let coins=

    Math.floor(result.percentage);

  if(result.percentage===100){

    coins+=20;

  }

  //--------------------------------------------------
  // Create Activity
  //--------------------------------------------------

  await ctx.supabaseAdmin

    .from("student_activity")

    .insert({

      student_id:

        result.student_id,

      activity_type:

        "exam_completed",

      reference_id:

        result.exam_id,

      points:

        xp,

      details:

        JSON.stringify({

          exam_id:

            result.exam_id,

          score:

            result.totalScore,

          percentage:

            result.percentage,

          xp,

          coins,

          correct:

            result.correctCount,

          wrong:

            result.wrongCount,

        }),

      created_at:

        new Date().toISOString(),

    });

  //--------------------------------------------------
  // Achievement
  //--------------------------------------------------

  if(result.percentage===100){

    await ctx.supabaseAdmin

      .from("student_activity")

      .insert({

        student_id:

          result.student_id,

        activity_type:

          "perfect_score",

        reference_id:

          result.exam_id,

        points:100,

        details:

          "Full Mark Achievement",

        created_at:

          new Date().toISOString(),

      });

  }

}
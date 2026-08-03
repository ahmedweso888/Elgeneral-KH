export async function notificationEngine(

  ctx:any,

  result:any

){

  //--------------------------------------------------
  // XP
  //--------------------------------------------------

  let xp=

    result.totalScore*10;

  if(result.percentage===100){

    xp+=100;

  }

  //--------------------------------------------------
  // Coins
  //--------------------------------------------------

  let coins=

    Math.floor(result.percentage);

  if(result.percentage===100){

    coins+=20;

  }

  //--------------------------------------------------
  // Main Notification
  //--------------------------------------------------

  await ctx.supabaseAdmin

    .from("notifications")

    .insert({

      title:

        "تم تصحيح الامتحان",

      message:

        `حصلت على ${result.totalScore}/${result.totalMarks} | ${xp} XP | ${coins} Coins`,

      student_id:

        result.student_id,

      is_sent:true,

      created_at:

        new Date().toISOString(),

    });

  //--------------------------------------------------
  // Perfect Score
  //--------------------------------------------------

  if(result.percentage===100){

    await ctx.supabaseAdmin

      .from("notifications")

      .insert({

        title:

          "🏆 مبروك",

        message:

          "لقد حصلت على الدرجة النهائية فى الامتحان.",

        student_id:

          result.student_id,

        is_sent:true,

        created_at:

          new Date().toISOString(),

      });

  }

}
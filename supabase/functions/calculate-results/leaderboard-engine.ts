export async function leaderboardEngine(

  ctx:any,

  result:any

){

  //--------------------------------------------------
  // Load Student
  //--------------------------------------------------

  const{

    data:student,

    error,

  }=await ctx.supabaseAdmin

    .from("students")

    .select("xp")

    .eq(

      "id",

      result.student_id

    )

    .single();

  if(error||!student){

    return;

  }

  //--------------------------------------------------
  // Update Student Leaderboard
  //--------------------------------------------------

  await ctx.supabaseAdmin

    .from("leaderboard")

    .upsert({

      student_id:result.student_id,

      total_points:student.xp,

      exams_completed:1,

      weekly_wins:0,

      updated_at:new Date().toISOString(),

    });

  //--------------------------------------------------
  // Reload Leaderboard
  //--------------------------------------------------

  const{

    data:rows,

  }=await ctx.supabaseAdmin

    .from("leaderboard")

    .select("*")

    .order(

      "total_points",

      {

        ascending:false,

      }

    );
    await fetch(
  `${Deno.env.get("SUPABASE_URL")}/functions/v1/ai-prediction`,
  {
    method: "POST",

    headers: {
      Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      studentId: result.student_id,
    }),
  }
);

  //--------------------------------------------------
  // Update Rank
  //--------------------------------------------------

  let rank=1;

  for(

    const row of rows??[]

  ){

    await ctx.supabaseAdmin

      .from("leaderboard")

      .update({

        current_rank:rank,

      })

      .eq(

        "id",

        row.id

      );

    rank++;

  }

}
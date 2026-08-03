export async function kingdomEngine(

  ctx:any,

  result:any

){

  //--------------------------------------------------
  // Load Kingdom
  //--------------------------------------------------

  const{

    data:kingdom,

    error,

  }=await ctx.supabaseAdmin

    .from("kingdom")

    .select("*")

    .eq(

      "student_id",

      result.student_id

    )

    .single();

  if(error||!kingdom){

    return;

  }

  //--------------------------------------------------
  // Rewards
  //--------------------------------------------------

  let gold=

    Math.floor(

      result.percentage

    );

  let xp=

    result.totalScore*10;

  if(result.percentage===100){

    gold+=20;

    xp+=100;

  }

  //--------------------------------------------------
  // Update Kingdom
  //--------------------------------------------------

  await ctx.supabaseAdmin

  .from("kingdom")

  .update({

    gold:
      (kingdom.gold ?? 0) + gold,

    army_power:
      (kingdom.army_power ?? 0) +
      Math.floor(result.totalScore),

    updated_at:
      new Date().toISOString(),

  })

  .eq(

    "student_id",

    result.student_id

  );

}
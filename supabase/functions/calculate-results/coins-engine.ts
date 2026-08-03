export async function coinsEngine(

  ctx:any,

  result:any

){

  //--------------------------------------------------
  // Coins
  //--------------------------------------------------

  let coins=

    Math.floor(

      result.percentage

    );

  if(

    result.percentage===100

  ){

    coins+=20;

  }

  //--------------------------------------------------
  // Load Student
  //--------------------------------------------------

  const{

    data:student,

    error,

  }=await ctx.supabaseAdmin

    .from("students")

    .select("*")

    .eq(

      "id",

      result.student_id

    )

    .single();

  if(error||!student){

    return;

  }

  //--------------------------------------------------
  // Update Coins
  //--------------------------------------------------

  await ctx.supabaseAdmin

    .from("students")

    .update({

      coins:

        (student.coins??0)+coins,

    })

    .eq(

      "id",

      result.student_id

    );

}
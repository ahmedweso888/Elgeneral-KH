export async function levelEngine(

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
  // Calculate Level
  //--------------------------------------------------

  const xp=

    student.xp??0;

  let level=1;

  if(xp>=1000){

    level=2;

  }

  if(xp>=2500){

    level=3;

  }

  if(xp>=5000){

    level=4;

  }

  if(xp>=8000){

    level=5;

  }

  if(xp>=12000){

    level=6;

  }

  if(xp>=17000){

    level=7;

  }

  if(xp>=23000){

    level=8;

  }

  if(xp>=30000){

    level=9;

  }

  if(xp>=40000){

    level=10;

  }

  //--------------------------------------------------
  // Update Level
  //--------------------------------------------------

  await ctx.supabaseAdmin

    .from("students")

    .update({

      level,

    })

    .eq(

      "id",

      result.student_id

    );

}
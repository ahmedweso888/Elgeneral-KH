export async function scoreEngine(
  ctx: any,
  attemptId: string
) {
  //--------------------------------------------------
  // Load Attempt
  //--------------------------------------------------

  const {
    data: attempt,
    error: attemptError,
  } = await ctx.supabaseAdmin
    .from("exam_attempts")
    .select("*")
    .eq("id", attemptId)
    .single();

  if (attemptError || !attempt) {
    return {
      success: false,
      error: "Attempt not found",
    };
  }

  //--------------------------------------------------
  // Load Exam
  //--------------------------------------------------

  const {
    data: exam,
    error: examError,
  } = await ctx.supabaseAdmin
    .from("exams")
    .select("*")
    .eq("id", attempt.exam_id)
    .single();

  if (examError || !exam) {
    return {
      success: false,
      error: "Exam not found",
    };
  }

  //--------------------------------------------------
  // Load Questions
  //--------------------------------------------------

  const {
    data: questions,
    error: questionsError,
  } = await ctx.supabaseAdmin
    .from("exam_questions")
    .select("*")
    .eq("exam_id", exam.id)
    .order("question_number");

  if (questionsError) {
    return {
      success: false,
      error: questionsError.message,
    };
  }

  //--------------------------------------------------
  // Load Answers
  //--------------------------------------------------

  const {
    data: answers,
    error: answersError,
  } = await ctx.supabaseAdmin
    .from("exam_answers")
    .select("*")
    .eq("attempt_id", attempt.id);

  if (answersError) {
    return {
      success: false,
      error: answersError.message,
    };
  }

  //--------------------------------------------------
  // Calculate Score
  //--------------------------------------------------

  let totalScore = 0;
  let correctCount = 0;
  let wrongCount = 0;

  for (const question of questions ?? []) {
    const answer = answers?.find(
      (a: any) =>
        a.question_number ===
        question.question_number
    );

    const isCorrect =
      answer?.selected_answer ===
      question.correct_answer;

    const marks = isCorrect
      ? question.question_marks ?? 1
      : 0;

    if (answer) {
      await ctx.supabaseAdmin
        .from("exam_answers")
        .update({
          is_correct: isCorrect,
          marks_obtained: marks,
        })
        .eq("id", answer.id);
    }

    if (isCorrect) {
      correctCount++;
      totalScore += marks;
    } else {
      wrongCount++;
    }
  }

  //--------------------------------------------------
  // Percentage
  //--------------------------------------------------

  const percentage =
    exam.total_marks > 0
      ? Number(
          (
            (totalScore /
              exam.total_marks) *
            100
          ).toFixed(2)
        )
      : 0;

  //--------------------------------------------------
  // Save Result
  //--------------------------------------------------

  const {
    data: result,
    error: resultError,
  } = await ctx.supabaseAdmin
    .from("results")
    .upsert({
      exam_id: exam.id,
      student_id: attempt.student_id,
      score: totalScore,
      total_marks: exam.total_marks,
      percentage,
      correct_answers: correctCount,
      wrong_answers: wrongCount,
      submitted_at:
        attempt.created_at,
      created_at:
        new Date().toISOString(),
    })
    .select()
    .single();

  if (resultError) {
    return {
      success: false,
      error: resultError.message,
    };
  }

  //--------------------------------------------------
  // Update Attempt
  //--------------------------------------------------

  await ctx.supabaseAdmin
    .from("exam_attempts")
    .update({
      score: totalScore,
      percentage,
      status: "completed",
      corrected_at:
        new Date().toISOString(),
      finished_at:
        new Date().toISOString(),
    })
    .eq("id", attempt.id);

  //--------------------------------------------------
  // Return
  //--------------------------------------------------

  return {
    success: true,
    exam,
    attempt,
    result,
    student_id:
      attempt.student_id,
    exam_id: exam.id,
    totalScore,
    percentage,
    correctCount,
    wrongCount,
    totalMarks:
      exam.total_marks,
  };
}
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const GEMINI_API_KEY =
  Deno.env.get("GEMINI_API_KEY")!;

export default {
  fetch: withSupabase(
    {},

    async (req, ctx) => {

      try {

        const { studentId } = await req.json();

        //--------------------------------------------------
        // Student
        //--------------------------------------------------

        const {
          data: student,
          error: studentError,
        } = await ctx.supabaseAdmin
          .from("students")
          .select("*")
          .eq("id", studentId)
          .single();

        if (studentError) throw studentError;

        //--------------------------------------------------
        // Results
        //--------------------------------------------------

        const {
          data: results,
        } = await ctx.supabaseAdmin
          .from("results")
          .select(`
            *,
            exams(title)
          `)
          .eq("student_id", studentId)
          .order("created_at", {
            ascending: true,
          });

        //--------------------------------------------------
        // Weekly Questions
        //--------------------------------------------------

        const {
          data: weekly,
        } = await ctx.supabaseAdmin
          .from("weekly_answers")
          .select("*")
          .eq("student_id", studentId);

        //--------------------------------------------------
        // Leaderboard
        //--------------------------------------------------

        const {
          data: leaderboard,
        } = await ctx.supabaseAdmin
          .from("leaderboard")
          .select("*")
          .eq("student_id", studentId)
          .maybeSingle();

        //--------------------------------------------------
        // Statistics
        //--------------------------------------------------

        const totalExams =
          results?.length ?? 0;

        const totalScore =
          results?.reduce(
            (sum: number, item: any) =>
              sum + (item.score ?? 0),
            0
          ) ?? 0;

        const averageScore =
          totalExams === 0
            ? 0
            : Math.round(totalScore / totalExams);

        const weeklyCorrect =
          weekly?.filter(
            (q: any) => q.is_correct
          ).length ?? 0;

        const weeklyWrong =
          (weekly?.length ?? 0) -
          weeklyCorrect;

        //--------------------------------------------------
        // Prompt
        //--------------------------------------------------

        const prompt = `
أنت المستر خالد هاشم.

مدرس تاريخ ثانوي مصري.

قم بتحليل الطالب التالي.

الاسم:
${student.full_name}

الصف:
${student.grade}

المستوى:
${student.level}

XP:
${student.xp}

Coins:
${student.coins}

ترتيبه:
${leaderboard?.current_rank ?? "غير معروف"}

عدد الامتحانات:
${totalExams}

متوسط الدرجات:
${averageScore}

نتائج الامتحانات:

${JSON.stringify(results)}

نتائج الأسئلة الأسبوعية:

عدد الإجابات الصحيحة:
${weeklyCorrect}

عدد الإجابات الخاطئة:
${weeklyWrong}

اعتمد فقط على البيانات السابقة.

لا تخترع أي معلومات.

أعد JSON فقط بالشكل التالي:

{
  "predicted_score":95,
  "strengths":"...",
  "weaknesses":"...",
  "study_plan":"...",
  "ai_comment":"..."
}

بدون أي كلام خارج JSON.
`;

        //--------------------------------------------------
        // Gemini
        //--------------------------------------------------
                const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Gemini request failed");
        }

        const gemini = await response.json();

        const text =
          gemini.candidates?.[0]
            ?.content?.parts?.[0]
            ?.text ?? "{}";

        //--------------------------------------------------
// Parse JSON
//--------------------------------------------------

let ai;

try {
  ai = JSON.parse(text);
} catch {
  const clean = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  ai = JSON.parse(clean);
}

//--------------------------------------------------
// Normalize
//--------------------------------------------------

if (Array.isArray(ai.strengths)) {
  ai.strengths = ai.strengths.join("\n");
}

if (Array.isArray(ai.weaknesses)) {
  ai.weaknesses = ai.weaknesses.join("\n");
}

if (Array.isArray(ai.study_plan)) {
  ai.study_plan = ai.study_plan.join("\n");
}

//--------------------------------------------------
// Save Prediction
//--------------------------------------------------

await ctx.supabaseAdmin
  .from("ai_predictions")
  .upsert(
    {
      student_id: studentId,
      predicted_score: ai.predicted_score ?? 0,
      strengths: ai.strengths ?? "",
      weaknesses: ai.weaknesses ?? "",
      study_plan: ai.study_plan ?? "",
      ai_comment: ai.ai_comment ?? "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "student_id",
    }
  );

//--------------------------------------------------
// Done
//--------------------------------------------------

return Response.json({
  success: true,
  prediction: ai,
});

      } catch (error) {

        console.error(error);

        return Response.json(
          {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Unknown Error",
          },
          {
            status: 500,
          }
        );

      }

    },

  ),

};
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const GEMINI_API_KEY =
  Deno.env.get("GEMINI_API_KEY")!;

export default {
  fetch: withSupabase(
    {},

    async (req, ctx) => {

      try {

        const {
          studentId,
          message,
        } = await req.json();

        if (!studentId || !message) {
          return Response.json(
            {
              error: "studentId and message are required",
            },
            {
              status: 400,
            }
          );
        }

        //-----------------------------------------
        // Student
        //-----------------------------------------

        const {
          data: student,
          error: studentError,
        } = await ctx.supabaseAdmin
          .from("students")
          .select("*")
          .eq("id", studentId)
          .single();

        if (studentError) throw studentError;

        //-----------------------------------------
        // Prediction
        //-----------------------------------------

        const {
          data: prediction,
        } = await ctx.supabaseAdmin
          .from("ai_predictions")
          .select("*")
          .eq("student_id", studentId)
          .maybeSingle();

        //-----------------------------------------
        // Results
        //-----------------------------------------

        const {
          data: results,
        } = await ctx.supabaseAdmin
          .from("results")
          .select("*")
          .eq("student_id", studentId)
          .order("created_at");

        //-----------------------------------------
        // Prompt
        //-----------------------------------------

        const prompt = `
أنت المستر خالد هاشم.

مدرس تاريخ ثانوية عامة في مصر.

أجب على الطالب بنفس أسلوب المستر.

لا تخرج أبداً عن مادة التاريخ.

إذا سأل عن أي شيء خارج التاريخ
قل له بلطف أن هذا خارج تخصصك.

======================

بيانات الطالب

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

======================

نتائج الامتحانات

${JSON.stringify(results)}

======================

توقع الذكاء الاصطناعي

${JSON.stringify(prediction)}

======================

سؤال الطالب

${message}

اجب بالعربية فقط.
`;
        //-----------------------------------------
        // Gemini
        //-----------------------------------------

       const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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

const gemini = await response.json();

if (!response.ok) {
  console.log(gemini);
  throw new Error(JSON.stringify(gemini));
}

const reply =
  gemini.candidates?.[0]?.content?.parts?.[0]?.text ??
  "عذراً، لم أتمكن من الإجابة حالياً.";

        //-----------------------------------------
        // Return
        //-----------------------------------------

        return Response.json({
          success: true,
          reply,
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
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute(
  "/_authenticated/exams/$examId"
)({
  component: ExamPage,
});

function ExamPage() {
  const { examId } = Route.useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [exam, setExam] =
    useState<any>(null);

  const [questions, setQuestions] =
    useState<any[]>([]);

  const [answers, setAnswers] =
    useState<Record<number, string>>({});

  const [attemptId, setAttemptId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    if (user) {
      loadExam();
    }
  }, [user]);

  async function loadExam() {
    if (!user) return;

    setLoading(true);

    try {
      const {
        data: examData,
        error: examError,
      } = await supabase
        .from("exams")
        .select("*")
        .eq("id", examId)
        .eq("is_published", true)
        .single();

      if (examError) throw examError;

      const now = new Date();

      if (
        examData.start_at &&
        new Date(examData.start_at) > now
      ) {
        generalToast.error("الامتحان لم يبدأ بعد");

        navigate({
          to: "/exams",
        });

        return;
      }

      if (
        examData.end_at &&
        new Date(examData.end_at) < now
      ) {
        generalToast.error("انتهى وقت الامتحان");

        navigate({
          to: "/exams",
        });

        return;
      }

      const { count } = await supabase
        .from("exam_attempts")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("exam_id", examId)
        .eq("student_id", user.id);

      if (
        examData.attempts_allowed &&
        (count ?? 0) >=
          examData.attempts_allowed
      ) {
        generalToast.error(
          "لقد استنفذت جميع المحاولات"
        );

        navigate({
          to: "/exams",
        });

        return;
      }

      const {
        data: questionsData,
        error: questionsError,
      } = await supabase
        .from("exam_questions")
        .select("*")
        .eq("exam_id", examId)
        .order("question_number");

      if (questionsError)
        throw questionsError;

      const {
        data: attempt,
        error: attemptError,
      } = await supabase
        .from("exam_attempts")
        .insert({
          exam_id: examId,
          student_id: user.id,
          total_marks:
            examData.total_marks,
        })
        .select()
        .single();

      if (attemptError)
        throw attemptError;

      setAttemptId(attempt.id);

      setExam(examData);

      setQuestions(
        questionsData ?? []
      );
    } catch (err: any) {
      generalToast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  function changeAnswer(
    questionNumber: number,
    answer: string
  ) {
    setAnswers((prev) => ({
      ...prev,
      [questionNumber]: answer,
    }));
  }
async function submitExam() {
  if (!user || !attemptId) return;

  setSubmitting(true);

  try {
    //----------------------------------
    // حفظ الإجابات
    //----------------------------------

    const answersToInsert = questions.map(
      (question) => ({
        attempt_id: attemptId,

        exam_id: examId,

        student_id: user.id,

        question_number:
          question.question_number,

        selected_answer:
          answers[
            question.question_number
          ] ?? "",

        answered_at:
          new Date().toISOString(),
      })
    );

    const { error: answersError } =
      await supabase
        .from("exam_answers")
        .insert(answersToInsert);

    if (answersError)
      throw answersError;

    //----------------------------------
    // حساب النتيجة بالكامل
    //----------------------------------

    const {
  data: result,
  error,
} = await supabase.functions.invoke(
  "calculate-results",
  {
    body: {
      attemptId,
    },
  }
);

if (error) throw error;

if (!result.success) {
  throw new Error(result.error);
}

    generalToast.success(
      "تم تسليم الامتحان بنجاح"
    );

    navigate({
      to: "/exams/$examId/result",

      params: {
        examId,
      },

      search: {
        attemptId,
      },
    });
  } catch (err: any) {
    generalToast.error(err.message);
  } finally {
    setSubmitting(false);
  }
}
if (loading) {
  return (
    <div className="flex justify-center py-20 text-xl font-bold">
      جاري تحميل الامتحان...
    </div>
  );
}

return (
  <div className="container mx-auto py-8 max-w-5xl">

    <Card className="p-6 mb-8">

      <h1 className="text-3xl font-black">
        {exam.title}
      </h1>

      <p className="text-muted-foreground mt-2">
        {exam.description}
      </p>

      <div className="mt-4 flex gap-6 text-sm">

        <span>
          ⏱ {exam.duration} دقيقة
        </span>

        <span>
          📝 {questions.length} سؤال
        </span>

        <span>
          ⭐ {exam.total_marks} درجة
        </span>

      </div>

    </Card>

    <div className="space-y-8">

      {questions.map((question) => (

        <Card
          key={question.id}
          className="p-6"
        >

          <div className="mb-5">

            <h2 className="text-xl font-bold">

              السؤال {question.question_number}

            </h2>

            {question.question_text && (

              <p className="mt-3 text-lg">

                {question.question_text}

              </p>

            )}

          </div>

          {question.question_image && (

            <img
              src={question.question_image}
              className="rounded-lg border mb-5 w-full max-h-[500px] object-contain"
            />

          )}

          <RadioGroup
            value={
              answers[
                question.question_number
              ] ?? ""
            }
            onValueChange={(value) =>
              changeAnswer(
                question.question_number,
                value
              )
            }
          >

            <div className="space-y-4">

              {[
                {
                  key: "A",
                  value:
                    question.option_a,
                },
                {
                  key: "B",
                  value:
                    question.option_b,
                },
                {
                  key: "C",
                  value:
                    question.option_c,
                },
                {
                  key: "D",
                  value:
                    question.option_d,
                },
              ].map((option) => (

                <div
                  key={option.key}
                  className="flex items-center gap-3 border rounded-lg p-4 hover:bg-muted cursor-pointer"
                >

                  <RadioGroupItem
                    value={option.key}
                    id={`${question.id}-${option.key}`}
                  />

                  <Label
                    htmlFor={`${question.id}-${option.key}`}
                    className="cursor-pointer flex-1 text-base"
                  >
                    {option.value}
                  </Label>

                </div>

              ))}

            </div>

          </RadioGroup>

        </Card>

      ))}

    </div>

    <div className="mt-10 flex justify-center">

      <Button
        size="lg"
        disabled={submitting}
        onClick={submitExam}
        className="px-10"
      >

        {submitting
          ? "جارى التسليم..."
          : "تسليم الامتحان"}

      </Button>

    </div>

  </div>
);
}

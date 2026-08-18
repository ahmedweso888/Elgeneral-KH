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

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      loadExam();
    }
  }, [user, examId]);

  async function loadExam() {
    if (!user) return;

    setLoading(true);

    try {
      // ==============================
      // تحميل الامتحان
      // ==============================

      const {
        data: examData,
        error: examError,
      } = await supabase
        .from("exams")
        .select("*")
        .eq("id", examId)
        .eq("is_published", true)
        .single();

      if (examError) {
        console.error("EXAM LOAD ERROR:", examError);
        throw examError;
      }

      if (!examData) {
        throw new Error("الامتحان غير موجود");
      }

      setExam(examData);

      // ==============================
      // التحقق من وقت الامتحان
      // ==============================

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

      // ==============================
      // البحث عن محاولة حالية
      // ==============================

      const {
        data: existingAttempt,
        error: existingAttemptError,
      } = await supabase
        .from("exam_attempts")
        .select("*")
        .eq("exam_id", examId)
        .eq("student_id", user.id)
        .order("started_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle();

      if (existingAttemptError) {
        throw existingAttemptError;
      }

      let currentAttempt = existingAttempt;

      // ==============================
      // حساب عدد المحاولات
      // ==============================

      const { count, error: countError } =
        await supabase
          .from("exam_attempts")
          .select("*", {
            count: "exact",
            head: true,
          })
          .eq("exam_id", examId)
          .eq("student_id", user.id);

      if (countError) {
        throw countError;
      }

      // ==============================
      // لو مفيش محاولة حالية ننشئ واحدة
      // ==============================

      if (!currentAttempt) {
        if (
          examData.attempts_allowed &&
          (count ?? 0) >= examData.attempts_allowed
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
          data: newAttempt,
          error: attemptError,
        } = await supabase
          .from("exam_attempts")
          .insert({
            exam_id: examId,
            student_id: user.id,
            total_marks: examData.total_marks,
          })
          .select()
          .single();

        if (attemptError) {
          throw attemptError;
        }

        currentAttempt = newAttempt;
      }

      setAttemptId(currentAttempt.id);

      // ==============================
      // تحميل الأسئلة
      // ==============================

      const {
        data: questionsData,
        error: questionsError,
      } = await supabase
        .from("exam_questions")
        .select("*")
        .eq("exam_id", examId)
        .order("question_number");

      if (questionsError) {
        throw questionsError;
      }

      setQuestions(questionsData ?? []);
    } catch (err: any) {
      console.error("EXAM PAGE ERROR:", err);

      setExam(null);
      setQuestions([]);
      setAttemptId(null);

      generalToast.error(
        err?.message || "حدث خطأ أثناء تحميل الامتحان"
      );
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
      // ==============================
      // حفظ الإجابات
      // ==============================

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

      if (answersError) {
        throw answersError;
      }

      // ==============================
      // حساب النتيجة
      // ==============================

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

      if (error) {
        throw error;
      }

      if (!result?.success) {
        throw new Error(
          result?.error ||
            "فشل حساب نتيجة الامتحان"
        );
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
      console.error(
        "SUBMIT EXAM ERROR:",
        err
      );

      generalToast.error(
        err?.message ||
          "حدث خطأ أثناء تسليم الامتحان"
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-xl font-bold">
        جاري تحميل الامتحان...
      </div>
    );
  }

  // ==============================
  // Exam not found
  // ==============================

  if (!exam) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold">
          تعذر تحميل الامتحان
        </h1>

        <p className="mt-2 text-muted-foreground">
          الامتحان غير موجود أو غير متاح حاليًا.
        </p>

        <Button
          className="mt-6"
          onClick={() =>
            navigate({
              to: "/exams",
            })
          }
        >
          العودة للامتحانات
        </Button>
      </div>
    );
  }

  // ==============================
  // Exam UI
  // ==============================

  return (
    <div className="container mx-auto max-w-5xl py-8">

      <Card className="mb-8 p-6">

        <h1 className="text-3xl font-black">
          {exam.title}
        </h1>

        {exam.description && (
          <p className="mt-2 text-muted-foreground">
            {exam.description}
          </p>
        )}

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
                alt={`السؤال ${question.question_number}`}
                className="mb-5 w-full max-h-[500px] rounded-lg border object-contain"
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
                    className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-muted"
                  >

                    <RadioGroupItem
                      value={option.key}
                      id={`${question.id}-${option.key}`}
                    />

                    <Label
                      htmlFor={`${question.id}-${option.key}`}
                      className="flex-1 cursor-pointer text-base"
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
          disabled={
            submitting ||
            !attemptId ||
            questions.length === 0
          }
          onClick={submitExam}
          className="px-10"
        >

          {submitting
            ? "جاري التسليم..."
            : "تسليم الامتحان"}

        </Button>

      </div>

    </div>
  );
}
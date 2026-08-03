import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generalToast } from "@/lib/general-toast";
import {
  ArrowLeft,
  ImagePlus,
  Trash2,
  Pencil,
  Plus,
} from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/admin/exams/$examId"
)({
  component: AdminExamPage,
});

function AdminExamPage() {
  console.log("ADMIN EXAM PAGE RENDER");

  const { examId } = Route.useParams();

  console.log("EXAM ID =", examId);
  const navigate = useNavigate();

  const [exam, setExam] = useState<any>(null);

  const [questions, setQuestions] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [image, setImage] = useState<File | null>(null);

  const [preview, setPreview] = useState("");

  const [optionA, setOptionA] = useState("");

  const [optionB, setOptionB] = useState("");

  const [optionC, setOptionC] = useState("");

  const [optionD, setOptionD] = useState("");

  const [correctAnswer, setCorrectAnswer] = useState("");

  const [questionMarks, setQuestionMarks] = useState(1);

  useEffect(() => {
    loadExam();
    loadQuestions();
  }, []);

  async function loadExam() {
    const { data, error } = await supabase
      .from("exams")
      .select("*")
      .eq("id", examId)
      .single();

    if (error) {
      generalToast.error(error.message);
      return;
    }

    setExam(data);
  }

  async function loadQuestions() {
    const { data, error } = await supabase
      .from("exam_questions")
      .select("*")
      .eq("exam_id", examId)
      .order("question_number");

    if (error) {
      generalToast.error(error.message);
      return;
    }

    setQuestions(data ?? []);
  }

  function chooseImage(file: File | null) {
    if (!file) return;

    setImage(file);

    const reader = new FileReader();

    reader.onload = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  function resetForm() {
    setEditingId(null);

    setImage(null);

    setPreview("");

    setOptionA("");

    setOptionB("");

    setOptionC("");

    setOptionD("");

    setCorrectAnswer("");

    setQuestionMarks(1);
  }

  async function uploadImage() {
    if (!image) return null;

    const ext = image.name.split(".").pop();

    const fileName =
      `${examId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("exam-images")
      .upload(fileName, image);

    if (error) throw error;

    const { data } = supabase.storage
      .from("exam-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function saveQuestion() {
    try {
      if (
        !optionA ||
        !optionB ||
        !optionC ||
        !optionD
      ) {
        generalToast.error("اكمل جميع البيانات");

        return;
      }

      if (!correctAnswer) {
        generalToast.error("اختر الإجابة الصحيحة");

        return;
      }

      setLoading(true);

      let imageUrl = preview;

      if (image) {
        imageUrl = (await uploadImage()) ?? "";
      }

      if (editingId) {
        const { error } = await supabase
          .from("exam_questions")
          .update({
            question_image: imageUrl,

            option_a: optionA,

            option_b: optionB,

            option_c: optionC,

            option_d: optionD,

            correct_answer: correctAnswer,

            question_marks: questionMarks,
          })
          .eq("id", editingId);

        if (error) throw error;

        generalToast.success("تم تعديل السؤال");
      } else {
        const { error } = await supabase
          .from("exam_questions")
          .insert({
            exam_id: examId,

            question_number:
              questions.length + 1,

            question_image: imageUrl,

            option_a: optionA,

            option_b: optionB,

            option_c: optionC,

            option_d: optionD,

            correct_answer:
              correctAnswer,

            question_marks:
              questionMarks,
          });

        if (error) throw error;

        generalToast.success("تم إضافة السؤال");
      }

      resetForm();

      loadQuestions();
    } catch (err: any) {
      console.log(err);

      generalToast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function deleteQuestion(id: string) {
    if (!confirm("حذف السؤال؟")) return;

    const { error } = await supabase
      .from("exam_questions")
      .delete()
      .eq("id", id);

    if (error) {
      generalToast.error(error.message);

      return;
    }

    generalToast.success("تم حذف السؤال");

    loadQuestions();
  }

  function editQuestion(question: any) {
    setEditingId(question.id);

    setPreview(question.question_image);

    setOptionA(question.option_a);

    setOptionB(question.option_b);

    setOptionC(question.option_c);

    setOptionD(question.option_d);

    setCorrectAnswer(question.correct_answer);

    setQuestionMarks(question.question_marks);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
console.log("Exam Page Loaded");
  return (
    <div className="container mx-auto py-8 space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-black">
            {exam?.title}
          </h1>

          <p className="text-muted-foreground">
            إدارة أسئلة الامتحان
          </p>

        </div>

        <Button
          variant="outline"
          onClick={() =>
            navigate({
              to: "/admin/exams",
            })
          }
        >
          <ArrowLeft className="w-4 h-4 ml-2" />
          رجوع
        </Button>

      </div>

      <Card className="p-6 space-y-5">

        <h2 className="text-2xl font-bold">

          {editingId
            ? "تعديل السؤال"
            : "إضافة سؤال جديد"}

        </h2>

        <div className="space-y-2">

          <Label>
            صورة السؤال
          </Label>

          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              chooseImage(
                e.target.files?.[0] ?? null
              )
            }
          />

        </div>

        {preview && (

          <img
            src={preview}
            className="rounded-lg border w-full max-h-[450px] object-contain"
          />

        )}

        <div className="grid md:grid-cols-2 gap-4">

          <div>

            <Label>الاختيار A</Label>

            <Input
              value={optionA}
              onChange={(e) =>
                setOptionA(
                  e.target.value
                )
              }
            />

          </div>

          <div>

            <Label>الاختيار B</Label>

            <Input
              value={optionB}
              onChange={(e) =>
                setOptionB(
                  e.target.value
                )
              }
            />

          </div>

          <div>

            <Label>الاختيار C</Label>

            <Input
              value={optionC}
              onChange={(e) =>
                setOptionC(
                  e.target.value
                )
              }
            />

          </div>

          <div>

            <Label>الاختيار D</Label>

            <Input
              value={optionD}
              onChange={(e) =>
                setOptionD(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <div>

            <Label>
              الإجابة الصحيحة
            </Label>

            <select
              className="w-full h-10 rounded-md border px-3"
              value={correctAnswer}
              onChange={(e) =>
                setCorrectAnswer(
                  e.target.value
                )
              }
            >

              <option value="">
                اختر
              </option>

              <option value="A">
                A
              </option>

              <option value="B">
                B
              </option>

              <option value="C">
                C
              </option>

              <option value="D">
                D
              </option>

            </select>

          </div>

          <div>

            <Label>
              درجة السؤال
            </Label>

            <Input
              type="number"
              value={questionMarks}
              onChange={(e) =>
                setQuestionMarks(
                  Number(
                    e.target.value
                  )
                )
              }
            />

          </div>

        </div>

        <div className="flex gap-3">

          <Button
            onClick={saveQuestion}
            disabled={loading}
          >

            <Plus className="w-4 h-4 ml-2" />

            {editingId
              ? "حفظ التعديل"
              : "إضافة السؤال"}

          </Button>

          {editingId && (

            <Button
              variant="outline"
              onClick={resetForm}
            >
              إلغاء
            </Button>

          )}

        </div>

      </Card>

      <div className="space-y-5">

        {questions.map((question) => (

          <Card
            key={question.id}
            className="p-6"
          >

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-bold">
                السؤال {question.question_number}
              </h2>

              <div className="flex gap-2">

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    editQuestion(question)
                  }
                >
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    deleteQuestion(question.id)
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </Button>

              </div>

            </div>

            {question.question_image && (

              <img
                src={question.question_image}
                className="rounded-lg border w-full max-h-[450px] object-contain mb-5"
              />

            )}

            <div className="grid md:grid-cols-2 gap-3">

              <Card className="p-3">
                <span className="font-bold">
                  A :
                </span>

                {" "}

                {question.option_a}
              </Card>

              <Card className="p-3">
                <span className="font-bold">
                  B :
                </span>

                {" "}

                {question.option_b}
              </Card>

              <Card className="p-3">
                <span className="font-bold">
                  C :
                </span>

                {" "}

                {question.option_c}
              </Card>

              <Card className="p-3">
                <span className="font-bold">
                  D :
                </span>

                {" "}

                {question.option_d}
              </Card>

            </div>

            <div className="mt-5 flex justify-between">

              <div className="font-bold text-green-600">
                الإجابة الصحيحة :

                {" "}

                {question.correct_answer}
              </div>

              <div className="font-bold">
                الدرجة :

                {" "}

                {question.question_marks}
              </div>

            </div>

          </Card>

        ))}

      </div>

      <div className="flex justify-end">

        <Button
          size="lg"
          onClick={() =>
            navigate({
              to: "/admin/exams",
            })
          }
        >
          إنهاء إعداد الامتحان
        </Button>

      </div>

    </div>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generalToast } from "@/lib/general-toast";
import { Outlet } from "@tanstack/react-router";
import { invokeFunction } from "@/lib/functions";

export const Route = createFileRoute(
  "/_authenticated/admin/exams"
)({
  component: AdminExamsPage,
});

function AdminExamsPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [exams, setExams] = useState<any[]>([]);

  const [cover, setCover] = useState<File | null>(null);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [grade, setGrade] = useState("");

  const [duration, setDuration] = useState(60);

  const [totalMarks, setTotalMarks] = useState(20);

  const [totalQuestions, setTotalQuestions] =
    useState(20);

  const [attemptsAllowed, setAttemptsAllowed] =
    useState(1);

  const [startAt, setStartAt] = useState("");

  const [endAt, setEndAt] = useState("");

  const [resultReleaseAt, setResultReleaseAt] =
    useState("");

  const [allowReview, setAllowReview] =
    useState(true);

  const [showAnswersAfterResult,
    setShowAnswersAfterResult] =
    useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  async function loadExams() {
    setLoading(true);

    const { data, error } =
      await supabase
        .from("exams")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      generalToast.error(error.message);
      setLoading(false);
      return;
    }

    setExams(data ?? []);

    setLoading(false);
  }

  async function uploadCover() {
    if (!cover) return "";

    const fileName =
`${Date.now()}-${Math.random().toString(36).slice(2)}.${
  cover.name.split(".").pop()
}`;

    const { error } =
      await supabase.storage
        .from("exam-images")
        .upload(fileName, cover);

    if (error) throw error;

    const { data } =
      supabase.storage
        .from("exam-images")
        .getPublicUrl(fileName);

    return data.publicUrl;
  }
  async function createExam() {
  try {
    if (!title.trim()) {
      generalToast.error("اكتب عنوان الامتحان");
      return;
    }

    if (!grade) {
      generalToast.error("اختر الصف");
      return;
    }

    if (!cover) {
      generalToast.error("اختر صورة الغلاف");
      return;
    }

    if (!startAt || !endAt || !resultReleaseAt) {
      generalToast.error("حدد جميع المواعيد");
      return;
    }

    if (totalMarks <= 0) {
      generalToast.error("الدرجة النهائية غير صحيحة");
      return;
    }

    if (totalQuestions <= 0) {
      generalToast.error("عدد الأسئلة غير صحيح");
      return;
    }

    const coverImage = await uploadCover();

    const { error } = await supabase
      .from("exams")
      .insert({
        title,
        description,
        grade,

        duration,

        total_marks: totalMarks,

        total_questions: totalQuestions,

        cover_image: coverImage,

        start_at: startAt,

        end_at: endAt,

        result_release_at:
          resultReleaseAt,

        attempts_allowed:
          attemptsAllowed,

        allow_review:
          allowReview,

        show_answers_after_result:
          showAnswersAfterResult,

        status: "draft",

        is_published: false,
      });

    if (error) throw error;

    generalToast.success("تم إنشاء الامتحان");

    setTitle("");

    setDescription("");

    setGrade("");

    setDuration(60);

    setTotalMarks(20);

    setTotalQuestions(20);

    setAttemptsAllowed(1);

    setStartAt("");

    setEndAt("");

    setResultReleaseAt("");

    setAllowReview(true);

    setShowAnswersAfterResult(true);

    setCover(null);

    loadExams();
  } catch (err: any) {
    generalToast.error(err.message);
  }
}

async function publishExam(id: string) {
  try {

    await invokeFunction(
      "publish-exam",
      {
        examId: id,
      }
    );

    generalToast.success(
      "تم نشر الامتحان"
    );

    loadExams();

  } catch (err: any) {

    generalToast.error(err.message);

  }
}

async function unpublishExam(
  id: string
) {

  try {

  await invokeFunction(
    "unpublish-exam",
    {
      examId: id,
    }
  );

  generalToast.success("تم إلغاء نشر الامتحان");

  loadExams();

} catch (err: any) {

  generalToast.error(err.message);

}

}

async function deleteExam(
  id: string
) {

  if (
    !confirm("حذف الامتحان؟")
  )
    return;

  try {

    await invokeFunction(
      "exam-delete",
      {
        examId: id,
      }
    );

    generalToast.success(
      "تم حذف الامتحان"
    );

    loadExams();

  } catch (err: any) {

    generalToast.error(err.message);

  }

}

return (
  <>
  <div className="space-y-8">

    <h1 className="text-4xl font-black">
      إدارة الامتحانات
    </h1>

    <Card className="p-6 space-y-6">

      <h2 className="text-2xl font-bold">
        إنشاء امتحان جديد
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <div>
          <Label>عنوان الامتحان</Label>

          <Input
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />
        </div>

        <div>
          <Label>الصف الدراسي</Label>

          <select
            className="w-full h-10 rounded-md border px-3"
            value={grade}
            onChange={(e) =>
              setGrade(e.target.value)
            }
          >

            <option value="">
              اختر الصف
            </option>

            <option value="أولى ثانوي">
              أولى ثانوي
            </option>

            <option value="ثانية ثانوي">
              ثانية ثانوي
            </option>

            <option value="ثالثة ثانوي">
              ثالثة ثانوي
            </option>

          </select>

        </div>

      </div>

      <div>

        <Label>الوصف</Label>

        <Input
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

      </div>

      <div>

        <Label>صورة الغلاف</Label>

        <Input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setCover(
              e.target.files?.[0] ?? null
            )
          }
        />

      </div>

      <div className="grid md:grid-cols-3 gap-4">

        <div>

          <Label>
            مدة الامتحان
          </Label>

          <Input
            type="number"
            value={duration}
            onChange={(e) =>
              setDuration(
                Number(e.target.value)
              )
            }
          />

        </div>

        <div>

          <Label>
            عدد الأسئلة
          </Label>

          <Input
            type="number"
            value={totalQuestions}
            onChange={(e) =>
              setTotalQuestions(
                Number(e.target.value)
              )
            }
          />

        </div>

        <div>

          <Label>
            الدرجة النهائية
          </Label>

          <Input
            type="number"
            value={totalMarks}
            onChange={(e) =>
              setTotalMarks(
                Number(e.target.value)
              )
            }
          />

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-4">

        <div>

          <Label>
            عدد المحاولات
          </Label>

          <Input
            type="number"
            value={attemptsAllowed}
            onChange={(e) =>
              setAttemptsAllowed(
                Number(e.target.value)
              )
            }
          />

        </div>

        <div>

          <Label>
            بداية الامتحان
          </Label>

          <Input
            type="datetime-local"
            value={startAt}
            onChange={(e) =>
              setStartAt(e.target.value)
            }
          />

        </div>

        <div>

          <Label>
            نهاية الامتحان
          </Label>

          <Input
            type="datetime-local"
            value={endAt}
            onChange={(e) =>
              setEndAt(e.target.value)
            }
          />

        </div>

        <div>

          <Label>
            إعلان النتيجة
          </Label>

          <Input
            type="datetime-local"
            value={resultReleaseAt}
            onChange={(e) =>
              setResultReleaseAt(
                e.target.value
              )
            }
          />

        </div>

      </div>

      <Button
        className="w-full"
        onClick={createExam}
      >
        إنشاء الامتحان
      </Button>

    </Card> 
          <div className="grid lg:grid-cols-2 gap-6">

        {exams.map((exam) => (

          <Card
            key={exam.id}
            className="overflow-hidden"
          >

            <img
              src={exam.cover_image}
              className="w-full h-56 object-cover"
            />

            <div className="p-5 space-y-4">

              <div>

                <h2 className="text-2xl font-bold">
                  {exam.title}
                </h2>

                <p className="text-muted-foreground">
                  {exam.description}
                </p>

              </div>

              <div className="flex flex-wrap gap-3 text-sm">

                <span>
                  📚 {exam.grade}
                </span>

                <span>
                  ⏱ {exam.duration} دقيقة
                </span>

                <span>
                  📝 {exam.total_questions} سؤال
                </span>

                <span>
                  ⭐ {exam.total_marks} درجة
                </span>

              </div>

              <div className="flex flex-wrap gap-2">

                <Button
  onClick={() =>
    exam.is_published
      ? unpublishExam(
          exam.id
        )
      : publishExam(
          exam.id
        )
  }
>
  {exam.is_published
    ? "إلغاء النشر"
    : "نشر الامتحان"}
</Button>

               <Button
  variant="secondary"
  onClick={() => {
    if (!exam?.id) {
      console.error("Exam ID is missing", exam);
      return;
    }

    navigate({
      to: "/admin/exams/$examId",
      params: {
        examId: exam.id,
      },
    });
  }}
>
  إضافة الأسئلة
</Button>

                <Button
                  variant="destructive"
                  onClick={() =>
                    deleteExam(exam.id)
                  }
                >
                  حذف
                </Button>

              </div>

            </div>

          </Card>

        ))}

           </div>

    </div>

    <Outlet />

  </>
  );
}
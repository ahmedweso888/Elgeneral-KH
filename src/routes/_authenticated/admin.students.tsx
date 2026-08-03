import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute(
  "/_authenticated/admin/students"
)({
  component: AdminStudentsPage,
});

function AdminStudentsPage() {

  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState<any[]>([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {

    setLoading(true);

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {

      generalToast.error(error.message);

      setLoading(false);

      return;
    }

    setStudents(data ?? []);

    setLoading(false);
  }
    async function toggleActive(
    id: string,
    value: boolean
  ) {
    const { error } = await supabase
      .from("students")
      .update({
        is_active: value,
      })
      .eq("id", id);

    if (error) {
      generalToast.error(error.message);
      return;
    }

    generalToast.success(
      value
        ? "تم تفعيل الطالب"
        : "تم إيقاف الطالب"
    );

    loadStudents();
  }

  async function toggleAdmin(
    id: string,
    value: boolean
  ) {
    const { error } = await supabase
      .from("students")
      .update({
        is_admin: value,
      })
      .eq("id", id);

    if (error) {
      generalToast.error(error.message);
      return;
    }

    generalToast.success(
      value
        ? "تم تعيينه كأدمن"
        : "تم إلغاء صلاحية الأدمن"
    );

    loadStudents();
  }

  async function deleteStudent(id: string) {

  if (!confirm("حذف الطالب؟")) return;

  const { error } = await supabase.functions.invoke(
    "student-delete",
    {
      body: {
        studentId: id,
      },
    }
  );

  if (error) {
    generalToast.error(error.message);
    return;
  }

  generalToast.success("تم حذف الطالب");

  await loadStudents();
}
async function resetAttempts(studentId: string) {
  if (!confirm("إعادة تصفير جميع محاولات الطالب؟")) return;

  try {
    const { error } = await supabase.functions.invoke(
      "student-reset-attempt",
      {
        body: {
          studentId,
        },
      }
    );

    if (error) throw error;

    generalToast.success("تم تصفير جميع المحاولات");

    loadStudents();
  } catch (err: any) {
    generalToast.error(err.message);
  }
}

  const filteredStudents =
    students.filter((student) =>
      student.full_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      student.email
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      student.grade
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  if (loading) {
    return (
      <div className="p-10">
        جاري تحميل الطلاب...
      </div>
    );
  }
  return (
  <div className="container mx-auto py-8 space-y-8">

    <div className="flex items-center justify-between">

      <div>

        <h1 className="text-4xl font-black">
          إدارة الطلاب
        </h1>

        <p className="text-muted-foreground">
          جميع طلاب المنصة
        </p>

      </div>

      <div className="text-xl font-bold">
        {filteredStudents.length} طالب
      </div>

    </div>

    <Card className="p-5">

      <Input
        placeholder="بحث بالاسم أو البريد أو الصف..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

    </Card>

    <div className="space-y-5">

      {filteredStudents.map((student) => (

        <Card
          key={student.id}
          className="p-6"
        >

          <div className="flex justify-between items-start">

            <div className="space-y-2">

              <h2 className="text-2xl font-bold">
                {student.full_name}
              </h2>

              <p>📧 {student.email}</p>

<p>📚 {student.grade}</p>

<p>⭐ Level {student.level ?? 1}</p>

<p>XP : {student.xp ?? 0}</p>

<p>Coins : {student.coins ?? 0}</p>

<p>
الحالة :
<span
  className={
    student.is_active
      ? "text-green-600 font-bold"
      : "text-red-600 font-bold"
  }
>
  {student.is_active ? "نشط" : "موقوف"}
</span>
</p>

<p>
الصلاحية :
<span
  className={
    student.is_admin
      ? "text-blue-600 font-bold"
      : ""
  }
>
  {student.is_admin ? "Admin" : "Student"}
</span>
</p>

            </div>

            <div className="flex flex-col gap-2">

              <Button
                onClick={() =>
                  toggleActive(
                    student.id,
                    !student.is_active
                  )
                }
              >

                {student.is_active
                  ? "إيقاف"
                  : "تفعيل"}

              </Button>

              <Button
                variant="secondary"
                onClick={() =>
                  toggleAdmin(
                    student.id,
                    !student.is_admin
                  )
                }
              >

                {student.is_admin
                  ? "إلغاء الأدمن"
                  : "تعيين أدمن"}

              </Button>

              <Button
                variant="destructive"
                onClick={() =>
                  deleteStudent(student.id)
                }
              >
                حذف
              </Button>
              <Button
  variant="outline"
  onClick={() => resetAttempts(student.id)}
>
  تصفير المحاولات
</Button>

            </div>

          </div>

        </Card>

      ))}

    </div>

  </div>
);
}
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute(
  "/_authenticated/admin/"
)({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState(0);

  const [videos, setVideos] = useState(0);

  const [exams, setExams] = useState(0);

  const [events, setEvents] = useState(0);

  const [announcements, setAnnouncements] =
    useState(0);

  const [latestExams, setLatestExams] =
    useState<any[]>([]);

  const [latestStudents, setLatestStudents] =
    useState<any[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    setLoading(true);

    try {
      const [
        studentsCount,
        examsCount,
        videosCount,
        eventsCount,
        announcementsCount,
        examsData,
        studentsData,
      ] = await Promise.all([
        supabase
          .from("students")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("exams")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("videos")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("events")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("announcements")
          .select("*", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("exams")
          .select("*")
          .order("created_at", {
            ascending: false,
          })
          .limit(5),

        supabase
          .from("students")
          .select("*")
          .order("created_at", {
            ascending: false,
          })
          .limit(5),
      ]);

      setStudents(studentsCount.count ?? 0);

      setExams(examsCount.count ?? 0);

      setVideos(videosCount.count ?? 0);

      setEvents(eventsCount.count ?? 0);

      setAnnouncements(
        announcementsCount.count ?? 0
      );

      setLatestExams(examsData.data ?? []);

      setLatestStudents(
        studentsData.data ?? []
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-xl">
        جاري تحميل لوحة التحكم...
      </div>
    );
  }
  return (
  <div className="container mx-auto py-8 space-y-8">

    <div>

      <h1 className="text-4xl font-black">
        لوحة تحكم الأدمن
      </h1>

      <p className="text-muted-foreground">
        مرحباً بك فى لوحة إدارة المنصة
      </p>

    </div>

    <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-5">

      <Card className="p-6">

        <h2 className="text-muted-foreground">
          الطلاب
        </h2>

        <div className="text-4xl font-black mt-3">
          {students}
        </div>

      </Card>

      <Card className="p-6">

        <h2 className="text-muted-foreground">
          الامتحانات
        </h2>

        <div className="text-4xl font-black mt-3">
          {exams}
        </div>

      </Card>

      <Card className="p-6">

        <h2 className="text-muted-foreground">
          الفيديوهات
        </h2>

        <div className="text-4xl font-black mt-3">
          {videos}
        </div>

      </Card>

      <Card className="p-6">

        <h2 className="text-muted-foreground">
          الأحداث
        </h2>

        <div className="text-4xl font-black mt-3">
          {events}
        </div>

      </Card>

      <Card className="p-6">

        <h2 className="text-muted-foreground">
          الإعلانات
        </h2>

        <div className="text-4xl font-black mt-3">
          {announcements}
        </div>

      </Card>

    </div>

    <div className="grid lg:grid-cols-3 gap-4">

      <Button
        onClick={() =>
          window.location.href =
            "/admin/students"
        }
      >
        إدارة الطلاب
      </Button>

      <Button
        onClick={() =>
          window.location.href =
            "/admin/exams"
        }
      >
        إدارة الامتحانات
      </Button>

      <Button
        onClick={() =>
          window.location.href =
            "/admin/videos"
        }
      >
        إدارة الفيديوهات
      </Button>

      <Button
        onClick={() =>
          window.location.href =
            "/admin/events"
        }
      >
        إدارة الأحداث
      </Button>

      <Button
        onClick={() =>
          window.location.href =
            "/admin/notifications"
        }
      >
        الإشعارات
      </Button>

      <Button
        onClick={() =>
          window.location.href =
            "/admin/settings"
        }
      >
        إعدادات الموقع
      </Button>

    </div>
          <div className="grid lg:grid-cols-2 gap-8">

        {/* آخر الامتحانات */}

        <Card className="p-6">

          <h2 className="text-xl font-bold mb-5">
            آخر الامتحانات
          </h2>

          <div className="space-y-4">

            {latestExams.length === 0 ? (

              <p className="text-muted-foreground">
                لا توجد امتحانات
              </p>

            ) : (

              latestExams.map((exam) => (

                <div
                  key={exam.id}
                  className="flex justify-between items-center border rounded-lg p-3"
                >

                  <div>

                    <h3 className="font-bold">
                      {exam.title}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {exam.grade}
                    </p>

                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.location.href = `/admin/exams/${exam.id}`
                    }
                  >
                    فتح
                  </Button>

                </div>

              ))

            )}

          </div>

        </Card>

        {/* آخر الطلاب */}

        <Card className="p-6">

          <h2 className="text-xl font-bold mb-5">
            آخر الطلاب
          </h2>

          <div className="space-y-4">

            {latestStudents.length === 0 ? (

              <p className="text-muted-foreground">
                لا يوجد طلاب
              </p>

            ) : (

              latestStudents.map((student) => (

                <div
                  key={student.id}
                  className="flex justify-between items-center border rounded-lg p-3"
                >

                  <div>

                    <h3 className="font-bold">
                      {student.full_name}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {student.grade}
                    </p>

                  </div>

                  <div className="text-sm font-semibold">

                    Level {student.level ?? 1}

                  </div>

                </div>

              ))

            )}

          </div>

        </Card>

      </div>

    </div>

  );

}
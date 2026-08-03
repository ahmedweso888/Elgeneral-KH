import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";

import ProtectedVideoPlayer from "@/components/video/ProtectedVideoPlayer";

export const Route = createFileRoute(
  "/_authenticated/student/live/$liveId"
)({
  component: StudentLivePlayerPage,
});

function StudentLivePlayerPage() {

  const { liveId } = Route.useParams();

  const [loading, setLoading] =
    useState(true);

  const [live, setLive] =
    useState<any>(null);
    const [student, setStudent] =
  useState<any>(null);

  const [relatedLives, setRelatedLives] =
    useState<any[]>([]);

  useEffect(() => {

    loadLive();

  }, []);

  async function loadLive() {

    setLoading(true);
    //----------------------------------
// المستخدم الحالي
//----------------------------------

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {

  setLoading(false);

  return;

}

//----------------------------------
// بيانات الطالب
//----------------------------------

const { data: studentData } =
  await supabase
    .from("students")
    .select("*")
    .eq("id", user.id)
    .single();

setStudent(studentData);

    //----------------------------------
    // بيانات اللايف
    //----------------------------------

    const { data } = await supabase

      .from("live_streams")

      .select("*")

      .eq("id", liveId)

      .single();

    if (!data) {

      setLoading(false);

      return;

    }

    setLive(data);
        //----------------------------------
    // زيادة عدد المشاهدين
    //----------------------------------

    await supabase

      .from("live_streams")

      .update({

        viewers_count: (data.viewers_count ?? 0) + 1,

      })

      .eq("id", liveId);

    //----------------------------------
    // اللايفات المشابهة
    //----------------------------------

    const { data: related } = await supabase

      .from("live_streams")

      .select("*")

      .neq("id", liveId)

      .order("scheduled_at", {

        ascending: true,

      })

      .limit(6);

    setRelatedLives(related ?? []);

    setLoading(false);

  }

  if (loading) {

    return (

      <div className="container mx-auto py-8">

        جاري تحميل اللايف...

      </div>

    );

  }

  if (!live) {

    return (

      <div className="container mx-auto py-8">

        اللايف غير موجود

      </div>

    );

  }
  if (!student) {

  return (

    <div className="container mx-auto py-8">

      جاري تحميل بيانات الطالب...

    </div>

  );

}

  return (

    <div className="container mx-auto py-8">

      <div className="grid xl:grid-cols-3 gap-8">

        <div className="xl:col-span-2 space-y-6">
                      <Card className="overflow-hidden">

            {live.is_live ? (

              <ProtectedVideoPlayer
   src={live.playback_url ?? ""}
    studentName={student?.full_name ?? ""}
studentEmail={student?.email ?? ""}
studentPhone={student?.phone ?? ""}
/>

            ) : live.is_scheduled ? (

              <div className="flex h-[500px] items-center justify-center bg-black text-white">

                <div className="text-center space-y-4">

                  <h2 className="text-3xl font-black">

                    البث لم يبدأ بعد

                  </h2>

                  <p className="text-gray-300">

                    موعد البث

                  </p>

                  <div className="text-2xl font-bold">

                    {live.scheduled_at

                      ? new Date(

                          live.scheduled_at

                        ).toLocaleString("ar-EG")

                      : "-"}

                  </div>

                </div>

              </div>

            ) : (

              <div className="flex h-[500px] items-center justify-center bg-black text-white">

                <div className="text-center space-y-4">

                  <h2 className="text-3xl font-black">

                    انتهى البث

                  </h2>

                  <p className="text-gray-300">

                    هذا البث لم يعد متاحًا.

                  </p>

                </div>

              </div>

            )}

          </Card>

          <Card className="p-6">

            <h1 className="text-3xl font-black">

              {live.title}

            </h1>

            <div className="flex gap-6 mt-4 text-sm text-muted-foreground">

              <span>

                👁 {live.viewers_count ?? 0}

              </span>

              <span>

                📅 {

                  live.scheduled_at

                    ? new Date(

                        live.scheduled_at

                      ).toLocaleString("ar-EG")

                    : "-"

                }

              </span>

            </div>

            {live.description && (

              <p className="mt-6 leading-8 whitespace-pre-wrap">

                {live.description}

              </p>

            )}

          </Card>

        </div>
                <div>

          <Card className="p-5">

            <h2 className="text-xl font-bold mb-5">

              لايفات أخرى

            </h2>

            <div className="space-y-4">

              {relatedLives.length === 0 ? (

                <p className="text-muted-foreground">

                  لا يوجد لايفات أخرى

                </p>

              ) : (

                relatedLives.map((item: any) => (

                  <Link

                    key={item.id}

                    to="/student/live/$liveId"

                    params={{

                      liveId: String(item.id),

                    }}

                  >

                    <div className="border rounded-lg overflow-hidden hover:bg-muted transition hover:shadow-lg">

                      <img

                        src={

                          item.thumbnail_url ||

                          "/placeholder.png"

                        }

                        className="w-full h-36 object-cover"

                      />

                      <div className="p-3 space-y-2">

                        <h3 className="font-bold line-clamp-2">

                          {item.title}

                        </h3>

                        <div className="flex justify-between text-sm text-muted-foreground">

                          <span>

                            👁 {item.viewers_count ?? 0}

                          </span>

                          <span>

                            {item.is_live

                              ? "🔴 مباشر"

                              : item.is_scheduled

                              ? "⏳ قريبًا"

                              : "✅ انتهى"}

                          </span>

                        </div>

                      </div>

                    </div>

                  </Link>

                ))

              )}

            </div>

          </Card>

        </div>
              </div>

    </div>

  );

}

export default StudentLivePlayerPage;
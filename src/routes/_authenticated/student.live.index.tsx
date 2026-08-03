import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute(
  "/_authenticated/student/live/"
)({
  component: StudentLivePage,
});

function StudentLivePage() {

  const [loading, setLoading] =
    useState(true);

  const [lives, setLives] =
    useState<any[]>([]);

  const [filteredLives, setFilteredLives] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    loadLives();

  }, []);

  useEffect(() => {

    if (!search.trim()) {

      setFilteredLives(lives);

      return;

    }

    setFilteredLives(

      lives.filter((live) =>

        live.title

          .toLowerCase()

          .includes(search.toLowerCase())

      )

    );

  }, [search, lives]);

  async function loadLives() {

    setLoading(true);
        const { data } = await supabase

      .from("live_streams")

      .select("*")

      .order("is_live", {

        ascending: false,

      })

      .order("scheduled_at", {

        ascending: true,

      });

    setLives(data ?? []);

    setFilteredLives(data ?? []);

    setLoading(false);

  }

  if (loading) {

    return (

      <div className="p-10 text-xl">

        جاري تحميل اللايفات...

      </div>

    );

  }

  return (

    <div className="container mx-auto py-8 space-y-8">

      <div>

        <h1 className="text-4xl font-black">

          البث المباشر

        </h1>

        <p className="text-muted-foreground mt-2">

          جميع المحاضرات المباشرة الحالية والقادمة.

        </p>

      </div>

      <Card className="p-5">

        <Input

          placeholder="ابحث عن لايف..."

          value={search}

          onChange={(e)=>

            setSearch(e.target.value)

          }

        />

      </Card>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredLives.length === 0 ? (

          <div className="col-span-full text-center py-20">

            <h2 className="text-2xl font-bold">

              لا يوجد بث مباشر

            </h2>

            <p className="text-muted-foreground mt-2">

              لم يتم إضافة أي بث مباشر حتى الآن.

            </p>

          </div>

        ) : (

          filteredLives.map((live) => (

            <Link

              key={live.id}

              to="/student/live/$liveId"

              params={{

                liveId: String(live.id),

              }}

            >

              <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer">

                <img

                  src={

                    live.thumbnail_url ||

                    "/placeholder.png"

                  }

                  className="w-full h-56 object-cover"

                />

                <div className="p-5 space-y-3">

                  <div className="flex justify-between items-center">

                    <h2 className="text-xl font-bold line-clamp-2">

                      {live.title}

                    </h2>

                    {live.is_live ? (

                      <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full animate-pulse">

                        مباشر

                      </span>

                    ) : live.is_scheduled ? (

                      <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full">

                        قريبًا

                      </span>

                    ) : (

                      <span className="bg-gray-500 text-white text-xs px-3 py-1 rounded-full">

                        انتهى

                      </span>

                    )}

                  </div>

                  <p className="text-muted-foreground line-clamp-2">

                    {live.description}

                  </p>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">

                    <span>

                      👁 {live.viewers_count ?? 0} مشاهد

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

                  <div className="pt-2">

                    <div
                      className={`w-full rounded-lg py-2 text-center font-bold text-white ${
                        live.is_live
                          ? "bg-red-600"
                          : live.is_scheduled
                          ? "bg-amber-500"
                          : "bg-gray-500"
                      }`}
                    >

                      {live.is_live
                        ? "🔴 شاهد الآن"
                        : live.is_scheduled
                        ? "⏳ قريبًا"
                        : "📺 مشاهدة التفاصيل"}

                    </div>

                  </div>

                </div>

              </Card>

            </Link>

          ))

        )}

      </div>
           <div className="rounded-xl border bg-card p-6">

        <h2 className="text-2xl font-bold mb-3">

          ملاحظات

        </h2>

        <ul className="space-y-2 text-muted-foreground">

          <li>
            🔴 سيتم ظهور البث المباشر هنا تلقائياً عند بدء المحاضرة.
          </li>

          <li>
            📅 اللايفات المجدولة ستظهر قبل موعدها.
          </li>

          <li>
            👨‍🏫 عند بدء المعلم للبث سيتم تحديث الصفحة تلقائياً.
          </li>

          

        </ul>

      </div>

    </div>

  );

}
export default StudentLivePage;
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute(
  "/_authenticated/student/videos/"
)({
  component: StudentVideosPage,
});

function StudentVideosPage() {

  const [loading, setLoading] =
    useState(true);

  const [videos, setVideos] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  const [gradeFilter, setGradeFilter] =
    useState("الكل");

  const [unitFilter, setUnitFilter] =
    useState("الكل");

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {

    setLoading(true);

    const { data } =
      await supabase
        .from("videos")
        .select("*")
        .eq("is_published", true)
        .order("order_index", {
          ascending: true,
        });

    setVideos(data ?? []);

    setLoading(false);

  }

  //----------------------------------
  // الفلاتر
  //----------------------------------

  const grades = useMemo(() => {

    return [
      "الكل",
      ...new Set(
        videos
          .map((v) => v.grade)
          .filter(Boolean)
      ),
    ];

  }, [videos]);

  const units = useMemo(() => {

    return [
      "الكل",
      ...new Set(
        videos
          .map((v) => v.unit)
          .filter(Boolean)
      ),
    ];

  }, [videos]);

  //----------------------------------
  // البحث
  //----------------------------------

  const filteredVideos = useMemo(() => {

    return videos.filter((video) => {

      const searchOk =
        search === "" ||
        video.title
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const gradeOk =
        gradeFilter === "الكل" ||
        video.grade === gradeFilter;

      const unitOk =
        unitFilter === "الكل" ||
        video.unit === unitFilter;

      return (
        searchOk &&
        gradeOk &&
        unitOk
      );

    });

  }, [
    videos,
    search,
    gradeFilter,
    unitFilter,
  ]);

  if (loading) {

    return (
      <div className="p-10 text-xl">

        جاري تحميل الفيديوهات...

      </div>
    );

  }

  return (

    <div className="container mx-auto py-8 space-y-8">
            <div>

        <h1 className="text-4xl font-black">

          الفيديوهات التعليمية

        </h1>

        <p className="text-muted-foreground mt-2">

          جميع فيديوهات الشرح الخاصة بالأكاديمية

        </p>

      </div>

      <Card className="p-5 space-y-4">

        <Input
          placeholder="ابحث عن فيديو..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <div className="grid md:grid-cols-2 gap-4">

          <select
            className="border rounded-lg p-2"
            value={gradeFilter}
            onChange={(e) =>
              setGradeFilter(e.target.value)
            }
          >

            {grades.map((grade) => (

              <option
                key={grade}
                value={grade}
              >

                {grade}

              </option>

            ))}

          </select>

          <select
            className="border rounded-lg p-2"
            value={unitFilter}
            onChange={(e) =>
              setUnitFilter(e.target.value)
            }
          >

            {units.map((unit) => (

              <option
                key={unit}
                value={unit}
              >

                {unit}

              </option>

            ))}

          </select>

        </div>

      </Card>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredVideos.length === 0 ? (

          <div className="col-span-full text-center py-16">

            <h2 className="text-2xl font-bold">

              لا توجد فيديوهات

            </h2>

          </div>

        ) : (

          filteredVideos.map((video) => (

            <Link
              key={video.id}
              to="/student/videos/$videoId"
              params={{
                videoId: String(video.id),
              }}
            >

              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full">

                <img
                  src={
                    video.thumbnail_url ||
                    video.thumbnail ||
                    "/placeholder.png"
                  }
                  loading="lazy"
                  className="w-full h-56 object-cover"
                />
                                <div className="p-5 space-y-3 flex flex-col h-full">

                  <h2 className="text-xl font-bold line-clamp-2">

                    {video.title}

                  </h2>

                  <p className="text-muted-foreground line-clamp-2 flex-1">

                    {video.description}

                  </p>

                  <div className="flex justify-between text-sm">

                    <span>

                      📚 {video.grade}

                    </span>

                    <span>

                      📖 {video.unit || "بدون وحدة"}

                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span>

                      ⏱ {video.duration ?? 0} دقيقة

                    </span>

                    <span>

                      👁 {video.views ?? 0}

                    </span>

                  </div>

                  <div className="flex justify-between items-center pt-2">

                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        video.is_published
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >

                      {video.is_published
                        ? "منشور"
                        : "مسودة"}

                    </span>

                    <span className="text-xs text-muted-foreground">

                      الترتيب: {video.order_index ?? 0}

                    </span>

                  </div>

                </div>

              </Card>

            </Link>

          ))

        )}

      </div>
          </div>

  );

}

export default StudentVideosPage;
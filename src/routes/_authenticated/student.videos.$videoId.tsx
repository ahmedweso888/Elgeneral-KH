import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import ProtectedVideoPlayer from "@/components/video/ProtectedVideoPlayer";

export const Route = createFileRoute(
  "/_authenticated/student/videos/$videoId"
)({
  component: VideoPlayerPage,
});

function VideoPlayerPage() {
  const { videoId } = Route.useParams();

  const [loading, setLoading] = useState(true);

  const [video, setVideo] = useState<any>(null);

  const [student, setStudent] = useState<any>(null);

  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);

  useEffect(() => {
    loadVideo();
  }, []);

  async function loadVideo() {
  setLoading(true);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !videoId) {
    setLoading(false);
    return;
  }

  const { data: studentData } = await supabase
    .from("students")
    .select("*")
    .eq("id", user.id)
    .single();
  setStudent(studentData);

  const { data: videoData } = await supabase
    .from("videos")
    .select("*")
    .eq("id", videoId)
    .single();

  if (!videoData) {
    setLoading(false);
    return;
  }

  setVideo(videoData);

  await supabase
    .from("videos")
    .update({ views: (videoData.views ?? 0) + 1 })
    .eq("id", videoId);

  if (videoData.grade) {

    const { data: related } = await supabase
      .from("videos")
      .select("*")
      .eq("grade", videoData.grade)
      .neq("id", videoId)
      .eq("is_published", true)
      .limit(6);

    setRelatedVideos(related ?? []);

  }
}

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (!video || !student) {
    return <div className="container mx-auto py-8">Video not found</div>;
  }

  const videoUrl = video.video_url;

  return (
    <div className="container mx-auto py-8">

      <div className="grid xl:grid-cols-3 gap-8">

        <div className="xl:col-span-2 space-y-6">

          <Card className="overflow-hidden">

            <ProtectedVideoPlayer
              src={videoUrl}
              studentName={student?.full_name ?? ""}
              studentEmail={student?.email ?? ""}
              studentPhone={student?.phone ?? ""}
            />

          </Card>

          <Card className="p-6">

            <h1 className="text-3xl font-black">
              {video.title}
            </h1>

            <div className="flex gap-6 mt-4 text-sm text-muted-foreground">

              <span>
                👁 {video.views + 1}
              </span>

              <span>
                📚 {video.grade}
              </span>

              <span>
                🎬 {video.category}
              </span>

              {video.duration && (
                <span>
                  ⏱ {video.duration} دقيقة
                </span>
              )}

            </div>

            {video.description && (
              <p className="mt-6 leading-8">
                {video.description}
              </p>
            )}

          </Card>

        </div>

        <div>

          <Card className="p-5">

            <h2 className="text-xl font-bold mb-5">
              فيديوهات مشابهة
            </h2>

            <div className="space-y-4">

              {relatedVideos.length === 0 ? (

                <p className="text-muted-foreground">
                  لا يوجد فيديوهات مشابهة
                </p>

              ) : (

                relatedVideos.map((item) => (

                  <Link
                    key={item.id}
                    to="/student/videos/$videoId"
                    params={{
                      videoId: String(item.id),
                    }}
                  >

                    <div className="border rounded-lg overflow-hidden hover:bg-muted transition">

                      {item.thumbnail_url && (

                        <img
                          src={item.thumbnail_url}
                          className="w-full h-36 object-cover"
                        />

                      )}

                      <div className="p-3">

                        <h3 className="font-bold line-clamp-2">
                          {item.title}
                        </h3>

                        <div className="flex justify-between text-sm text-muted-foreground mt-2">

                          <span>
                            👁 {item.views ?? 0}
                          </span>

                          <span>
                            📚 {item.grade}
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
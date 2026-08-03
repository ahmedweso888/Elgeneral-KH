import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { invokeFunction } from "@/lib/functions";

import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";

import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute(
  "/_authenticated/admin/videos/"
)({
  component: AdminVideosPage,
});

function AdminVideosPage() {
  const navigate = useNavigate();

  const {
    data: videos = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("order_index", {
          ascending: true,
        });

      if (error) throw error;

      return data;
    },
  });

  async function deleteVideo(id: string) {

  const ok = confirm("هل تريد حذف الفيديو؟");

  if (!ok) return;

  try {

    await invokeFunction(
      "video-delete",
      {
        videoId: id,
      }
    );

    generalToast.success("تم حذف الفيديو");

    refetch();

  } catch (err: any) {

    generalToast.error(err.message);

  }

}

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <h1 className="text-3xl font-black">
          إدارة الفيديوهات
        </h1>

        <Button
          onClick={() =>
            navigate({
              to: "/admin/videos/new",
            })
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          إضافة فيديو
        </Button>

      </div>

      {videos.length === 0 ? (
        <Card className="p-10 text-center">

          <p className="text-muted-foreground">
            لا يوجد فيديوهات حتى الآن.
          </p>

        </Card>
      ) : (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {videos.map((video: any) => (

            <Card
              key={video.id}
              className="overflow-hidden"
            >
              <img
                src={
                  video.thumbnail_url ||
                  "/placeholder.png"
                }
                className="aspect-video w-full object-cover"
              />

              <div className="space-y-4 p-5">

                <div>

                  <h2 className="font-bold text-lg">
                    {video.title}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {video.grade}
                  </p>

                </div>

                <div className="flex gap-2 flex-wrap">

                  <Badge>
                    {video.unit || "بدون وحدة"}
                  </Badge>

                  <Badge variant="secondary">
                    {video.duration || 0} دقيقة
                  </Badge>

                  {video.is_published ? (
                    <Badge className="bg-green-600">
                      منشور
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      مخفي
                    </Badge>
                  )}

                </div>

                <div className="flex gap-2">

                  <Button
                    className="flex-1"
                    onClick={() =>
                      navigate({
                        to: "/admin/videos/$videoId",
                        params: {
                          videoId: video.id,
                        },
                      })
                    }
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    تعديل
                  </Button>

                  <Button
  variant="outline"
  onClick={async () => {

    try {

      const data =
        await invokeFunction(
          "generate-video-url",
          {
            videoId: video.id,
          }
        );

      if (data?.url) {

        window.open(
          data.url,
          "_blank"
        );

      }

    } catch (err: any) {

      generalToast.error(
        err.message
      );

    }

  }}
>
  <Eye className="h-4 w-4" />
</Button>

                  <Button
                    variant="destructive"
                    onClick={() =>
                      deleteVideo(video.id)
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                </div>

              </div>

            </Card>

          ))}

        </div>

      )}

    </div>
  );
}
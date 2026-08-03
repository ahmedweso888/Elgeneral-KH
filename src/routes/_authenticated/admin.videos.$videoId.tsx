import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  Save,
  ArrowLeft,
} from "lucide-react";

import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute(
  "/_authenticated/admin/videos/$videoId"
)({
  component: EditVideoPage,
});

function EditVideoPage() {

  const navigate = useNavigate();

  const { videoId } = Route.useParams();

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [videoFile, setVideoFile] =
    useState<File | null>(null);

  const [thumbnailFile, setThumbnailFile] =
    useState<File | null>(null);

  const [video, setVideo] =
    useState<any>(null);

  useEffect(() => {
    loadVideo();
  }, []);

  async function loadVideo() {

    const { data, error } =
      await supabase
        .from("videos")
        .select("*")
        .eq("id", videoId)
        .single();

    if (error) {

      generalToast.error(error.message);

      return;

    }

    setVideo(data);

    setLoading(false);

  }

  async function saveVideo() {

    setSaving(true);

    let thumbnailUrl =
      video.thumbnail_url;

    let videoUrl =
      video.video_url;
          //----------------------------------
    // رفع صورة جديدة (إن وجدت)
    //----------------------------------

    if (thumbnailFile) {

      const imageName =
        `${Date.now()}-${thumbnailFile.name}`;

      const { error } =
        await supabase.storage
          .from("video-thumbnails")
          .upload(imageName, thumbnailFile, {
            upsert: true,
          });

      if (error) {

        generalToast.error(error.message);

        setSaving(false);

        return;

      }

      const { data } =
        supabase.storage
          .from("video-thumbnails")
          .getPublicUrl(imageName);

      thumbnailUrl = data.publicUrl;

    }

    //----------------------------------
    // رفع فيديو جديد (إن وجد)
    //----------------------------------

    if (videoFile) {

      const fileName =
        `${Date.now()}-${videoFile.name}`;

      const { error } =
        await supabase.storage
          .from("videos")
          .upload(fileName, videoFile, {
            upsert: true,
          });

      if (error) {

        generalToast.error(error.message);

        setSaving(false);

        return;

      }

      const { data } =
        supabase.storage
          .from("videos")
          .getPublicUrl(fileName);

      videoUrl = data.publicUrl;

    }

    //----------------------------------
    // تحديث قاعدة البيانات
    //----------------------------------

    const { error } =
      await supabase
        .from("videos")
        .update({

          title: video.title,

          description: video.description,

          thumbnail_url: thumbnailUrl,

          video_url: videoUrl,

          cloudfront_url: videoUrl,

          hls_url: "",

          duration: video.duration,

          grade: video.grade,

          unit: video.unit,

          order_index: video.order_index,

          is_published: video.is_published,

        })
        .eq("id", video.id);

    setSaving(false);

    if (error) {

      generalToast.error(error.message);

      return;

    }

    generalToast.success("تم تحديث الفيديو");

  }

  if (loading) {

    return (

      <div className="p-10 text-center">

        جارى تحميل الفيديو...

      </div>

    );

  }

  return (

    <Card className="max-w-5xl mx-auto p-8">

      <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black">

          تعديل الفيديو

        </h1>

        <Button
          variant="outline"
          onClick={() =>
            navigate({
              to: "/admin/videos",
            })
          }
        >

          <ArrowLeft className="mr-2 h-4 w-4" />

          رجوع

        </Button>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div>

          <Label>عنوان الفيديو</Label>

          <Input
            value={video.title}
            onChange={(e) =>
              setVideo({
                ...video,
                title: e.target.value,
              })
            }
          />

        </div>

        <div>

          <Label>الصف الدراسي</Label>

          <Input
            value={video.grade}
            onChange={(e) =>
              setVideo({
                ...video,
                grade: e.target.value,
              })
            }
          />

        </div>

        <div>

          <Label>الوحدة</Label>

          <Input
            value={video.unit}
            onChange={(e) =>
              setVideo({
                ...video,
                unit: e.target.value,
              })
            }
          />

        </div>

        <div>

          <Label>مدة الفيديو</Label>

          <Input
            type="number"
            value={video.duration}
            onChange={(e) =>
              setVideo({
                ...video,
                duration: Number(e.target.value),
              })
            }
          />

        </div>

        <div>

          <Label>ترتيب الفيديو</Label>

          <Input
            type="number"
            value={video.order_index}
            onChange={(e) =>
              setVideo({
                ...video,
                order_index: Number(e.target.value),
              })
            }
          />

        </div>

        <div>

          <Label>تغيير الصورة المصغرة</Label>

          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setThumbnailFile(
                e.target.files?.[0] ?? null
              )
            }
          />

        </div>

        <div className="md:col-span-2">

          <Label>الوصف</Label>

          <Textarea
            rows={5}
            value={video.description}
            onChange={(e) =>
              setVideo({
                ...video,
                description: e.target.value,
              })
            }
          />

        </div>

        <div className="md:col-span-2">

          <Label>تغيير الفيديو</Label>

          <Input
            type="file"
            accept="video/*"
            onChange={(e) =>
              setVideoFile(
                e.target.files?.[0] ?? null
              )
            }
          />

        </div>
              <div className="md:col-span-2 flex items-center justify-between rounded-lg border p-4">

          <div>

            <h3 className="font-bold">

              الفيديو منشور؟

            </h3>

            <p className="text-sm text-muted-foreground">

              لو مغلق مش هيظهر للطلاب

            </p>

          </div>

          <Switch
            checked={video.is_published}
            onCheckedChange={(v) =>
              setVideo({
                ...video,
                is_published: v,
              })
            }
          />

        </div>

      </div>

      <div className="flex justify-end mt-8">

        <Button
          size="lg"
          disabled={saving}
          onClick={saveVideo}
        >

          <Save className="mr-2 h-4 w-4" />

          {saving
            ? "جارى الحفظ..."
            : "حفظ التعديلات"}

        </Button>

      </div>

    </Card>

  );

}
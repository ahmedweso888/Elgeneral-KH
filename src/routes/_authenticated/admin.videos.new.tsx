import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  ArrowLeft,
  Save,
} from "lucide-react";

import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute(
  "/_authenticated/admin/videos/new"
)({
  component: NewVideoPage,
});

function NewVideoPage() {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [videoFile, setVideoFile] =
    useState<File | null>(null);

  const [thumbnailFile, setThumbnailFile] =
    useState<File | null>(null);

  const [video, setVideo] = useState({
  title: "",
  description: "",
  grade: "",
  unit: "",
  duration: 0,
  order_index: 0,

  thumbnail_url: "",
  cloudfront_url: "",
  hls_url: "",
  video_url: "",

  s3_key: "", // <-- أضفها

  is_processing: true,
  is_published: false,
});

  async function saveVideo() {

    setLoading(true);

    let thumbnailUrl = "";

    //----------------------------------
    // رفع الصورة المصغرة
    //----------------------------------
        if (thumbnailFile) {

      const imageName =
        `${Date.now()}-${thumbnailFile.name}`;

      const { error } =
        await supabase.storage
          .from("video-thumbnails")
          .upload(imageName, thumbnailFile);

      if (error) {

        generalToast.error(error.message);

        setLoading(false);

        return;

      }

      const { data } =
        supabase.storage
          .from("video-thumbnails")
          .getPublicUrl(imageName);

      thumbnailUrl = data.publicUrl;

    }

    //----------------------------------
    // الحصول على رابط رفع من الـ Edge Function
    //----------------------------------

    if (!videoFile) {

      generalToast.error("اختر ملف الفيديو");

      setLoading(false);

      return;

    }

    const fileName =
      `${Date.now()}-${videoFile.name}`;

    const { data: uploadData, error: uploadError } =
      await supabase.functions.invoke(
        "create-upload-url",
        {
          body: {
            fileName,
            contentType: videoFile.type,
          },
        }
      );

    if (uploadError || !uploadData) {

      generalToast.error("فشل إنشاء رابط الرفع");

      setLoading(false);

      return;

    }

    //----------------------------------
    // رفع الفيديو مباشرة إلى S3
    //----------------------------------

    const uploadResponse = await fetch(
      uploadData.uploadUrl,
      {
        method: "PUT",
        headers: {
          "Content-Type": videoFile.type,
        },
        body: videoFile,
      }
    );

    if (!uploadResponse.ok) {
  generalToast.error("فشل رفع الفيديو إلى S3");
  setLoading(false);
  return;
}

generalToast.success("تم رفع الفيديو إلى S3");

    //----------------------------------
    // بعد نجاح الرفع هنحفظ بيانات الفيديو
    //----------------------------------
        //----------------------------------
    // حفظ الفيديو فى قاعدة البيانات
    //----------------------------------

    const { error } = await supabase
      .from("videos")
      .insert({

        title: video.title,

        description: video.description,

        thumbnail_url: thumbnailUrl,

        grade: video.grade,

        unit: video.unit,

        duration: video.duration,

        order_index: video.order_index,

        is_published: video.is_published,

        is_processing: true,

        //----------------------------------
        // سيتم تحديثهم أوتوماتيك بعد MediaConvert
        //----------------------------------

        video_url: "",

        cloudfront_url: "",

        hls_url: "",

        //----------------------------------
        // اسم الملف داخل S3
        //----------------------------------

        s3_key: fileName,

      });

    setLoading(false);

    if (error) {

      generalToast.error(error.message);

      return;

    }

    generalToast.success(
      "تم رفع الفيديو وسيبدأ التحويل تلقائياً..."
    );

    navigate({

      to: "/admin/videos",

    });

  }

  return (

    <Card className="mx-auto max-w-5xl p-8">

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-3xl font-black">

          إضافة فيديو جديد

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

          <Label>مدة الفيديو (بالدقائق)</Label>

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

          <Label>الصورة المصغرة</Label>

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

          <Label>وصف الفيديو</Label>

          <Textarea
            rows={6}
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

          <Label>ملف الفيديو</Label>

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

              نشر الفيديو

            </h3>

            <p className="text-sm text-muted-foreground">

              سيتم رفع الفيديو إلى AWS S3 ثم تحويله تلقائياً إلى HLS ونشره على CloudFront.

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

      <div className="mt-8 flex justify-end">

        <Button
          size="lg"
          disabled={loading}
          onClick={saveVideo}
        >

          <Save className="mr-2 h-4 w-4" />

          {loading
            ? "جارى رفع الفيديو..."
            : "رفع الفيديو"}

        </Button>

      </div>

    </Card>

  );

}

export default NewVideoPage;
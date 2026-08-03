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
  Radio,
} from "lucide-react";

import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute(
  "/_authenticated/admin/live/new"
)({
  component: NewLivePage,
});

function NewLivePage() {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [thumbnailFile, setThumbnailFile] =
    useState<File | null>(null);

  //----------------------------------
  // بيانات اللايف فقط
  //----------------------------------

  const [live, setLive] = useState({

    title: "",

    description: "",

    scheduled_at: "",

    is_scheduled: true,

    is_live: false,

  });

  //----------------------------------
  // إنشاء اللايف
  //----------------------------------

  async function saveLive() {

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
          .from("live-thumbnails")
          .upload(imageName, thumbnailFile);

      if (error) {

        generalToast.error(error.message);

        setLoading(false);

        return;

      }

      const { data } =
        supabase.storage
          .from("live-thumbnails")
          .getPublicUrl(imageName);

      thumbnailUrl = data.publicUrl;

    }

    //----------------------------------
    // إنشاء قناة AWS IVS أوتوماتيك
    //----------------------------------

    const { data: aws, error: awsError } =
      await supabase.functions.invoke(
        "create-live-channel",
        {
          body: {
            title: live.title,
          },
        }
      );

    if (awsError || !aws) {

      generalToast.error("فشل إنشاء قناة البث");

      setLoading(false);

      return;

    }

    //----------------------------------
    // المستخدم الحالي
    //----------------------------------

    const {
      data: { user },
    } = await supabase.auth.getUser();

    //----------------------------------
    // حفظ البيانات فى Supabase
    //----------------------------------

    const { error } = await supabase

      .from("live_streams")

      .insert({

        title: live.title,

        description: live.description,

        thumbnail_url: thumbnailUrl,

        stream_key: aws.streamKey,

        playback_url: aws.playbackUrl,

        channel_arn: aws.channelArn,

        scheduled_at: live.scheduled_at,

        started_at: null,

        ended_at: null,

        is_live: false,

        is_scheduled: live.is_scheduled,

        viewers_count: 0,

        created_by: user?.id,

      });
          setLoading(false);

    if (error) {

      generalToast.error(error.message);

      return;

    }

    generalToast.success("تم إنشاء اللايف بنجاح");

    navigate({

      to: "/admin/live",

    });

  }

  return (

    <Card className="mx-auto max-w-5xl p-8">

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-3xl font-black flex items-center gap-3">

          <Radio className="text-red-500 h-8 w-8" />

          إنشاء لايف جديد

        </h1>

        <Button

          variant="outline"

          onClick={() =>
            navigate({
              to: "/admin/live",
            })
          }

        >

          <ArrowLeft className="mr-2 h-4 w-4" />

          رجوع

        </Button>

      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div>

          <Label>عنوان اللايف</Label>

          <Input
            value={live.title}
            onChange={(e)=>
              setLive({
                ...live,
                title:e.target.value
              })
            }
          />

        </div>

        <div>

          <Label>موعد اللايف</Label>

          <Input
            type="datetime-local"
            value={live.scheduled_at}
            onChange={(e)=>
              setLive({
                ...live,
                scheduled_at:e.target.value
              })
            }
          />

        </div>

        <div className="md:col-span-2">

          <Label>وصف اللايف</Label>

          <Textarea

            rows={6}

            value={live.description}

            onChange={(e)=>

              setLive({

                ...live,

                description:e.target.value

              })

            }

          />

        </div>

        <div className="md:col-span-2">

          <Label>الصورة المصغرة</Label>

          <Input

            type="file"

            accept="image/*"

            onChange={(e)=>

              setThumbnailFile(

                e.target.files?.[0] ?? null

              )

            }

          />

        </div>
                <div className="md:col-span-2 flex items-center justify-between rounded-lg border p-4">

          <div>

            <h3 className="font-bold">

              جدولة اللايف

            </h3>

            <p className="text-sm text-muted-foreground">

              عند تفعيلها سيظهر اللايف فى صفحة الطلاب قبل موعده.

            </p>

          </div>

          <Switch

            checked={live.is_scheduled}

            onCheckedChange={(v)=>

              setLive({

                ...live,

                is_scheduled:v

              })

            }

          />

        </div>

        <div className="md:col-span-2 flex items-center justify-between rounded-lg border p-4">

          <div>

            <h3 className="font-bold">

              بدء البث مباشرة

            </h3>

            <p className="text-sm text-muted-foreground">

              يمكن تشغيله يدوياً لاحقاً من صفحة تعديل اللايف.

            </p>

          </div>

          <Switch

            checked={live.is_live}

            onCheckedChange={(v)=>

              setLive({

                ...live,

                is_live:v

              })

            }

          />

        </div>

      </div>

      <div className="mt-8 flex justify-end">

        <Button

          size="lg"

          disabled={loading}

          onClick={saveLive}

        >

          <Save className="mr-2 h-4 w-4" />

          {loading

            ? "جارى إنشاء قناة AWS..."

            : "إنشاء اللايف"}

        </Button>

      </div>

    </Card>

  );

}
export default NewLivePage;
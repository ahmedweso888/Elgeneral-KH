import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { invokeFunction } from "@/lib/functions";

import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute(
  "/_authenticated/admin/notifications/"
)({
  component: AdminNotificationsPage,
});

function AdminNotificationsPage() {

  const [loading, setLoading] =
    useState(true);

  const [notifications, setNotifications] =
    useState<any[]>([]);

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [grade, setGrade] =
    useState("");

  useEffect(() => {

    loadNotifications();

  }, []);

  async function loadNotifications() {

    setLoading(true);

    const { data } = await supabase

      .from("notifications")

      .select("*")

      .order("created_at", {
        ascending: false,
      });

    setNotifications(data ?? []);

    setLoading(false);

  }
  async function createNotification() {

  try{

    await invokeFunction(

      "notification-send",

      {

        title,

        message,

        grade:

          grade || null,

        send_to_all:

          grade === "",

      }

    );

    generalToast.success("تم إرسال الإشعار");

    setTitle("");

    setMessage("");

    setGrade("");

    loadNotifications();

  }

  catch(err:any){

    generalToast.error(err.message);

  }

}



if (loading) {
  return (
    <div className="p-10 text-xl">
      جاري تحميل الإشعارات...
    </div>
  );
}

return (
  <div className="container mx-auto py-8 space-y-8">

    <h1 className="text-4xl font-black">
      إدارة الإشعارات
    </h1>

    <Card className="p-6 space-y-5">

      <h2 className="text-2xl font-bold">

        إنشاء إشعار جديد

      </h2>

      <div>

        <Label>العنوان</Label>

        <Input
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

      </div>

      <div>

        <Label>المحتوى</Label>

        <Input
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
        />

      </div>

      <div>

        <Label>الصف الدراسي</Label>

        <select
          className="w-full border rounded-md h-10 px-3"
          value={grade}
          onChange={(e) =>
            setGrade(e.target.value)
          }
        >

          <option value="">
            جميع الطلاب
          </option>

          <option value="أولى ثانوي">
            أولى ثانوي
          </option>

          <option value="ثانية ثانوي">
            ثانية ثانوي
          </option>

          <option value="ثالثة ثانوي">
            ثالثة ثانوي
          </option>

        </select>

      </div>

      <Button
        onClick={createNotification}
      >
        إنشاء الإشعار
      </Button>

    </Card>

    <div className="space-y-4">{notifications.length === 0 ? (

  <Card className="p-6">

    <p className="text-muted-foreground">
      لا توجد إشعارات
    </p>

  </Card>

) : (

  notifications.map((item) => (

    <Card
      key={item.id}
      className="p-5"
    >

      <div className="flex justify-between items-start gap-4">

        <div className="flex-1">

          <h2 className="text-xl font-bold">

            {item.title}

          </h2>

          <p className="mt-3">

            {item.message}

          </p>

          <div className="flex gap-3 mt-4 text-sm text-muted-foreground">

            <span>

              {item.target_grade ??
                "جميع الطلاب"}

            </span>

            <span>

              {item.is_sent
                ? "✅ تم الإرسال"
                : "⏳ لم يرسل"}

            </span>

          </div>

        </div>

        <div className="flex flex-col gap-2">

          <Button
  size="sm"
  variant="secondary"
  onClick={async()=>{

    try{

      await invokeFunction(

        "notification-send",

        {

          title:item.title,

          message:item.message,

          grade:

            item.target_grade,

          send_to_all:

            !item.target_grade,

        }

      );

      generalToast.success("تم الإرسال");

      loadNotifications();

    }

    catch(err:any){

      generalToast.error(err.message);

    }

  }}
>
Push
</Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={async () => {

              const ok = confirm("حذف الإشعار؟");

if (!ok) return;

try {

  await invokeFunction(
    "notification-delete",
    {
      notificationId: item.id,
    }
  );

  generalToast.success("تم حذف الإشعار");

  loadNotifications();

} catch (err: any) {

  generalToast.error(err.message);

}

              loadNotifications();

            }}
          >

            حذف

          </Button>

        </div>

      </div>

    </Card>

  ))

)}

</div>

</div>

);

}
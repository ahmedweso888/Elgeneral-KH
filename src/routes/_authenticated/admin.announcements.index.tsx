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
  "/_authenticated/admin/announcements/"
)({
  component: AdminAnnouncementsPage,
});

function AdminAnnouncementsPage() {

  const [loading,setLoading]=
    useState(true);

  const [announcements,setAnnouncements]=
    useState<any[]>([]);

  const [title,setTitle]=
    useState("");

  const [content,setContent]=
    useState("");

  const [image,setImage]=
    useState<File|null>(null);

  useEffect(()=>{

    loadAnnouncements();

  },[]);

  async function loadAnnouncements(){

    setLoading(true);

    const {data}=await supabase

      .from("announcements")

      .select("*")

      .order("created_at",{
        ascending:false,
      });

    setAnnouncements(data??[]);

    setLoading(false);

  }
  async function createAnnouncement() {

  try {

    if (!title.trim()) {

      generalToast.error("اكتب عنوان الإعلان");

      return;

    }

    let imageUrl: string | null = null;

    if (image) {

      const fileName =
`${Date.now()}-${Math.random().toString(36).slice(2)}.${
  image.name.split(".").pop()
}`;

      const upload = await supabase.storage
        .from("announcement-images")
        .upload(fileName, image);

      if (upload.error) throw upload.error;

      imageUrl =
        supabase.storage
          .from("announcement-images")
          .getPublicUrl(fileName)
          .data.publicUrl;

    }

    await invokeFunction(

  "announcement-create",

  {

    title,

    content,

    image_url:imageUrl,

    is_published:true,

  }

);

    generalToast.success("تم إنشاء الإعلان");

    setTitle("");

    setContent("");

    setImage(null);

    loadAnnouncements();

  } catch (err: any) {

    generalToast.error(err.message);

  }

}

async function deleteAnnouncement(id:string){

  if(!confirm("حذف الإعلان؟")) return;

  try{

    await invokeFunction(

      "announcement-delete",

      {

        announcementId:id,

      }

    );

    generalToast.success("تم حذف الإعلان");

    loadAnnouncements();

  }

  catch(err:any){

    generalToast.error(err.message);

  }

}

if (loading) {

  return (

    <div className="p-10">

      جاري تحميل الإعلانات...

    </div>

  );

}
return (

  <div className="container mx-auto py-8 space-y-8">

    <h1 className="text-4xl font-black">

      إدارة الإعلانات

    </h1>

    <Card className="p-6 space-y-5">

      <h2 className="text-2xl font-bold">

        إنشاء إعلان جديد

      </h2>

      <div>

        <Label>العنوان</Label>

        <Input
          value={title}
          onChange={(e)=>
            setTitle(e.target.value)
          }
        />

      </div>

      <div>

        <Label>المحتوى</Label>

        <Input
          value={content}
          onChange={(e)=>
            setContent(e.target.value)
          }
        />

      </div>

      <div>

        <Label>الصورة</Label>

        <Input
          type="file"
          accept="image/*"
          onChange={(e)=>
            setImage(
              e.target.files?.[0] ?? null
            )
          }
        />

      </div>

      <Button onClick={createAnnouncement}>

        إنشاء الإعلان

      </Button>

    </Card>

    <div className="grid lg:grid-cols-2 gap-5">

      {announcements.length === 0 ? (

        <Card className="p-6">

          لا توجد إعلانات

        </Card>

      ) : (

        announcements.map((announcement)=>(

          <Card
            key={announcement.id}
            className="overflow-hidden"
          >

            {announcement.image_url && (

              <img
                src={announcement.image_url}
                className="w-full h-56 object-cover"
              />

            )}

            <div className="p-5 space-y-3">

              <h2 className="text-2xl font-bold">

                {announcement.title}

              </h2>

              <p>

                {announcement.content}

              </p>

              <div className="flex justify-between items-center">

                <span className="text-sm text-muted-foreground">

                  {announcement.is_published
                    ? "✅ منشور"
                    : "📝 مسودة"}

                </span>

                <Button
                  variant="destructive"
                  onClick={()=>
                    deleteAnnouncement(
                      announcement.id
                    )
                  }
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
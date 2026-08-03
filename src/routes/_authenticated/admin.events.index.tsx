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
  "/_authenticated/admin/events/"
)({
  component: AdminEventsPage,
});

function AdminEventsPage() {

  const [loading,setLoading]=
    useState(true);

  const [events,setEvents]=
    useState<any[]>([]);

  const [title,setTitle]=
    useState("");

  const [description,setDescription]=
    useState("");

  const [date,setDate]=
    useState("");

  const [image,setImage]=
    useState<File|null>(null);

  useEffect(()=>{

    loadEvents();

  },[]);

  async function loadEvents(){

    setLoading(true);

    const {data}=await supabase

      .from("events")

      .select("*")

      .order("event_date",{
        ascending:false,
      });

    setEvents(data??[]);

    setLoading(false);

  }
  async function createEvent() {

  try {

    if (!title.trim()) {

      generalToast.error("اكتب عنوان الحدث");

      return;

    }

    let imageUrl: string | null = null;

    if (image) {

     const fileName =
`${Date.now()}-${Math.random().toString(36).slice(2)}.${
  image.name.split(".").pop()
}`;

      const upload = await supabase.storage
        .from("event-images")
        .upload(fileName, image);

      if (upload.error) throw upload.error;

      imageUrl =
        supabase.storage
          .from("event-images")
          .getPublicUrl(fileName)
          .data.publicUrl;

    }

    await invokeFunction(

  "event-create",

  {

    title,

    description,

    event_date:date,

    image_url:imageUrl,

  }

);

    generalToast.success("تم إنشاء الحدث");

    setTitle("");

    setDescription("");

    setDate("");

    setImage(null);

    loadEvents();

  } catch (err: any) {

    generalToast.error(err.message);

  }

}

async function deleteEvent(id:string){

  if(!confirm("حذف الحدث؟")) return;

  try{

    await invokeFunction(

      "event-delete",

      {

        eventId:id,

      }

    );

    generalToast.success("تم حذف الحدث");

    loadEvents();

  }

  catch(err:any){

    generalToast.error(err.message);

  }

}

if (loading) {

  return (

    <div className="p-10">

      جاري تحميل الأحداث...

    </div>

  );

}
return (

  <div className="container mx-auto py-8 space-y-8">

    <h1 className="text-4xl font-black">

      إدارة الأحداث

    </h1>

    <Card className="p-6 space-y-5">

      <h2 className="text-2xl font-bold">

        إنشاء حدث جديد

      </h2>

      <div>

        <Label>عنوان الحدث</Label>

        <Input
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

      </div>

      <div>

        <Label>الوصف</Label>

        <Input
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

      </div>

      <div className="grid md:grid-cols-2 gap-4">

        <div>

          <Label>تاريخ الحدث</Label>

          <Input
            type="date"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
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

      </div>

      <Button onClick={createEvent}>

        إنشاء الحدث

      </Button>

    </Card>

    <div className="grid lg:grid-cols-2 gap-5">

      {events.map((event)=>(

        <Card
          key={event.id}
          className="overflow-hidden"
        >

          {event.image_url && (

            <img
              src={event.image_url}
              className="w-full h-56 object-cover"
            />

          )}

          <div className="p-5 space-y-3">

            <h2 className="text-2xl font-bold">

              {event.title}

            </h2>

            <p>

              {event.description}

            </p>

            <div className="text-sm text-muted-foreground">

              📅 {event.event_date}

            </div>

            <Button
              variant="destructive"
              onClick={()=>
                deleteEvent(event.id)
              }
            >

              حذف

            </Button>

          </div>

        </Card>

      ))}

    </div>

  </div>

);

}
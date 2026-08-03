import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  ArrowLeft,
  Save,
  ScrollText,
} from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/admin/history/$eraId/new-event"
)({
  component: NewHistoryEventPage,
});

function NewHistoryEventPage() {

  const navigate = useNavigate();

  const { eraId } = Route.useParams();

  const [loading, setLoading] =
    useState(false);

  const [videos, setVideos] =
    useState<any[]>([]);

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [event, setEvent] = useState({

    title: "",

    description: "",

    year: "",

    event_date: "",

    location: "",

    latitude: "",

    longitude: "",

    causes: "",

    results: "",

    category: "",

    color: "#2563eb",

    order_index: 0,

    video_id: "",

    image_url: "",

    is_published: true,

  });

  useEffect(() => {

    loadVideos();

  }, []);

  async function loadVideos() {

    const { data } = await supabase

      .from("videos")

      .select("id,title")

      .eq("is_published", true)

      .order("title");

    setVideos(data ?? []);

  }

  async function saveEvent() {

    setLoading(true);

    let imageUrl = "";
        //----------------------------------
    // رفع صورة الحدث
    //----------------------------------

    if (imageFile) {

      const imageName =
        `${Date.now()}-${imageFile.name}`;

      const { error } =
        await supabase.storage
          .from("history-images")
          .upload(imageName, imageFile);

      if (error) {

        alert(error.message);

        setLoading(false);

        return;

      }

      const { data } =
        supabase.storage
          .from("history-images")
          .getPublicUrl(imageName);

      imageUrl = data.publicUrl;

    }

    //----------------------------------
    // حفظ الحدث
    //----------------------------------

    const { error } = await supabase

      .from("timeline")

      .insert({

        era_id: eraId,

        title: event.title,

        description: event.description,

        year: Number(event.year),

        event_date:
          event.event_date || null,

        location:
          event.location || null,

        latitude:
          event.latitude
            ? Number(event.latitude)
            : null,

        longitude:
          event.longitude
            ? Number(event.longitude)
            : null,

        causes:
          event.causes || null,

        results:
          event.results || null,

        category:
          event.category || null,

        color: event.color,

        order_index:
          event.order_index,

        video_id:
          event.video_id || null,

        image_url: imageUrl,

        is_published:
          event.is_published,

      });

    setLoading(false);

    if (error) {

      alert(error.message);

      return;

    }

    navigate({

      to: "/admin/history/$eraId",

      params: {

        eraId,

      },

    });

  }
  return (

  <Card className="mx-auto max-w-6xl p-8">

    <div className="flex items-center justify-between mb-8">

      <h1 className="text-3xl font-black flex items-center gap-3">

        <ScrollText className="h-8 w-8 text-primary" />

        إضافة حدث تاريخي

      </h1>

      <Button

        variant="outline"

        onClick={() =>
          navigate({

            to: "/admin/history/$eraId",

            params: {

              eraId,

            },

          })
        }

      >

        <ArrowLeft className="mr-2 h-4 w-4" />

        رجوع

      </Button>

    </div>

    <div className="grid md:grid-cols-2 gap-6">

      <div>

        <Label>

          اسم الحدث

        </Label>

        <Input

          value={event.title}

          onChange={(e) =>
            setEvent({

              ...event,

              title: e.target.value,

            })
          }

        />

      </div>

      <div>

        <Label>

          السنة

        </Label>

        <Input

          type="number"

          value={event.year}

          onChange={(e) =>
            setEvent({

              ...event,

              year: e.target.value,

            })
          }

        />

      </div>

      <div className="md:col-span-2">

        <Label>

          وصف الحدث

        </Label>

        <Textarea

          rows={6}

          value={event.description}

          onChange={(e) =>
            setEvent({

              ...event,

              description: e.target.value,

            })
          }

        />

      </div>

      <div>

        <Label>

          تاريخ الحدث

        </Label>

        <Input

          type="date"

          value={event.event_date}

          onChange={(e) =>
            setEvent({

              ...event,

              event_date: e.target.value,

            })
          }

        />

      </div>

      <div>

        <Label>

          التصنيف

        </Label>

        <Input

          placeholder="حرب - معاهدة - ثورة - شخصية"

          value={event.category}

          onChange={(e) =>
            setEvent({

              ...event,

              category: e.target.value,

            })
          }

        />

      </div>
            <div>

        <Label>

          المكان

        </Label>

        <Input

          placeholder="مثال: القاهرة"

          value={event.location}

          onChange={(e) =>
            setEvent({

              ...event,

              location: e.target.value,

            })
          }

        />

      </div>

      <div>

        <Label>

          ترتيب الحدث

        </Label>

        <Input

          type="number"

          value={event.order_index}

          onChange={(e) =>
            setEvent({

              ...event,

              order_index: Number(e.target.value),

            })
          }

        />

      </div>

      <div>

        <Label>

          Latitude

        </Label>

        <Input

          value={event.latitude}

          onChange={(e) =>
            setEvent({

              ...event,

              latitude: e.target.value,

            })
          }

        />

      </div>

      <div>

        <Label>

          Longitude

        </Label>

        <Input

          value={event.longitude}

          onChange={(e) =>
            setEvent({

              ...event,

              longitude: e.target.value,

            })
          }

        />

      </div>

      <div>

        <Label>

          لون الحدث

        </Label>

        <Input

          type="color"

          value={event.color}

          onChange={(e) =>
            setEvent({

              ...event,

              color: e.target.value,

            })
          }

        />

      </div>

      <div>

        <Label>

          صورة الحدث

        </Label>

        <Input

          type="file"

          accept="image/*"

          onChange={(e) =>
            setImageFile(
              e.target.files?.[0] ?? null
            )
          }

        />

      </div>

      <div className="md:col-span-2">

        <Label>

          أسباب الحدث

        </Label>

        <Textarea

          rows={5}

          value={event.causes}

          onChange={(e) =>
            setEvent({

              ...event,

              causes: e.target.value,

            })
          }

        />

      </div>

      <div className="md:col-span-2">

        <Label>

          نتائج الحدث

        </Label>

        <Textarea

          rows={5}

          value={event.results}

          onChange={(e) =>
            setEvent({

              ...event,

              results: e.target.value,

            })
          }

        />

      </div>
            <div className="md:col-span-2">

        <Label>

          ربط الحدث بفيديو

        </Label>

        <select

          className="w-full rounded-md border p-2"

          value={event.video_id}

          onChange={(e) =>
            setEvent({

              ...event,

              video_id: e.target.value,

            })
          }

        >

          <option value="">

            بدون فيديو

          </option>

          {videos.map((video) => (

            <option

              key={video.id}

              value={video.id}

            >

              {video.title}

            </option>

          ))}

        </select>

      </div>

      <div className="md:col-span-2">

        <Label className="flex items-center gap-3">

          <input

            type="checkbox"

            checked={event.is_published}

            onChange={(e) =>
              setEvent({

                ...event,

                is_published: e.target.checked,

              })
            }

          />

          نشر الحدث

        </Label>

      </div>

    </div>

    <div className="mt-8 flex justify-end">

      <Button

        size="lg"

        disabled={loading}

        onClick={saveEvent}

      >

        <Save className="mr-2 h-4 w-4" />

        {loading

          ? "جارى الحفظ..."

          : "حفظ الحدث"}

      </Button>

    </div>

  </Card>

);

}

export default NewHistoryEventPage;
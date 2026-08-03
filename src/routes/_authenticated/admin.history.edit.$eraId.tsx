import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  ArrowLeft,
  Save,
} from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/admin/history/edit/$eraId"
)({
  component: EditEraPage,
});
function EditEraPage() {

  const { eraId } = Route.useParams();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [era, setEra] =
    useState({
      title: "",
      description: "",
      image_url: "",
      order_index: 0,
      color: "#2563eb",
    });

  useEffect(() => {

    loadEra();

  }, []);

  async function loadEra() {

    const { data } = await supabase

      .from("historical_eras")

      .select("*")

      .eq("id", eraId)

      .single();

    if (data) {

      setEra({

        title: data.title ?? "",

        description: data.description ?? "",

        image_url: data.image_url ?? "",

        order_index: data.order_index ?? 0,

        color: data.color ?? "#2563eb",

      });

    }

    setLoading(false);

  }
  async function saveEra() {

  setSaving(true);

  const { error } = await supabase

    .from("historical_eras")

    .update({

      title: era.title,

      description: era.description,

      image_url: era.image_url,

      order_index: Number(era.order_index),

      color: era.color,

    })

    .eq("id", eraId);

  setSaving(false);

  if (error) {

    alert(error.message);

    return;

  }

  alert("تم تحديث العصر بنجاح");

}
if (loading) {

  return (

    <div className="container mx-auto py-20 text-center">

      جاري تحميل بيانات العصر...

    </div>

  );

}
return (

  <div className="container mx-auto py-8">

    <Card className="p-8 space-y-6">

      <div className="flex items-center justify-between">

        <h1 className="text-3xl font-black">

          تعديل العصر

        </h1>

        <Button
          variant="outline"
          onClick={() => history.back()}
        >

          <ArrowLeft className="mr-2 h-4 w-4" />

          رجوع

        </Button>

      </div>

      <div className="space-y-2">

        <Label>

          اسم العصر

        </Label>

        <Input

          value={era.title}

          onChange={(e) =>

            setEra({

              ...era,

              title: e.target.value,

            })

          }

        />

      </div>

      <div className="space-y-2">

        <Label>

          الوصف

        </Label>

        <Textarea

          rows={6}

          value={era.description}

          onChange={(e) =>

            setEra({

              ...era,

              description: e.target.value,

            })

          }

        />

      </div>

      <div className="space-y-2">

        <Label>

          رابط الصورة

        </Label>

        <Input

          value={era.image_url}

          onChange={(e) =>

            setEra({

              ...era,

              image_url: e.target.value,

            })

          }

        />

      </div>

      <div className="grid md:grid-cols-2 gap-5">

        <div className="space-y-2">

          <Label>

            ترتيب العصر

          </Label>

          <Input

            type="number"

            value={era.order_index}

            onChange={(e) =>

              setEra({

                ...era,

                order_index: Number(e.target.value),

              })

            }

          />

        </div>

        <div className="space-y-2">

          <Label>

            اللون

          </Label>

          <Input

            type="color"

            value={era.color}

            onChange={(e) =>

              setEra({

                ...era,

                color: e.target.value,

              })

            }

          />

        </div>

      </div>

      <Button

        onClick={saveEra}

        disabled={saving}

        className="w-full"

      >

        <Save className="mr-2 h-4 w-4" />

        {saving ? "جارى الحفظ..." : "حفظ التعديلات"}

      </Button>

    </Card>

  </div>

);

}

export default EditEraPage;
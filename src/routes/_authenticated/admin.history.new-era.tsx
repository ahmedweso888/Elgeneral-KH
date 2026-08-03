import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  ArrowLeft,
  Save,
  Landmark,
} from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/admin/history/new-era"
)({
  component: NewEraPage,
});

function NewEraPage() {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [era, setEra] = useState({

    title: "",

    description: "",

    image_url: "",

    order_index: 0,

  });

  async function saveEra() {

    setLoading(true);

    let imageUrl = "";
        //----------------------------------
    // رفع صورة العصر
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
    // حفظ العصر
    //----------------------------------

    const { error } = await supabase

      .from("historical_eras")

      .insert({

        title: era.title,

        description: era.description,

        image_url: imageUrl,

        order_index: era.order_index,

      });

    setLoading(false);

    if (error) {

      alert(error.message);

      return;

    }

    navigate({

      to: "/admin/history",

    });

  }
    return (

    <Card className="mx-auto max-w-5xl p-8">

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-3xl font-black flex items-center gap-3">

          <Landmark className="text-primary h-8 w-8" />

          إضافة عصر تاريخي

        </h1>

        <Button

          variant="outline"

          onClick={() =>
            navigate({
              to: "/admin/history",
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

        <div>

          <Label>

            ترتيب الظهور

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

        <div className="md:col-span-2">

          <Label>

            وصف العصر

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

        <div className="md:col-span-2">

          <Label>

            صورة العصر

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
              </div>

      <div className="mt-8 flex justify-end">

        <Button
          size="lg"
          disabled={loading}
          onClick={saveEra}
        >

          <Save className="mr-2 h-4 w-4" />

          {loading
            ? "جارى الحفظ..."
            : "حفظ العصر"}

        </Button>

      </div>

    </Card>

  );

}

export default NewEraPage;
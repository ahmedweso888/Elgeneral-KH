import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { invokeFunction } from "@/lib/functions";
import {
  Plus,
  ScrollText,
  Landmark,
} from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/admin/history/"
)({
  component: AdminHistoryPage,
});

function AdminHistoryPage() {

  const [loading, setLoading] =
    useState(true);

  const [eras, setEras] =
    useState<any[]>([]);

  useEffect(() => {

    loadEras();

  }, []);

  async function loadEras() {

    setLoading(true);

    const { data } = await supabase

      .from("historical_eras")

      .select("*")

      .order("order_index", {

        ascending: true,

      });

    setEras(data ?? []);

    setLoading(false);

  }
  async function deleteEra(id:string){
    

  if(

    !confirm(

      "سيتم حذف العصر وكل الأحداث التابعة له"

    )

  ) return;

  try{

    setLoading(true);
    console.log("Deleting Era:", id);

    await invokeFunction(

      "history-delete",

      {

        eraId:id,

      }

    );

    await loadEras();

    alert("تم حذف العصر");

  }

  catch(err:any){

    alert(err.message);

  }

  finally{

    setLoading(false);

  }

}

  return (

    <div className="container mx-auto py-8 space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-black flex items-center gap-3">

            <Landmark className="text-primary h-8 w-8" />

            إدارة الخريطة التاريخية

          </h1>

          <p className="text-muted-foreground mt-2">

            إدارة العصور والأحداث التاريخية.

          </p>

        </div>

        <Button asChild>

          <Link to="/admin/history/new-era">

            <Plus className="mr-2 h-4 w-4" />

            إضافة عصر

          </Link>

        </Button>

      </div>
            {loading ? (

        <Card className="p-10 text-center">

          جاري تحميل العصور...

        </Card>

      ) : eras.length === 0 ? (

        <Card className="p-12 text-center space-y-4">

          <ScrollText className="mx-auto h-14 w-14 text-muted-foreground" />

          <h2 className="text-2xl font-bold">

            لا يوجد عصور حتى الآن

          </h2>

          <p className="text-muted-foreground">

            ابدأ بإضافة أول عصر تاريخي.

          </p>

          <Button asChild>

            <Link to="/admin/history/new-era">

              <Plus className="mr-2 h-4 w-4" />

              إضافة عصر

            </Link>

          </Button>

        </Card>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

          {eras.map((era) => (

            <Card
              key={era.id}
              className="overflow-hidden hover:shadow-xl transition"
            >

              <img
                src={
                  era.image_url ||
                  "/placeholder.png"
                }
                className="w-full h-48 object-cover"
              />

              <div className="p-5 space-y-4">

                <h2 className="text-2xl font-black">

                  {era.title}

                </h2>

                {era.description && (

                  <p className="text-muted-foreground line-clamp-3">

                    {era.description}

                  </p>

                )}

                <div className="flex gap-2">

  <Button
    asChild
    className="flex-1"
  >

    <Link
      to="/admin/history/$eraId"
      params={{
        eraId: String(era.id),
      }}
    >

      عرض الأحداث

    </Link>

  </Button>

  <Button
    variant="outline"
    asChild
  >

    <Link
      to="/admin/history/edit/$eraId"
      params={{
        eraId: String(era.id),
      }}
    >

      تعديل

    </Link>

  </Button>

  <Button
    variant="destructive"
    onClick={() =>
      deleteEra(
        String(era.id)
      )
    }
  >

    حذف

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

export default AdminHistoryPage;
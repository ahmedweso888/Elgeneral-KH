import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";

import {
  Landmark,
  Clock3,
} from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/student/history/"
)({
  component: StudentHistoryPage,
});

function StudentHistoryPage() {

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

  return (

    <div className="container mx-auto py-8 space-y-8">

      <div className="text-center space-y-3">

        <Landmark className="mx-auto h-14 w-14 text-primary" />

        <h1 className="text-4xl font-black">

          الخريطة التاريخية

        </h1>

        <p className="text-muted-foreground text-lg">

          اختر العصر الذي تريد استكشافه.

        </p>

      </div>
            {loading ? (

        <Card className="p-12 text-center">

          جاري تحميل العصور...

        </Card>

      ) : eras.length === 0 ? (

        <Card className="p-12 text-center">

          لا توجد عصور متاحة حالياً.

        </Card>

      ) : (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {eras.map((era) => (

            <Link

              key={era.id}

              to="/student/history/$eraId"

              params={{

                eraId: String(era.id),

              }}

            >

              <Card className="overflow-hidden hover:shadow-2xl transition duration-300 hover:scale-[1.02] cursor-pointer">

                <img

                  src={

                    era.image_url ||

                    "/placeholder.png"

                  }

                  className="w-full h-60 object-cover"

                />

                <div className="p-6 space-y-4">

                  <h2 className="text-2xl font-black">

                    {era.title}

                  </h2>

                  <p className="text-muted-foreground line-clamp-3">

                    {era.description}

                  </p>

                  <div className="flex items-center justify-between pt-2">

                    <div className="flex items-center gap-2 text-primary">

                      <Clock3 className="h-5 w-5" />

                      <span>

                        استكشف الأحداث

                      </span>

                    </div>

                    <span className="text-xl">

                      ←

                    </span>

                  </div>

                </div>

              </Card>

            </Link>

          ))}

        </div>

      )}
            
          </div>

  );

}

export default StudentHistoryPage;
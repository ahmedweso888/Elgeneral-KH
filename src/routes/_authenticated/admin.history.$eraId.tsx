import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Outlet } from "@tanstack/react-router";

import {
  Plus,
  ArrowLeft,
  ScrollText,
} from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/admin/history/$eraId"
)({
  component: EraEventsPage,
});

function EraEventsPage() {

  const { eraId } = Route.useParams();

  const [loading, setLoading] =
    useState(true);

  const [era, setEra] =
    useState<any>(null);

  const [events, setEvents] =
    useState<any[]>([]);

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    setLoading(true);

    //----------------------------------
    // تحميل بيانات العصر
    //----------------------------------

    const { data: eraData } =
      await supabase

        .from("historical_eras")

        .select("*")

        .eq("id", eraId)

        .single();

    setEra(eraData);

    //----------------------------------
    // تحميل الأحداث
    //----------------------------------

    const { data: eventsData } =
      await supabase

        .from("timeline")

        .select("*")

        .eq("era_id", eraId)

        .order("order_index", {

          ascending: true,

        });

    setEvents(eventsData ?? []);

    setLoading(false);

  }

  async function deleteEvent(id: string) {

    const ok = confirm(
      "هل تريد حذف هذا الحدث؟"
    );

    if (!ok) return;

    const { error } = await supabase

      .from("timeline")

      .delete()

      .eq("id", id);

    if (error) {

      alert(error.message);

      return; 

    }

    loadData();

  }

  return (
<>
    <div className="container mx-auto py-8 space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-black">

            {era?.title ?? "العصر"}

          </h1>

          <p className="text-muted-foreground mt-2">

            إدارة الأحداث التاريخية.

          </p>

        </div>

        <div className="flex gap-3">

          <Button
            variant="outline"
            asChild
          >

            <Link
              to="/admin/history"
            >

              <ArrowLeft className="mr-2 h-4 w-4" />

              رجوع

            </Link>

          </Button>

          <Button
            asChild
          >

            <Link
              to="/admin/history/$eraId/new-event"
              params={{
                eraId,
              }}
            >

              <Plus className="mr-2 h-4 w-4" />

              إضافة حدث

            </Link>

          </Button>

        </div>

      </div>
            {loading ? (

        <Card className="p-10 text-center">

          جاري تحميل الأحداث...

        </Card>

      ) : events.length === 0 ? (

        <Card className="p-12 text-center space-y-4">

          <ScrollText className="mx-auto h-14 w-14 text-muted-foreground" />

          <h2 className="text-2xl font-bold">

            لا توجد أحداث داخل هذا العصر

          </h2>

          <p className="text-muted-foreground">

            ابدأ بإضافة أول حدث تاريخي.

          </p>

          <Button asChild>

            <Link
              to="/admin/history/$eraId/new-event"
              params={{
                eraId,
              }}
            >

              <Plus className="mr-2 h-4 w-4" />

              إضافة حدث

            </Link>

          </Button>

        </Card>

      ) : (

        <div className="space-y-5">

          {events.map((event) => (

            <Card
              key={event.id}
              className="p-5 hover:shadow-lg transition"
            >

              <div className="flex items-start justify-between">

                <div className="space-y-2">

                  <div className="flex items-center gap-3">

                    <div
                      className="h-4 w-4 rounded-full"
                      style={{
                        background: event.color,
                      }}
                    />

                    <h2 className="text-2xl font-black">

                      {event.title}

                    </h2>

                  </div>

                  <div className="flex gap-6 text-sm text-muted-foreground">

                    <span>

                      📅 {event.year}

                    </span>

                    <span>

                      📍 {event.location || "-"}

                    </span>

                    <span>

                      🏷 {event.category || "-"}

                    </span>

                  </div>

                  {event.description && (

                    <p className="leading-7 text-muted-foreground">

                      {event.description}

                    </p>

                  )}

                </div>

                <div className="flex gap-2">

                  <Button
                    variant="outline"
                    asChild
                  >

                    <Link
                      to="/admin/history/$eraId/new-event"
                      params={{
                        eraId,
                      }}
                    >

                      تعديل

                    </Link>

                  </Button>

                  <Button
  variant="destructive"
  onClick={() =>
    deleteEvent(event.id)
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
<Outlet />

  </>
  );
}

export default EraEventsPage;
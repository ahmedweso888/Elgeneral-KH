import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/timeline/$year"
)({
  component: YearPage,
});

function YearPage() {
  const { year } = Route.useParams();

  const { data: events, isLoading } = useQuery({
    queryKey: ["timeline-year", year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", `${year}-01-01`)
        .lte("event_date", `${year}-12-31`)
        .order("event_date", {
          ascending: true,
        });

      if (error) throw error;

      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        جاري تحميل الأحداث...
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8">

      <Link
        to="/timeline"
        className="inline-flex items-center gap-2 mb-6 text-muted-foreground hover:text-primary"
      >
        <ArrowRight className="h-4 w-4" />
        العودة للخط الزمني
      </Link>

      <h1 className="text-4xl font-black mb-2">
        أحداث سنة {year}
      </h1>

      <p className="text-muted-foreground mb-8">
        عدد الأحداث : {events?.length ?? 0}
      </p>

      <div className="space-y-5">

        {events?.length === 0 && (
          <Card className="p-10 text-center">
            لا توجد أحداث لهذه السنة
          </Card>
        )}

        {events?.map((event) => (

          <Card
            key={event.id}
            className="p-6"
          >

            <div className="space-y-4">

              <div>

                <h2 className="text-2xl font-bold">
                  {event.title}
                </h2>

                <p className="text-muted-foreground">
                  {new Date(
                    event.event_date
                  ).toLocaleDateString("ar-EG")}
                </p>

              </div>

              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="rounded-xl border w-full max-h-[400px] object-cover"
                />
              )}

              <p className="leading-8">
                {event.description}
              </p>

              <Link
                to="/events/$eventId"
                params={{
                  eventId: event.id,
                }}
              >
                <Button>
                  استكشف الحدث
                </Button>
              </Link>

            </div>

          </Card>

        ))}

      </div>

    </div>
  );
}

export default YearPage;
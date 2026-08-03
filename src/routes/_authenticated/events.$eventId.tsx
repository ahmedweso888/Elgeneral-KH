import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";

export const Route = createFileRoute(
  "/_authenticated/events/$eventId"
)({
  component: EventPage,
});

function EventPage() {
  const { eventId } = Route.useParams();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", eventId],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) throw error;

      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        جاري تحميل الحدث...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-10 text-center">
        الحدث غير موجود
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-5xl">

      {event.image_url && (
        <img
          src={event.image_url}
          className="w-full h-80 object-cover rounded-xl mb-8"
          alt={event.title}
        />
      )}

      <Card className="p-8">

        <h1 className="text-4xl font-black mb-6">
          {event.title}
        </h1>

        <p className="text-muted-foreground whitespace-pre-wrap leading-8">
          {event.description}
        </p>

        <div className="mt-8 text-sm">

          <span>
            📅 {new Date(event.event_date).toLocaleDateString("ar-EG")}
          </span>

        </div>

      </Card>

    </div>
  );
}

export default EventPage;
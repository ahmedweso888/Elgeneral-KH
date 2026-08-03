import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_authenticated/timeline")({
  component: Timeline,
});

function Timeline() {
  const { data: events } = useQuery({
    queryKey: ["events-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", {
          ascending: true,
        });

      if (error) throw error;

      return data ?? [];
    },
  });

  const grouped =
    (events ?? []).reduce<
      Record<string, any[]>
    >((acc, ev) => {
      const year = new Date(
        ev.event_date
      ).getFullYear();

      if (!acc[year]) {
        acc[year] = [];
      }

      acc[year].push(ev);

      return acc;
    }, {});

  const years = Object.keys(grouped).sort();

  return (
    <div className="mx-auto max-w-6xl">

      <div className="mb-8">

        <h1 className="text-4xl font-black">
          الخط الزمني
        </h1>

        <p className="text-muted-foreground">
          اختر سنة لاستعراض الأحداث.
        </p>

      </div>

      {years.length === 0 ? (

        <Card className="p-8 text-center">
          لا توجد أحداث حالياً.
        </Card>

      ) : (

        <div className="relative">

          <div className="absolute top-1/2 left-0 right-0 h-1 bg-primary/20 -translate-y-1/2 rounded-full" />

          <div className="relative flex flex-wrap justify-center gap-6 py-10">

            {years.map((year, i) => (

              <motion.div
                key={year}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: i * 0.05,
                }}
              >

                <Link
                  to="/timeline/$year"
                  params={{
                    year,
                  }}
                >

                  <Card className="w-44 p-5 text-center hover:shadow-xl hover:-translate-y-1 transition">

                    <div className="text-3xl font-black">
                      {year}
                    </div>

                    <div className="text-xs text-muted-foreground mt-2">
                      {grouped[year].length} حدث
                    </div>

                    <div className="mt-2 text-sm line-clamp-2">
                      {grouped[year][0]?.title}
                    </div>

                  </Card>

                </Link>

              </motion.div>

            ))}

          </div>

        </div>

      )}

    </div>
  );
}

export default Timeline;
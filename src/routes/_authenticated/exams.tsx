import { createFileRoute, Link,  } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import { Outlet } from "@tanstack/react-router";


export const Route = createFileRoute(
  "/_authenticated/exams"
)({
  component: ExamsList,
});

function ExamsList() {
  const { data: exams } = useQuery({
    queryKey: ["exams-published"],

    queryFn: async () => {
      const { data, error } =
        await supabase
          .from("exams")
          .select("*")
          .eq("is_published", true)
          .order("created_at", {
            ascending: false,
          });

      if (error) throw error;

      return data ?? [];
    },
  });

  return ( 
 <>
    <div className="mx-auto max-w-4xl">

      <h1 className="text-3xl font-black mb-6">
        الامتحانات
      </h1>

      {exams && exams.length === 0 && (
        <Card className="p-10 text-center text-muted-foreground">
          لا توجد امتحانات منشورة بعد.
        </Card>
      )}

      <div className="space-y-3">

        {exams?.map((ex) => (

          <Card
            key={ex.id}
            className="p-5 flex items-center justify-between gap-4"
          >

            <div>

              <div className="flex items-center gap-2 font-bold">

                <ClipboardList className="h-4 w-4" />

                {ex.title}

              </div>

              {ex.description && (
                <div className="text-sm text-muted-foreground mt-1">
                  {ex.description}
                </div>
              )}

              <div className="text-xs text-muted-foreground mt-1">

                المدة : {ex.duration} دقيقة

              </div>

            </div>

            <Link
              to="/exams/$examId"
              params={{
                examId: ex.id,
              }}
            >
              <Button>
                ابدأ الامتحان
              </Button>
            </Link>

          </Card>

        ))}

      </div>

    </div>
    <Outlet />
  </>
  );
}

export default ExamsList;
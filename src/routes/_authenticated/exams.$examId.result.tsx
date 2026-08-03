import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/exams/$examId/result")({
  validateSearch: z.object({ attemptId: z.string().optional() }),
  component: ResultPage,
});

function ResultPage() {
  const { attemptId } = Route.useSearch();
  const { examId } = Route.useParams();
  const { user } = useAuth();

  const { data: attempt } = useQuery({
  queryKey: ["attempt", attemptId],
  enabled: !!attemptId,
  queryFn: async () => {
    const { data, error } = await supabase
      .from("exam_attempts")
      .select(`
        *,
        exams(
          title,
          total_marks
        )
      `)
      .eq("id", attemptId!)
      .single();

    if (error) throw error;

    return data;
  },
});



  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="p-6">
  <div className="text-sm text-muted-foreground">
    {attempt?.exams?.title}
  </div>

  <div className="mt-2 text-5xl font-black">
    {attempt?.score ?? 0} / {attempt?.total_marks}
  </div>

  <p className="mt-2 text-muted-foreground">
    تم تسليم الامتحان بنجاح
  </p>
</Card>

      


      <div className="flex gap-3">

  <Link
    to="/exams"
  >
    <Button variant="outline">
      العودة للامتحانات
    </Button>
  </Link>

  

</div>
    </div>
  );
}

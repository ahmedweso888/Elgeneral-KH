import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { generalToast } from "@/lib/general-toast";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/predictions")({
  component: PredictionsPage,
});

function PredictionsPage() {
  const queryClient = useQueryClient();

const [loadingAI, setLoadingAI] = useState(false);
  const { data: latest, isLoading } = useQuery({
    queryKey: ["predictions-latest"],
    queryFn: async () => {

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) return null;

const { data, error } = await supabase
  .from("ai_predictions")
  .select("*")
  .eq("student_id", user.id)
  .order("updated_at", { ascending: false })
  .limit(1)
  .single();

if (error) throw error;

return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        جاري التحميل...
      </div>
    );
  }

  if (!latest) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <Card className="p-8 text-center">
        لا توجد توقعات حتى الآن.
      </Card>

      <Card className="p-6">

        <Button
          className="w-full"
          onClick={regeneratePrediction}
          disabled={loadingAI}
        >
          <Sparkles className="mr-2 h-4 w-4" />

          {loadingAI
            ? "جارى تحليل مستواك..."
            : "🤖 تحليل مستواي لأول مرة"}

        </Button>

      </Card>

    </div>
  );
}
  async function regeneratePrediction() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  try {

    setLoadingAI(true);

    const { error } =
      await supabase.functions.invoke(
        "ai-prediction",
        {
          body: {
            studentId: user.id,
          },
        }
      );

    if (error) throw error;

    await queryClient.invalidateQueries({
      queryKey: ["predictions-latest"],
    });

    generalToast.success("تم تحديث التوقع");

  } catch (err: any) {

    generalToast.error(err.message);

  } finally {

    setLoadingAI(false);

  }

}

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <div>
        <h1 className="text-3xl font-black flex items-center gap-2">
          <Target className="h-7 w-7" />
          توقع الذكاء الاصطناعي
        </h1>

        <p className="text-muted-foreground">
          آخر تحديث:
          {" "}
          {latest.created_at
            ? new Date(latest.created_at).toLocaleString("ar-EG")
            : "-"}
        </p>
      </div>

      <Card className="p-6">

        <h2 className="font-bold mb-3">
          الدرجة المتوقعة
        </h2>

        <div className="text-5xl font-black text-primary mb-4">
          {latest.predicted_score ?? 0}%
        </div>

        <Progress value={latest.predicted_score ?? 0} />

      </Card>

      <Card className="p-6">

        <h2 className="font-bold mb-2">
          نقاط القوة
        </h2>

        <p>
          {latest.strengths || "لا توجد بيانات"}
        </p>

      </Card>

      <Card className="p-6">

        <h2 className="font-bold mb-2">
          نقاط الضعف
        </h2>

        <p>
          {latest.weaknesses || "لا توجد بيانات"}
        </p>

      </Card>

      <Card className="p-6">

        <h2 className="font-bold mb-2">
          خطة المذاكرة
        </h2>

        <p>
          {latest.study_plan || "لا توجد بيانات"}
        </p>

      </Card>
      <Card className="p-6">

<Button
className="w-full"
onClick={regeneratePrediction}
disabled={loadingAI}
>

<Sparkles className="mr-2 h-4 w-4"/>

{loadingAI
? "جارى تحليل مستواك..."
: "🤖 إعادة تحليل مستواي"}

</Button>

</Card>

    </div>
  );
}
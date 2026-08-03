import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface Props {
  progress?: number;
  title?: string;
  description?: string;
}

export default function HealthProgress({
  progress = 100,
  title = "جاري فحص النظام...",
  description = "يرجى الانتظار حتى يتم الانتهاء من جميع الاختبارات.",
}: Props) {
  return (
    <Card className="rounded-2xl p-8">

      <div className="flex flex-col items-center gap-6">

        <Loader2 className="h-12 w-12 animate-spin text-primary" />

        <div className="space-y-2 text-center">

          <h2 className="text-2xl font-bold">
            {title}
          </h2>

          <p className="text-muted-foreground">
            {description}
          </p>

        </div>

        <div className="w-full max-w-xl space-y-2">

          <Progress value={progress} />

          <div className="flex justify-between text-xs text-muted-foreground">

            <span>0%</span>

            <span>{progress}%</span>

            <span>100%</span>

          </div>

        </div>

      </div>

    </Card>
  );
}
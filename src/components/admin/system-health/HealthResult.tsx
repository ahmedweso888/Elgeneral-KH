import {
  Activity,
  Clock3,
  ShieldCheck,
  TriangleAlert,
  XCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { ScanResult } from "@/lib/health/types";

interface Props {
  result: ScanResult;
}

export default function HealthResult({
  result,
}: Props) {

  const gradeColor =
    result.score >= 95
      ? "text-green-500"
      : result.score >= 80
      ? "text-yellow-500"
      : "text-red-500";

  return (

    <Card className="rounded-2xl p-8">

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm text-muted-foreground">

            Overall Health

          </p>

          <h1
            className={`mt-2 text-7xl font-black ${gradeColor}`}
          >
            {result.grade}
          </h1>

          <p className="mt-2 text-muted-foreground">

            System Score

          </p>

          <h2 className="text-4xl font-bold">

            {result.score}%

          </h2>

        </div>

        <div className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-4">

          <Card className="p-4">

            <div className="flex items-center gap-3">

              <ShieldCheck className="text-green-500" />

              <div>

                <p className="text-sm text-muted-foreground">

                  Passed

                </p>

                <h3 className="text-2xl font-bold">

                  {result.summary.passed}

                </h3>

              </div>

            </div>

          </Card>

          <Card className="p-4">

            <div className="flex items-center gap-3">

              <TriangleAlert className="text-yellow-500" />

              <div>

                <p className="text-sm text-muted-foreground">

                  Warnings

                </p>

                <h3 className="text-2xl font-bold">

                  {result.summary.warnings}

                </h3>

              </div>

            </div>

          </Card>

          <Card className="p-4">

            <div className="flex items-center gap-3">

              <XCircle className="text-red-500" />

              <div>

                <p className="text-sm text-muted-foreground">

                  Errors

                </p>

                <h3 className="text-2xl font-bold">

                  {result.summary.errors}

                </h3>

              </div>

            </div>

          </Card>

          <Card className="p-4">

            <div className="flex items-center gap-3">

              <Clock3 className="text-blue-500" />

              <div>

                <p className="text-sm text-muted-foreground">

                  Duration

                </p>

                <h3 className="text-2xl font-bold">

                  {result.duration} ms

                </h3>

              </div>

            </div>

          </Card>

        </div>

      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">

        <Badge className="px-4 py-2">

          <Activity className="mr-2 h-4 w-4" />

          Last Scan

        </Badge>

        <span className="text-sm text-muted-foreground">

          {new Date(result.timestamp).toLocaleString()}

        </span>

      </div>

    </Card>

  );

}
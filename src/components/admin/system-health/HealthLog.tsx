import type { ScanResult } from "@/lib/health/types";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface Props {
  result: ScanResult;
}

export default function HealthLog({
  result,
}: Props) {

  const logs = [

    {
      name: "Database",
      ok: result.database.ok,
      details: `${result.database.existing.length}/${result.database.total} Tables`,
    },

    {
      name: "Storage",
      ok: result.storage.ok,
      details: `${result.storage.buckets} Buckets`,
    },

    {
      name: "Buckets",
      ok: result.buckets.ok,
      details: `${result.buckets.existing.length}/${result.buckets.total} Ready`,
    },

    {
      name: "Authentication",
      ok: result.auth.ok,
      details: result.auth.message,
    },

    {
      name: "Policies",
      ok: result.policies.ok,
      details: `${result.policies.found}/${result.policies.total}`,
    },

    {
      name: "Triggers",
      ok: result.triggers.ok,
      details: `${result.triggers.found}/${result.triggers.total}`,
    },

    {
      name: "Indexes",
      ok: result.indexes.ok,
      details: `${result.indexes.found}/${result.indexes.total}`,
    },

    {
      name: "Settings",
      ok: result.settings.ok,
      details: result.settings.message,
    },

    {
      name: "Performance",
      ok: result.performance.ok,
      details: `${result.performance.duration} ms`,
    },

  ];

  return (

    <Card className="rounded-2xl p-6">

      <div className="mb-6">

        <h2 className="text-2xl font-bold">

          Scan Log

        </h2>

        <p className="text-sm text-muted-foreground">

          آخر نتائج فحص النظام

        </p>

      </div>

      <div className="space-y-3">

        {logs.map((item) => (

          <div
            key={item.name}
            className="flex items-center justify-between rounded-xl border p-4"
          >

            <div className="flex items-center gap-3">

              {item.ok ? (

                <CheckCircle2 className="h-5 w-5 text-green-500" />

              ) : (

                <XCircle className="h-5 w-5 text-red-500" />

              )}

              <div>

                <h3 className="font-medium">

                  {item.name}

                </h3>

                <p className="text-sm text-muted-foreground">

                  {item.details}

                </p>

              </div>

            </div>

            <Badge
              variant={item.ok ? "default" : "destructive"}
            >
              {item.ok ? "OK" : "FAILED"}
            </Badge>

          </div>

        ))}

      </div>

    </Card>

  );

}
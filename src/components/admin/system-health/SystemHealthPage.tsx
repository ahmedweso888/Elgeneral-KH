import { useEffect, useState } from "react";

import { RefreshCcw, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";

import { invokeFunction } from "@/lib/functions";

import type { ScanResult } from "@/lib/health/types";
import { runAutoHeal } from "@/lib/health/auto-heal";

import HealthCard from "./HealthCard";
import HealthProgress from "./HealthProgress";
import HealthResult from "./HealthResult";
import HealthLog from "./HealthLog";

export default function SystemHealthPage() {

  const [loading, setLoading] =
    useState(true);
    const [healing, setHealing] = useState(false);

  const [result, setResult] =
    useState<ScanResult | null>(null);

  async function load() {

    setLoading(true);

    try {

      const data =
        await invokeFunction(
          "system-health",
          {}
        );

      setResult(data);

    }

    catch (err) {

      console.error(err);

    }

    finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    load();

  }, []);

  async function handleAutoHeal() {

  if (healing) return;

  try {

    setHealing(true);

    const result = await runAutoHeal();

    console.log(result.logs);

    await load();

  }

  catch (err) {

    console.error(err);

    alert("فشل Auto Heal");

  }

  finally {

    setHealing(false);

  }

}

  if (loading) {

    return (

      <div className="p-8">

        <HealthProgress />

      </div>

    );

  }

  if (!result) {

    return (

      <div className="p-8">

        تعذر تحميل التقرير

      </div>

    );

  }

  return (

    <div className="space-y-8 p-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">

            System Health

          </h1>

          <p className="text-muted-foreground">

            مراقبة حالة المنصة بالكامل

          </p>

        </div>

        <div className="flex gap-3">

          <Button
            variant="outline"
            onClick={load}
          >

            <RefreshCcw className="mr-2 h-4 w-4" />

            Rescan

          </Button>

          <Button
  onClick={handleAutoHeal}
  disabled={healing}
>

  <Wrench className="mr-2 h-4 w-4" />

  {healing
    ? "جاري الإصلاح..."
    : "Auto Heal"}

</Button>
        </div>

      </div>

      <HealthResult
        result={result}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        <HealthCard
          title="Database"
          description={`${result.database.existing.length}/${result.database.total} Tables`}
          status={result.database.ok ? "success" : "error"}
        />

        <HealthCard
          title="Storage"
          description={`${result.storage.buckets} Buckets`}
          status={result.storage.ok ? "success" : "error"}
        />

        <HealthCard
          title="Buckets"
          description={`${result.buckets.existing.length}/${result.buckets.total} Ready`}
          status={result.buckets.ok ? "success" : "error"}
        />

        <HealthCard
          title="Authentication"
          description={result.auth.message}
          status={result.auth.ok ? "success" : "error"}
        />

        <HealthCard
          title="Policies"
          description={`${result.policies.found}/${result.policies.total}`}
          status={result.policies.ok ? "success" : "warning"}
        />

        <HealthCard
          title="Triggers"
          description={`${result.triggers.found}/${result.triggers.total}`}
          status={result.triggers.ok ? "success" : "warning"}
        />

        <HealthCard
          title="Indexes"
          description={`${result.indexes.found}/${result.indexes.total}`}
          status={result.indexes.ok ? "success" : "warning"}
        />

        <HealthCard
          title="Settings"
          description={result.settings.message}
          status={result.settings.ok ? "success" : "warning"}
        />

        <HealthCard
          title="Performance"
          description={`${result.performance.duration} ms`}
          status={
            result.performance.status === "excellent"
              ? "success"
              : result.performance.status === "good"
              ? "warning"
              : "error"
          }
        />

      </div>

      <HealthLog
        result={result}
      />

    </div>

  );

}
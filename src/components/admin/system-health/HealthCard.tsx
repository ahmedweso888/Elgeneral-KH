import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Status = "success" | "warning" | "error";

interface Props {
  title: string;
  description?: string;
  status: Status;
  value?: string | number;
}

export default function HealthCard({
  title,
  description,
  status,
  value,
}: Props) {
  const config = {
    success: {
      icon: CheckCircle2,
      badge: "Healthy",
      badgeClass:
        "bg-green-500/15 text-green-600 border-green-500/20",
      iconClass: "text-green-500",
    },

    warning: {
      icon: AlertTriangle,
      badge: "Warning",
      badgeClass:
        "bg-yellow-500/15 text-yellow-600 border-yellow-500/20",
      iconClass: "text-yellow-500",
    },

    error: {
      icon: XCircle,
      badge: "Failed",
      badgeClass:
        "bg-red-500/15 text-red-600 border-red-500/20",
      iconClass: "text-red-500",
    },
  };

  const current = config[status];

  const Icon = current.icon;

  return (
    <Card className="rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">

      <div className="flex items-start justify-between">

        <div>

          <h3 className="text-lg font-semibold">

            {title}

          </h3>

          {description && (

            <p className="mt-1 text-sm text-muted-foreground">

              {description}

            </p>

          )}

        </div>

        <Icon
          className={`h-8 w-8 ${current.iconClass}`}
        />

      </div>

      <div className="mt-6 flex items-center justify-between">

        {value && (

          <span className="text-2xl font-bold">

            {value}

          </span>

        )}

        <Badge
          variant="outline"
          className={current.badgeClass}
        >
          {current.badge}
        </Badge>

      </div>

    </Card>
  );
}
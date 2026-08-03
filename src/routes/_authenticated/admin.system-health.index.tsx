import { createFileRoute } from "@tanstack/react-router";
import SystemHealthPage from "@/components/admin/system-health/SystemHealthPage";

export const Route = createFileRoute(
  "/_authenticated/admin/system-health/"
)({
  component: SystemHealthPage,
});
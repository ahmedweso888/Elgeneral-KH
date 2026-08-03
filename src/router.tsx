import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

import SpinnerEye from "@/components/ui/spinner-eye";

function PendingComponent() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/50 backdrop-blur-sm">
      <SpinnerEye size={90} />
    </div>
  );
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,

    defaultPendingComponent: PendingComponent,

    defaultPendingMs: 150,
    defaultPendingMinMs: 400,
  });

  return router;
};
export type HealthStatus =
  | "waiting"
  | "running"
  | "success"
  | "warning"
  | "error";

export interface HealthItem {
  id: string;
  title: string;
  status: HealthStatus;
  progress: number;
  message: string;
}

export const defaultHealth: HealthItem[] = [
  {
    id: "database",
    title: "Database",
    status: "waiting",
    progress: 0,
    message: "Waiting...",
  },

  {
    id: "storage",
    title: "Storage",
    status: "waiting",
    progress: 0,
    message: "Waiting...",
  },

  {
    id: "buckets",
    title: "Buckets",
    status: "waiting",
    progress: 0,
    message: "Waiting...",
  },

  {
    id: "policies",
    title: "RLS Policies",
    status: "waiting",
    progress: 0,
    message: "Waiting...",
  },

  {
    id: "functions",
    title: "Edge Functions",
    status: "waiting",
    progress: 0,
    message: "Waiting...",
  },

  {
    id: "triggers",
    title: "Triggers",
    status: "waiting",
    progress: 0,
    message: "Waiting...",
  },

  {
    id: "indexes",
    title: "Indexes",
    status: "waiting",
    progress: 0,
    message: "Waiting...",
  },

  {
    id: "auth",
    title: "Authentication",
    status: "waiting",
    progress: 0,
    message: "Waiting...",
  },

  {
    id: "settings",
    title: "Settings",
    status: "waiting",
    progress: 0,
    message: "Waiting...",
  },

  {
    id: "weekly",
    title: "Weekly Questions",
    status: "waiting",
    progress: 0,
    message: "Waiting...",
  },

  {
    id: "leaderboard",
    title: "Leaderboard",
    status: "waiting",
    progress: 0,
    message: "Waiting...",
  },

  {
    id: "performance",
    title: "Performance",
    status: "waiting",
    progress: 0,
    message: "Waiting...",
  },
];

export function updateHealth(
  list: HealthItem[],
  id: string,
  data: Partial<HealthItem>
) {
  return list.map((item) =>
    item.id === id
      ? {
          ...item,
          ...data,
        }
      : item
  );
}

export function calculateHealthScore(
  list: HealthItem[]
) {
  const success = list.filter(
    (x) => x.status === "success"
  ).length;

  return Math.round(
    (success / list.length) * 100
  );
}
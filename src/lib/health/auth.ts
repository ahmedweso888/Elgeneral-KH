import type { HealthItem } from "./scan";
import { updateHealth } from "./scan";

export interface AuthScanResult {
  ok: boolean;
  loggedIn: boolean;
  emailVerified: boolean;
  message: string;
}

export async function scanAuth(
  list: HealthItem[],
  result: AuthScanResult
) {
  list = updateHealth(list, "auth", {
    status: "running",
    progress: 30,
    message: "Checking authentication...",
  });

  if (result.ok) {
    list = updateHealth(list, "auth", {
      status: "success",
      progress: 100,
      message: "Authentication OK",
    });
  } else {
    list = updateHealth(list, "auth", {
      status: "warning",
      progress: 100,
      message: result.message,
    });
  }

  return list;
}
import { invokeFunction } from "@/lib/functions";

export interface AutoHealResult {

  success: boolean;

  fixed: number;

  duration: number;

  logs: string[];

}

export async function runAutoHeal() {

  const result = await invokeFunction(
  "auto-heal",
  {}
);

return result as AutoHealResult;
}
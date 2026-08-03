import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const analyzePerformance = createServerFn({
  method: "POST",
})
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const userId = (context as any).user.id;

    const res = await fetch(
      `${process.env.VITE_SUPABASE_URL}/functions/v1/ai-prediction`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: userId,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Prediction failed");
    }

    return await res.json();
  });
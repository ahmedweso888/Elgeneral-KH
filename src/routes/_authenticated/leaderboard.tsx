import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

export const Route = createFileRoute("/_authenticated/leaderboard")({
  component: LeaderboardPage,
});

function LeaderboardPage() {
  const { data: rows } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data } = await supabase
        .from("kingdom")
        .select("user_id, xp, gold, level, profiles(full_name)")
        .order("xp", { ascending: false })
        .limit(50);
      return data ?? [];
    },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-3xl font-black flex items-center gap-2"><Trophy className="h-7 w-7 text-accent-foreground" /> لوحة المتصدرين</h1>

      <Card className="overflow-hidden">
        {rows?.map((r: any, i: number) => (
          <div key={r.user_id} className={`flex items-center gap-4 p-4 border-b last:border-0 ${i < 3 ? "bg-accent/5" : ""}`}>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-muted font-black">
              {i === 0 ? <Medal className="h-5 w-5 text-yellow-500" /> : i === 1 ? <Medal className="h-5 w-5 text-gray-400" /> : i === 2 ? <Medal className="h-5 w-5 text-amber-700" /> : i + 1}
            </div>
            <div className="flex-1">
              <div className="font-bold">{r.profiles?.full_name ?? "طالب"}</div>
              <div className="text-xs text-muted-foreground">مستوى {r.level}</div>
            </div>
            <div className="text-left">
              <div className="font-black text-accent-foreground">{r.xp} XP</div>
              <div className="text-xs text-muted-foreground">{r.gold} 🪙</div>
            </div>
          </div>
        ))}
        {rows && rows.length === 0 && <div className="p-10 text-center text-muted-foreground">لا يوجد طلاب بعد.</div>}
      </Card>
    </div>
  );
}

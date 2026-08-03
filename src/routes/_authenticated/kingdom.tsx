import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import {
  Castle,
  Coins,
  Gem,
  Shield,
  Building2,
  Crown,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/kingdom")({
  component: KingdomPage,
});

function KingdomPage() {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["kingdom", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [{ data: student }, { data: kingdom }] =
        await Promise.all([
          supabase
            .from("students")
            .select("xp,level,coins")
            .eq("id", user!.id)
            .single(),

          supabase
            .from("kingdom")
            .select("*")
            .eq("student_id", user!.id)
            .single(),
        ]);

      return {
        student,
        kingdom,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="p-10 text-center">
        جاري تحميل المملكة...
      </div>
    );
  }

  const student = data?.student;
  const kingdom = data?.kingdom;

  const level = student?.level ?? 1;
  const xp = student?.xp ?? 0;

  const xpNeed = level * 1000;

  const progress =
    Math.min((xp / xpNeed) * 100, 100);

  return (
    <div className="container mx-auto py-8 space-y-8">

      <div>

        <h1 className="text-4xl font-black flex items-center gap-3">

          <Crown className="text-yellow-500" />

          مملكتي

        </h1>

        <p className="text-muted-foreground mt-2">

          كل امتحان يطور مملكتك.

        </p>

      </div>

      <div className="grid lg:grid-cols-4 gap-5">

        <Card className="p-6">

          <div className="flex items-center gap-2 mb-2">

            <Crown />

            المستوى

          </div>

          <div className="text-4xl font-black">

            {level}

          </div>

        </Card>

        <Card className="p-6">

          <div className="flex items-center gap-2 mb-2">

            <Shield />

            XP

          </div>

          <div className="text-3xl font-black">

            {xp}

          </div>

          <Progress
            className="mt-4"
            value={progress}
          />

        </Card>

        <Card className="p-6">

          <div className="flex items-center gap-2 mb-2">

            <Coins />

            الذهب

          </div>

          <div className="text-4xl font-black">

            {kingdom?.gold ?? 0}

          </div>

        </Card>

        <Card className="p-6">

          <div className="flex items-center gap-2 mb-2">

            <Gem />

            الألماس

          </div>

          <div className="text-4xl font-black">

            {kingdom?.diamonds ?? 0}

          </div>

        </Card>

      </div>

      <div className="grid lg:grid-cols-3 gap-5">

        <Card className="p-6">

          <div className="flex items-center gap-2 mb-4">

            <Building2 />

            مستوى المدينة

          </div>

          <div className="text-5xl font-black">

            {kingdom?.city_level ?? 1}

          </div>

        </Card>

        <Card className="p-6">

          <div className="flex items-center gap-2 mb-4">

            <Castle />

            مستوى القلعة

          </div>

          <div className="text-5xl font-black">

            {kingdom?.castle_level ?? 1}

          </div>

        </Card>

        <Card className="p-6">

          <div className="flex items-center gap-2 mb-4">

            <Shield />

            قوة الجيش

          </div>

          <div className="text-5xl font-black">

            {kingdom?.army_power ?? 0}

          </div>

        </Card>

      </div>

    </div>
  );
}

export default KingdomPage;
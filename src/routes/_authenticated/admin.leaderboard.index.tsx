import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { invokeFunction } from "@/lib/functions";

import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute(
  "/_authenticated/admin/leaderboard/"
)({
  component: LeaderboardAdminPage,
});

function LeaderboardAdminPage() {

  const [loading,setLoading]=
    useState(true);

  const [players,setPlayers]=
    useState<any[]>([]);

  useEffect(()=>{

    loadLeaderboard();

  },[]);

  async function loadLeaderboard(){

    setLoading(true);

    const {data}=await supabase

      .from("leaderboard")

      .select(`
        *,
        students(
          full_name,
          grade,
          level
        )
      `)

      .order("total_points",{
        ascending:false,
      });

    setPlayers(data??[]);

    setLoading(false);

  }

  async function resetLeaderboard(){

  if(!confirm("إعادة بناء لوحة الصدارة؟")) return;

  try{

    await invokeFunction(

      "leaderboard-update",

      {}

    );

    generalToast.success(

      "تم تحديث لوحة الصدارة"

    );

    loadLeaderboard();

  }

  catch(err:any){

    generalToast.error(err.message);

  }

}

  if(loading){

    return(

      <div className="p-10">

        جارى تحميل لوحة الصدارة...

      </div>

    );

  }
  return (

  <div className="container mx-auto py-8 space-y-8">

    <div className="flex justify-between items-center">

      <h1 className="text-4xl font-black">

        لوحة الصدارة

      </h1>

      <Button
        variant="destructive"
        onClick={resetLeaderboard}
      >
        تصفير الموسم
      </Button>

    </div>

    <div className="space-y-4">

      {players.length===0 ? (

        <Card className="p-6">

          لا يوجد بيانات

        </Card>

      ) : (

        players.map((player,index)=>(

          <Card
            key={player.id}
            className="p-6 flex justify-between items-center"
          >

            <div>

              <h2 className="text-xl font-bold">

                #{index+1} {player.students?.full_name}

              </h2>

              <p className="text-muted-foreground">

                {player.students?.grade}

              </p>

            </div>

            <div className="text-end">

              <div>

                ⭐ {player.total_points ?? 0}

              </div>

              <div>

                📝 {player.exams_completed ?? 0}

              </div>

              <div>

                🏆 {player.weekly_wins ?? 0}

              </div>

            </div>

          </Card>

        ))

      )}

    </div>

  </div>

);

}
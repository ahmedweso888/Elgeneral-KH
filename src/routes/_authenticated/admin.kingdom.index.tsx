import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { invokeFunction } from "@/lib/functions";
import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute(
"/_authenticated/admin/kingdom/"
)({
component: KingdomAdminPage,
});

function KingdomAdminPage(){

const [loading,setLoading]=
useState(true);

const [kingdoms,setKingdoms]=
useState<any[]>([]);

useEffect(()=>{

loadKingdoms();

},[]);

async function loadKingdoms(){

setLoading(true);

const {data}=await supabase

.from("kingdom")

.select(`
*,
students(
full_name,
grade
)
`)

.order("gold",{
ascending:false
});

setKingdoms(data??[]);

setLoading(false);

}

async function saveKingdom(player:any){

try{

await invokeFunction(

"kingdom-update",

{

studentId:player.student_id,

gold:player.gold,

diamonds:player.diamonds,

castle_level:player.castle_level,

city_level:player.city_level,

army_power:player.army_power,

}

);

generalToast.success("تم الحفظ");

loadKingdoms();

}

catch(err:any){

generalToast.error(err.message);

}

}

if(loading){

return(

<div className="p-10">

جارى تحميل المملكة...

</div>

);

}
return (

  <div className="container mx-auto py-8 space-y-8">

    <h1 className="text-4xl font-black">

      إدارة المملكة

    </h1>

    <div className="space-y-5">

      {kingdoms.map((player,index)=>(

        <Card
          key={player.id}
          className="p-6"
        >

          <div className="flex justify-between items-center mb-5">

            <div>

              <h2 className="text-2xl font-bold">

                #{index+1} {player.students?.full_name}

              </h2>

              <p className="text-muted-foreground">

                {player.students?.grade}

              </p>

            </div>

          </div>

          <div className="grid md:grid-cols-5 gap-4">

            <Input
              type="number"
              value={player.gold ?? 0}
              onChange={(e)=>{

                const value=Number(e.target.value);

                setKingdoms(prev=>

                  prev.map(k=>

                    k.id===player.id
                      ? {...k,gold:value}
                      : k

                  )

                );

              }}
            />

            <Input
              type="number"
              value={player.diamonds ?? 0}
              onChange={(e)=>{

                const value=Number(e.target.value);

                setKingdoms(prev=>

                  prev.map(k=>

                    k.id===player.id
                      ? {...k,diamonds:value}
                      : k

                  )

                );

              }}
            />

            <Input
              type="number"
              value={player.castle_level ?? 1}
              onChange={(e)=>{

                const value=Number(e.target.value);

                setKingdoms(prev=>

                  prev.map(k=>

                    k.id===player.id
                      ? {...k,castle_level:value}
                      : k

                  )

                );

              }}
            />

            <Input
              type="number"
              value={player.city_level ?? 1}
              onChange={(e)=>{

                const value=Number(e.target.value);

                setKingdoms(prev=>

                  prev.map(k=>

                    k.id===player.id
                      ? {...k,city_level:value}
                      : k

                  )

                );

              }}
            />

            <Input
              type="number"
              value={player.army_power ?? 0}
              onChange={(e)=>{

                const value=Number(e.target.value);

                setKingdoms(prev=>

                  prev.map(k=>

                    k.id===player.id
                      ? {...k,army_power:value}
                      : k

                  )

                );

              }}
            />

          </div>

          <Button
            className="mt-5"
            onClick={()=>saveKingdom(player)}
          >

            حفظ التعديلات

          </Button>

        </Card>

      ))}

    </div>

  </div>

);

}
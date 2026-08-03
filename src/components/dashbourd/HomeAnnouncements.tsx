import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Megaphone } from "lucide-react";
type Props = {
  announcements: any[];
};

export default function HomeAnnouncements({
  announcements,
}: Props) {

  

  return (

    <Card className="p-6 space-y-5">

      <div className="flex items-center gap-3">

        <Megaphone className="h-6 w-6 text-primary" />

        <h2 className="text-2xl font-black">

          الإعلانات

        </h2>

      </div>

      <div className="space-y-4">

        {announcements.map((item) => (

          <div
            key={item.id}
            className="rounded-xl border p-4 hover:bg-muted transition-all"
          >

            <h3 className="text-lg font-bold">

              {item.title}

            </h3>

            <p className="mt-2 text-muted-foreground whitespace-pre-wrap">

              {item.content}

            </p>

            <div className="mt-3 text-xs text-muted-foreground">

              {new Date(item.created_at).toLocaleDateString("ar-EG")}

            </div>

          </div>

        ))}

      </div>

    </Card>

  );

}
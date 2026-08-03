import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { invokeFunction } from "@/lib/functions";
import {
  Plus,
  Search,
  Radio,
  Pencil,
} from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/admin/live/"
)({
  component: AdminLivePage,
});

function AdminLivePage() {

  const [loading, setLoading] = useState(true);

  const [streams, setStreams] = useState<any[]>([]);

  const [filteredStreams, setFilteredStreams] =
    useState<any[]>([]);

  const [search, setSearch] = useState("");

  useEffect(() => {

    loadStreams();


  }, []);

  useEffect(() => {

    if (!search.trim()) {

      setFilteredStreams(streams);

      return;

    }

    setFilteredStreams(

      streams.filter((item) =>

        item.title
          .toLowerCase()
          .includes(search.toLowerCase())

      )

    );

  }, [search, streams]);

  async function loadStreams() {

    setLoading(true);

    const { data, error } = await supabase

      .from("live_streams")

      .select("*")

      .order("created_at", {
        ascending: false,
      });

    if (!error) {

      setStreams(data ?? []);

      setFilteredStreams(data ?? []);

    }

    setLoading(false);

  }
  async function endLive(id:string){

try{

await invokeFunction(

"live-end",

{

liveId:id,

}

);

loadStreams();

}

catch(err:any){

console.log(err);

}

}

  if (loading) {

    return (

      <div className="p-10 text-xl">

        جاري تحميل اللايفات...

      </div>

    );

  }
    return (

    <div className="container mx-auto py-8 space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-black flex items-center gap-3">

            <Radio className="h-8 w-8 text-red-500" />

            إدارة اللايفات

          </h1>

          <p className="text-muted-foreground mt-2">

            إنشاء وإدارة جميع البثوث المباشرة

          </p>

        </div>

        <Link to="/admin/live/new">

          <Button size="lg">

            <Plus className="mr-2 h-5 w-5" />

            إضافة لايف

          </Button>

        </Link>

      </div>

      <Card className="p-5">

        <div className="relative">

          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input

            className="pl-10"

            placeholder="ابحث عن لايف..."

            value={search}

            onChange={(e) =>

              setSearch(e.target.value)

            }

          />

        </div>

      </Card>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredStreams.length === 0 ? (

          <Card className="col-span-full p-10 text-center">

            <Radio className="mx-auto h-12 w-12 text-muted-foreground mb-4" />

            <h2 className="text-2xl font-bold">

              لا توجد بثوث مباشرة

            </h2>

          </Card>

        ) : (

          filteredStreams.map((stream) => (
                        <Card
              key={stream.id}
              className="overflow-hidden hover:shadow-xl transition-all"
            >

              {stream.thumbnail_url ? (

                <img
                  src={stream.thumbnail_url}
                  className="w-full h-52 object-cover"
                />

              ) : (

                <div className="w-full h-52 bg-muted flex items-center justify-center">

                  <Radio className="h-14 w-14 text-muted-foreground" />

                </div>

              )}

              <div className="p-5 space-y-4">

                <h2 className="text-xl font-bold line-clamp-2">

                  {stream.title}

                </h2>

                {stream.description && (

                  <p className="text-muted-foreground line-clamp-2">

                    {stream.description}

                  </p>

                )}

                <div className="flex items-center justify-between text-sm">

                  <span>

                    👁 {stream.viewers_count ?? 0}

                  </span>

                  <span>

                    {stream.scheduled_at
                      ? new Date(
                          stream.scheduled_at
                        ).toLocaleString("ar-EG")
                      : "غير محدد"}

                  </span>

                </div>

                <div className="flex items-center justify-between">

                  {stream.is_live ? (

                    <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse">

                      🔴 مباشر الآن

                    </span>

                  ) : stream.is_scheduled ? (

                    <span className="px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-bold">

                      ⏰ مجدول

                    </span>

                  ) : (

                    <span className="px-3 py-1 rounded-full bg-gray-500 text-white text-xs font-bold">

                      انتهى

                    </span>

                  )}

                  <div className="flex gap-2">

<Link
to="/admin/live/$liveId"
params={{
liveId:String(stream.id),
}}
>

<Button
size="sm"
variant="outline"
>

<Pencil className="mr-2 h-4 w-4"/>

تعديل

</Button>

</Link>

{stream.is_live&&(

<Button

size="sm"

variant="destructive"

onClick={()=>endLive(stream.id)}

>

إنهاء

</Button>

)}

</div>

                </div>

              </div>

            </Card>

          ))

        )}

      </div>
          </div>

  );

}

export default AdminLivePage;
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Radio, StopCircle } from "lucide-react";
import { generalToast } from "@/lib/general-toast";
import { invokeFunction } from "@/lib/functions";

export const Route = createFileRoute(
  "/_authenticated/admin/live/$liveId"
)({
  component: AdminLiveEditPage,
});

function AdminLiveEditPage() {
  const { liveId } = Route.useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [live, setLive] = useState<any>(null);

  useEffect(() => {
    loadLive();
  }, []);

  async function loadLive() {
    setLoading(true);
    const { data, error } = await supabase
      .from("live_streams")
      .select("*")
      .eq("id", liveId)
      .single();

    if (error || !data) {
      generalToast.error("لم يتم العثور على اللايف");
      setLoading(false);
      return;
    }

    setLive(data);
    setLoading(false);
  }

  async function saveChanges(){

if(!live) return;

setSaving(true);

try{

await invokeFunction(

"live-update",

{

liveId,

title:live.title,

description:live.description,

scheduled_at:live.scheduled_at,

is_scheduled:live.is_scheduled,

is_live:live.is_live,

}

);

generalToast.success("تم حفظ التعديلات");

navigate({

to:"/admin/live",

});

}

catch(err:any){

generalToast.error(err.message);

}

finally{

setSaving(false);

}

}

  async function endLive(){

if(!live) return;

setSaving(true);

try{

await invokeFunction(

"live-end",

{

liveId,

}

);

generalToast.success("تم إنهاء البث");

navigate({

to:"/admin/live",

});

}

catch(err:any){

generalToast.error(err.message);

}

finally{

setSaving(false);

}

}

  if (loading) {
    return <div className="p-10 text-xl">جارى تحميل بيانات اللايف...</div>;
  }

  if (!live) {
    return <div className="p-10 text-xl">لايف غير موجود</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black flex items-center gap-3">
          <Radio className="h-8 w-8 text-red-500" /> تعديل اللايف
        </h1>
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/admin/live" })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> رجوع
        </Button>
      </div>

      <Card className="p-8 space-y-6">
        {live.thumbnail_url && (
          <img
            src={live.thumbnail_url}
            alt="Thumbnail"
            className="w-full h-64 object-cover rounded-lg"
          />
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>عنوان اللايف</Label>
            <Input
              value={live.title ?? ""}
              onChange={(e) => setLive({ ...live, title: e.target.value })}
            />
          </div>
          <div>
            <Label>موعد اللايف</Label>
            <Input
              type="datetime-local"
              value={live.scheduled_at ?? ""}
              onChange={(e) =>
                setLive({ ...live, scheduled_at: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <Label>وصف اللايف</Label>
            <Textarea
              rows={6}
              value={live.description ?? ""}
              onChange={(e) =>
                setLive({ ...live, description: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-bold"> جدولة اللايف </h3>
              <p className="text-sm text-muted-foreground">
                عند تفعيلها سيظهر اللايف فى صفحة الطلاب قبل موعده.
              </p>
            </div>
            <Switch
              checked={live.is_scheduled}
              onCheckedChange={(v) => setLive({ ...live, is_scheduled: v })}
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between rounded-lg border p-4">
            <div>
              <h3 className="font-bold"> حالة البث </h3>
              <p className="text-sm text-muted-foreground">
                يمكنك تشغيل أو إيقاف البث من هنا.
              </p>
            </div>
            <Switch
              checked={live.is_live}
              onCheckedChange={(v) => setLive({ ...live, is_live: v })}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button
            variant="destructive"
            size="lg"
            disabled={saving}
            onClick={endLive}
          >
            <StopCircle className="mr-2 h-4 w-4" /> إنهاء البث
          </Button>
          <Button size="lg" disabled={saving} onClick={saveChanges}>
            <Save className="mr-2 h-4 w-4" /> {saving ? "جارى الحفظ..." : "حفظ"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default AdminLiveEditPage;

import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute("/_authenticated/admin/style")({
  component: StyleAdmin,
});

type QA = { q: string; a: string };

function StyleAdmin() {
  const qc = useQueryClient();
  const [systemPrompt, setSystemPrompt] = useState("");
  const [sampleQa, setSampleQa] = useState<QA[]>([]);

  const { data } = useQuery({
    queryKey: ["teacher-style-admin"],
    queryFn: async () => (await supabase.from("teacher_style").select("*").limit(1).maybeSingle()).data,
  });

  useEffect(() => {
    if (data) {
      setSystemPrompt(data.system_prompt ?? "");
      const qa = Array.isArray(data.sample_qa) ? (data.sample_qa as unknown as QA[]) : [];
      setSampleQa(qa);
    }
  }, [data]);

  async function save() {
    const payload = { system_prompt: systemPrompt, sample_qa: sampleQa as unknown as never };
    const { error } = data?.id
      ? await supabase.from("teacher_style").update(payload).eq("id", data.id)
      : await supabase.from("teacher_style").insert(payload);
    if (error) return generalToast.error(error.message);
    generalToast.success("تم الحفظ");
    qc.invalidateQueries({ queryKey: ["teacher-style-admin"] });
  }

  function addQa() { setSampleQa([...sampleQa, { q: "", a: "" }]); }
  function updateQa(i: number, key: "q" | "a", value: string) {
    setSampleQa(sampleQa.map((x, idx) => (idx === i ? { ...x, [key]: value } : x)));
  }
  function removeQa(i: number) { setSampleQa(sampleQa.filter((_, idx) => idx !== i)); }

  return (
    <Card className="p-6 max-w-3xl space-y-4">
      <h2 className="text-xl font-bold">أسلوب التدريس للأستاذ خالد هاشم</h2>
      <p className="text-sm text-muted-foreground">يستخدم المساعد الذكي ما تكتبه هنا ليجيب بأسلوبك الخاص.</p>

      <div className="space-y-2">
        <Label>تعليمات النظام (الشخصية والأسلوب والنبرة)</Label>
        <Textarea
          rows={10}
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="مثال: أنت الجنرال خالد هاشم، أستاذ تاريخ مصري حماسي، تشرح بأسلوب قصصي، تركز على الأسباب والنتائج…"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>أمثلة لأسئلة وإجابات بأسلوبك</Label>
          <Button variant="outline" size="sm" onClick={addQa}>+ مثال</Button>
        </div>
        {sampleQa.map((qa, i) => (
          <div key={i} className="rounded-md border p-3 space-y-2">
            <Textarea rows={2} placeholder="السؤال" value={qa.q} onChange={(e) => updateQa(i, "q", e.target.value)} />
            <Textarea rows={4} placeholder="إجابة الأستاذ" value={qa.a} onChange={(e) => updateQa(i, "a", e.target.value)} />
            <Button variant="ghost" size="sm" onClick={() => removeQa(i)}>حذف</Button>
          </div>
        ))}
      </div>

      <Button onClick={save} size="lg">حفظ</Button>
    </Card>
  );
}

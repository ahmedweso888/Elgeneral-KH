import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<File | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [grade, setGrade] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    loadStudent();
  }, []);

  async function loadStudent() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      generalToast.error(error.message);
      return;
    }

    setFullName(data.full_name ?? "");
    setEmail(data.email ?? "");
    setPhone(data.phone ?? "");
    setParentPhone(data.parent_phone ?? "");
    setGrade(data.grade ?? "");
    setAvatar(data.avatar ?? "");

    setLoading(false);
  }

  async function uploadAvatar() {
    if (!image) {
      generalToast.error("اختر صورة أولاً");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const ext = image.name.split(".").pop();
    const fileName = `${user.id}.${ext}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, image, {
        upsert: true,
      });

    if (error) {
      generalToast.error(error.message);
      return;
    }

    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from("students")
      .update({
        avatar: data.publicUrl,
      })
      .eq("id", user.id);

    if (updateError) {
      generalToast.error(updateError.message);
      return;
    }

    setAvatar(data.publicUrl);

    generalToast.success("تم رفع الصورة");
  }

  async function saveProfile() {
    if (!/^01[0125][0-9]{8}$/.test(phone)) {
      generalToast.error("رقم الطالب غير صحيح");
      return;
    }

    if (!/^01[0125][0-9]{8}$/.test(parentPhone)) {
      generalToast.error("رقم ولي الأمر غير صحيح");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("students")
      .update({
        full_name: fullName,
        phone,
        parent_phone: parentPhone,
        grade,
      })
      .eq("id", user.id);

    if (error) {
      generalToast.error(error.message);
      return;
    }

    generalToast.success("تم حفظ البيانات");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-xl font-bold">
        جاري التحميل...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 flex justify-center">
      <Card className="w-full max-w-2xl p-8 space-y-6">

        <div className="flex flex-col items-center gap-4">

          <img
            src={avatar || "/avatar.png"}
            className="w-40 h-40 rounded-full object-cover border-4"
          />

          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files?.[0] ?? null)
            }
          />

          <Button onClick={uploadAvatar}>
            رفع الصورة
          </Button>

        </div>

        <div className="grid gap-4">

          <div>
            <Label>الاسم</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <Label>البريد الإلكتروني</Label>
            <Input value={email} readOnly />
          </div>

          <div>
            <Label>رقم الطالب</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <Label>رقم ولي الأمر</Label>
            <Input
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
            />
          </div>

          <div>
            <Label>الصف الدراسي</Label>

            <select
              className="w-full h-10 rounded-md border px-3"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <option value="أولى ثانوي">أولى ثانوي</option>
              <option value="ثانية ثانوي">ثانية ثانوي</option>
              <option value="ثالثة ثانوي">ثالثة ثانوي</option>
            </select>

          </div>

          <Button
            className="w-full mt-4"
            onClick={saveProfile}
          >
            حفظ التعديلات
          </Button>

        </div>

      </Card>
    </div>
  );
}
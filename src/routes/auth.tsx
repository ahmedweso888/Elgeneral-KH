import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { generalToast } from "@/lib/general-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import logo from "@/assests/logo.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import authBg from "@/assests/seal.png";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{ title: "تسجيل الدخول — منصة الجنرال خالد هاشم" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [tab, setTab] = useState<"signin" | "signup">(
    search.mode === "signup" ? "signup" : "signin"
  );

  const [busy, setBusy] = useState(false);

  useEffect(() => {
  supabase.auth.getUser().then(({ data }) => {
    if (data.user?.email_confirmed_at) {
      navigate({
        to: "/dashboard",
      });
    }
  });
}, [navigate]);

 async function handleEmail(
  mode: "signin" | "signup",
  email: string,
  password: string,
  fullName?: string,
  phone?: string,
  parentPhone?: string,
  grade?: string
) {
  setBusy(true);

  try {
    if (mode === "signup") {
      // التحقق من البيانات
      if (!fullName?.trim()) {
        generalToast.error("اكتب الاسم");
        return;
      }

      if (!/^01[0125][0-9]{8}$/.test(phone ?? "")) {
        generalToast.error("رقم الطالب غير صحيح");
        return;
      }

      if (!/^01[0125][0-9]{8}$/.test(parentPhone ?? "")) {
        generalToast.error("رقم ولي الأمر غير صحيح");
        return;
      }

      if (!grade) {
        generalToast.error("اختر الصف الدراسي");
        return;
      }
// التحقق من أن البريد غير مستخدم
const { data: emailExists } = await supabase
  .from("students")
  .select("id")
  .eq("email", email)
  .maybeSingle();

if (emailExists) {
  generalToast.error("البريد الإلكتروني مستخدم بالفعل");
  return;
}

// التحقق من أن رقم الطالب غير مستخدم
const { data: phoneExists } = await supabase
  .from("students")
  .select("id")
  .eq("phone", phone!)
  .maybeSingle();

if (phoneExists) {
  generalToast.error("رقم الهاتف مستخدم بالفعل");
  return;
}
const { data: parentExists } = await supabase
  .from("students")
  .select("id")
  .eq("parent_phone", parentPhone!)
  .maybeSingle();

if (parentExists) {
  generalToast.error("رقم ولي الأمر مستخدم بالفعل");
  return;
}
      // إنشاء الحساب
      const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      full_name: fullName,
    },
  },
});

if (error) throw error;

if (!data.user) {
  throw new Error("User was not created");
}

const { error: studentError } = await supabase
  .from("students")
  .insert({
    id: data.user.id,
    full_name: fullName,
    email,
    phone,
    parent_phone: parentPhone,
    grade,
    coins: 0,
    xp: 0,
    level: 1,
    is_active: true,
    is_admin: false,
  });

if (studentError) throw studentError;

      generalToast.success(
        "تم إنشاء الحساب بنجاح، تم إرسال رسالة تأكيد إلى بريدك الإلكتروني."
      );

      setTab("signin");
      return;
    }

    // ======================
    // تسجيل الدخول
    // ======================

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email_confirmed_at) {
      generalToast.error("يرجى تأكيد البريد الإلكتروني أولاً.");
      await supabase.auth.signOut();
      return;
    }

    generalToast.success("تم تسجيل الدخول");

    navigate({
      to: "/dashboard",
    });
  } catch (err: any) {
    console.error(err);
    generalToast.error(err.message ?? "حدث خطأ");
  } finally {
    setBusy(false);
  }
}

  return (
<div className="relative min-h-screen flex items-center justify-center px-6 py-10 overflow-hidden">
  
        {/* Seal */}
<div className="hidden xl:block absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none -z-10">
  <img
    src={authBg}
    alt=""
    className="w-[700px] opacity-90 animate-[spin_120s_linear_infinite]"
  />
</div>
<div className="hidden xl:block absolute left-10 top-1/2 -translate-y-1/2 pointer-events-none -z-10">
  <img
    src={authBg}
    alt=""
    className="w-[700px] opacity-90 animate-[spin_120s_linear_infinite]"
  />
</div>
<div className="xl:hidden pointer-events-none absolute inset-0 overflow-hidden">

  <img
    src={authBg}
    alt=""
    className="
      absolute
      -top-
      w-[400px]
      opacity-90
      rotate-[-18deg]
    "
  />
  <img
    src={authBg}
    alt=""
    className="
      absolute
      -bottom-22
      w-[400px]
      opacity-90
      rotate-[18deg]
    "
  />

</div>
      <Card className="w-full max-w-md p-6">

        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground font-black">
  <img
  src={logo}
  alt="الجنرال خالد هاشم"
  className="h-full w-full object-contain p-0 scale-190"
/>

          </div>

          <h1 className="text-2xl font-bold">
             الجنرال خالد هاشم
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            سجل دخولك أو أنشئ حساباً جديداً
          </p>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">
              دخول
            </TabsTrigger>

            <TabsTrigger value="signup">
              حساب جديد
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();

                const f = new FormData(e.currentTarget);

                handleEmail(
                  "signin",
                  String(f.get("email")),
                  String(f.get("password"))
                );
              }}
            >
              <div>
                <Label htmlFor="si-email">
                  البريد الإلكتروني
                </Label>

                <Input
                  id="si-email"
                  name="email"
                  type="email"
                  required
                  dir="ltr"
                />
              </div>

              <div>
                <Label htmlFor="si-pass">
                  كلمة المرور
                </Label>

                <Input
                  id="si-pass"
                  name="password"
                  type="password"
                  required
                  dir="ltr"
                />
              </div>

              <Button
                className="w-full"
                type="submit"
                disabled={busy}
              >
                دخول
              </Button>
            </form>
          </TabsContent>
          <button
  type="button"
  className="w-full text-sm text-primary mt-2 hover:underline"
  onClick={async () => {
    const email = prompt("اكتب البريد الإلكتروني");

    if (!email) return;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      generalToast.error(error.message);
    } else {
      generalToast.success("تم إرسال رابط إعادة تعيين كلمة المرور.");
    }
  }}
>
  نسيت كلمة المرور؟
</button>

          <TabsContent value="signup">
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();

                const f = new FormData(e.currentTarget);

                handleEmail(
                "signup",
                 String(f.get("email")),
                 String(f.get("password")),
                 String(f.get("name")),
                 String(f.get("phone")),
                 String(f.get("parent_phone")),
                 String(f.get("grade"))
            );
              }}
            >
              <div>
                <Label htmlFor="su-name">
                  الاسم
                </Label>

                <Input
                  id="su-name"
                  name="name"
                  required
                />
              </div>
              <div>
 <Label>رقم الهاتف</Label>
  <Input
    name="phone"
    type="tel"
    required
  />
              </div>

              <div>
  <Label>رقم ولي الأمر</Label>
  <Input
    name="parent_phone"
    type="tel"
    required
  />
              </div>

              <div>
  <Label>الصف الدراسي</Label>

  <select
    name="grade"
    required
    className="w-full h-10 rounded-md border px-3"
  >
    <option value="">اختر الصف</option>

    <option value="أولى ثانوي">أولى ثانوي</option>
    <option value="ثانية ثانوي">ثانية ثانوي</option>
    <option value="ثالثة ثانوي">ثالثة ثانوي</option>
  </select>
               </div>

              <div>
                <Label htmlFor="su-email">
                  البريد الإلكتروني
                </Label>

                <Input
                  id="su-email"
                  name="email"
                  type="email"
                  required
                  dir="ltr"
                />
              </div>

              <div>
                <Label htmlFor="su-pass">
                  كلمة المرور
                </Label>

                <Input
                  id="su-pass"
                  name="password"
                  type="password"
                  minLength={6}
                  required
                  dir="ltr"
                />
              </div>

              <Button
                className="w-full"
                type="submit"
                disabled={busy}
              >
                إنشاء حساب
              </Button>
            </form>
          </TabsContent>
        </Tabs>

                <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          <div className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full mt-4"
          onClick={() =>
            navigate({
              to: "/",
            })
          }
        >
          العودة للرئيسية
        </Button>

      </Card>
      

        
    
    </div>
  );
}
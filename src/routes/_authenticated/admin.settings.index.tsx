import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { invokeFunction } from "@/lib/functions";
import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute(
  "/_authenticated/admin/settings/"
)({
  component: AdminSettingsPage,
});

type Settings = {
  id?: string;

  academy_name: string;
  logo_url: string;
  hero_image: string;

  whatsapp_number: string;

  facebook_url: string;
  telegram_url: string;
  youtube_url: string;
  tiktok_url: string;
  instagram_url: string;

  support_email: string;
  location: string;

  ai_enabled: boolean;
  weekly_question_enabled: boolean;
  leaderboard_enabled: boolean;
  maintenance_mode: boolean;
};

const defaultSettings: Settings = {
  academy_name: "",
  logo_url: "",
  hero_image: "",

  whatsapp_number: "",

  facebook_url: "",
  telegram_url: "",
  youtube_url: "",
  tiktok_url: "",
  instagram_url: "",

  support_email: "",
  location: "",

  ai_enabled: true,
  weekly_question_enabled: true,
  leaderboard_enabled: true,
  maintenance_mode: false,
};

function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
const [saving,setSaving] = useState(false);
  const [settings, setSettings] =
    useState<Settings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);

    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      generalToast.error(error.message);
      setLoading(false);
      return;
    }

    if (!data) {
      setSettings(defaultSettings);
      setLoading(false);
      return;
    }

    setSettings({
  ...defaultSettings,
  ...(data as Partial<Settings>),
});

    setLoading(false);
  }

 async function saveSettings(){

 if(saving) return;

 setSaving(true);

 try{

 await invokeFunction(
 "settings-update",
 settings
 );

 generalToast.success("تم حفظ الإعدادات");

 loadSettings();

 }
 catch(err:any){

 generalToast.error(err.message);

 }
 finally{

 setSaving(false);

 }

}

  if (loading) {
    return (
      <div className="p-10 text-center">
        جاري تحميل الإعدادات...
      </div>
    );
  }
    return (
    <div className="container mx-auto py-8">
      <Card className="p-6 space-y-8">

        <h1 className="text-3xl font-black">
          إعدادات المنصة
        </h1>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <Label>اسم الأكاديمية</Label>
            <Input
              value={settings.academy_name}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  academy_name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>البريد الإلكتروني</Label>
            <Input
              value={settings.support_email}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  support_email: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>رقم الواتساب</Label>
            <Input
              value={settings.whatsapp_number}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  whatsapp_number: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>الموقع</Label>
            <Input
              value={settings.location}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  location: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>رابط اللوجو</Label>
            <Input
              value={settings.logo_url}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  logo_url: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label>صورة الصفحة الرئيسية</Label>
            <Input
              value={settings.hero_image}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  hero_image: e.target.value,
                })
              }
            />
          </div>

        </div>

        <hr />

        <h2 className="text-xl font-bold">
          روابط السوشيال ميديا
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <Input
            placeholder="Facebook"
            value={settings.facebook_url}
            onChange={(e) =>
              setSettings({
                ...settings,
                facebook_url: e.target.value,
              })
            }
          />

          <Input
            placeholder="Instagram"
            value={settings.instagram_url}
            onChange={(e) =>
              setSettings({
                ...settings,
                instagram_url: e.target.value,
              })
            }
          />

          <Input
            placeholder="Telegram"
            value={settings.telegram_url}
            onChange={(e) =>
              setSettings({
                ...settings,
                telegram_url: e.target.value,
              })
            }
          />

          <Input
            placeholder="TikTok"
            value={settings.tiktok_url}
            onChange={(e) =>
              setSettings({
                ...settings,
                tiktok_url: e.target.value,
              })
            }
          />

          <Input
            placeholder="Youtube"
            value={settings.youtube_url}
            onChange={(e) =>
              setSettings({
                ...settings,
                youtube_url: e.target.value,
              })
            }
          />

        </div>

        <hr />

        <h2 className="text-xl font-bold">
          خصائص المنصة
        </h2>

        <div className="grid gap-4">

          <label className="flex items-center justify-between rounded-lg border p-4">

            <span>تشغيل الذكاء الاصطناعي</span>

            <input
              type="checkbox"
              checked={settings.ai_enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  ai_enabled: e.target.checked,
                })
              }
            />

          </label>

          <label className="flex items-center justify-between rounded-lg border p-4">

            <span>تفعيل سؤال الأسبوع</span>

            <input
              type="checkbox"
              checked={settings.weekly_question_enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  weekly_question_enabled: e.target.checked,
                })
              }
            />

          </label>

          <label className="flex items-center justify-between rounded-lg border p-4">

            <span>تفعيل الليدربورد</span>

            <input
              type="checkbox"
              checked={settings.leaderboard_enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  leaderboard_enabled: e.target.checked,
                })
              }
            />

          </label>

          <label className="flex items-center justify-between rounded-lg border p-4">

            <span>وضع الصيانة</span>

            <input
              type="checkbox"
              checked={settings.maintenance_mode}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  maintenance_mode: e.target.checked,
                })
              }
            />

          </label>

        </div>

        <Button
 disabled={saving}
 className="w-full"
 size="lg"
 onClick={saveSettings}
>
 {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
</Button>

      </Card>
    </div>
  );
}
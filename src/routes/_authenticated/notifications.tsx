import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data: student } = await supabase
      .from("students")
      .select("grade")
      .eq("id", user.id)
      .single();

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .or(`target_grade.eq.${student?.grade},target_grade.is.null`)
      .order("created_at", { ascending: false });

    setNotifications(data ?? []);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center text-xl font-bold">
        جاري تحميل الإشعارات...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-3">

        <Bell className="h-8 w-8 text-primary" />

        <div>

          <h1 className="text-3xl font-black">
            الإشعارات
          </h1>

          <p className="text-muted-foreground">
            جميع الإشعارات الخاصة بك
          </p>

        </div>

      </div>

      <div className="space-y-4">

        {notifications.length === 0 && (

          <Card className="p-10 text-center">

            لا توجد إشعارات

          </Card>

        )}

        {notifications.map((item) => (

          <Card
            key={item.id}
            className="p-6 transition-all hover:shadow-lg"
          >

            <div className="flex items-start justify-between gap-4">

              <div>

                <h2 className="text-lg font-bold">

                  {item.title}

                </h2>

                <p className="mt-3 text-muted-foreground whitespace-pre-wrap">

                  {item.message}

                </p>

              </div>

              <span className="text-xs text-slate-400 whitespace-nowrap">

                {new Date(item.created_at).toLocaleDateString("ar-EG")}

              </span>

            </div>

          </Card>

        ))}

      </div>

    </div>
  );
}
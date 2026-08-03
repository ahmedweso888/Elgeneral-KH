import {
  createFileRoute,
  Link,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";

import { useAuth } from "@/lib/use-auth";

import { Card } from "@/components/ui/card";

import {
  Settings,
  BookOpen,
  ClipboardList,
  MessageSquareText,
  Radio,
  Video,
  Map,
  Bell,
  Megaphone,
  Trophy,
  CalendarDays,
} from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/admin"
)({
  component: AdminLayout,
});

const tabs = [

  {
    url: "/admin",
    title: "لوحة التحكم",
    icon: Settings,
  },

  {
    url: "/admin/videos",
    title: "الفيديوهات",
    icon: Video,
  },

  {
    url: "/admin/live",
    title: "اللايفات",
    icon: Radio,
  },

  {
    url: "/admin/history",
    title: "الخريطة",
    icon: Map,
  },

  {
    url: "/admin/events",
    title: "المنهج والأحداث",
    icon: BookOpen,
  },

  {
    url: "/admin/exams",
    title: "بنك الامتحانات",
    icon: ClipboardList,
  },

  {
    url: "/admin/style",
    title: "أسلوب التدريس",
    icon: MessageSquareText,
  },

  {
    url: "/admin/announcements",
    title: "الإعلانات",
    icon: Megaphone,
  },

  {
    url: "/admin/notifications",
    title: "الإشعارات",
    icon: Bell,
  },

  {
    url: "/admin/weekly-question",
    title: "سؤال الأسبوع",
    icon: CalendarDays,
  },

  {
    url: "/admin/weekly-winners",
    title: "الفائزون",
    icon: Trophy,
  },

  {
    url: "/admin/settings",
    title: "الإعدادات",
    icon: Settings,
  },

];

function AdminLayout() {

  const {
    isAdmin,
    loading,
  } = useAuth();

  const path = useRouterState({
    select: (r) => r.location.pathname,
  });

  if (loading) {

    return (

      <div className="p-10 text-center text-muted-foreground">

        جاري التحميل...

      </div>

    );

  }

  if (!isAdmin) {

    return (

      <Card className="p-10 text-center">

        هذه الصفحة متاحة للمعلم فقط.

      </Card>

    );

  }

  return (

    <div className="space-y-6">

      <div className="flex flex-wrap gap-2 border-b pb-3">

        {tabs.map((tab) => {

          const active = path === tab.url;

          return (

            <Link
              key={tab.url}
              to={tab.url}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition-all ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >

              <tab.icon className="h-4 w-4" />

              {tab.title}

            </Link>

          );

        })}

      </div>

      <Outlet />

    </div>

  );

}
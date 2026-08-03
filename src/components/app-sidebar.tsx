import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Clock,
  MessageSquareText,
  ClipboardList,
  Castle,
  Trophy,
  Target,
  Settings,
  LogOut,
  BookOpen,
  User,
  Radio,
  Video,
  Map,
  Bell,
  Search,
  ChevronLeft,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";

const studentItems = [
  {
    title: "الرئيسية",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "الملف الشخصي",
    url: "/profile",
    icon: User,
  },
  {
    title: "الخط الزمني",
    url: "/timeline",
    icon: Clock,
  },
  {
    title: "المساعد الذكي",
    url: "/assistant",
    icon: MessageSquareText,
  },
  {
    title: "الخريطة",
    url: "/student/history",
    icon: Map,
  },
  {
    title: "الفيديوهات",
    url: "/student/videos",
    icon: Video,
  },
  {
    title: "البث المباشر",
    url: "/student/live",
    icon: Radio,
  },
  {
    title: "الامتحانات",
    url: "/exams",
    icon: ClipboardList,
  },
  {
    title: "سؤال الأسبوع",
    url: "/student/weekly-question",
    icon: Target,
  },
  {
    title: "توقعات الامتحان",
    url: "/predictions",
    icon: Target,
  },
  {
    title: "مملكتي",
    url: "/kingdom",
    icon: Castle,
  },
  {
    title: "المتصدرين",
    url: "/leaderboard",
    icon: Trophy,
  },
];

const teacherItems = [
  {
    title: "لوحة المعلم",
    url: "/admin",
    icon: Settings,
  },
  {
    title: "المنهج والأحداث",
    url: "/admin/curriculum",
    icon: BookOpen,
  },
  {
    title: "بنك الامتحانات",
    url: "/admin/exams",
    icon: ClipboardList,
  },
  {
    title: "أسلوب التدريس",
    url: "/admin/style",
    icon: MessageSquareText,
  },
  {
  title: "صحة النظام",
  url: "/admin/system-health",
  icon: ShieldCheck,
},
];

export function AppSidebar() {
  const { state } = useSidebar();

  const collapsed = state === "collapsed";

  const navigate = useNavigate();

  const path = useRouterState({
    select: (s) => s.location.pathname,
  });

  const {
    loading,
    user,
    student,
    isAdmin,
  } = useAuth();

  if (loading) return null;

  async function signOut() {
    await supabase.auth.signOut();

    navigate({
      to: "/auth",
      replace: true,
    });
  }

  return (
    <Sidebar
      side="right"
      collapsible="icon"
      className="border-l border-slate-200 bg-white/95 backdrop-blur-xl"
    >
      <SidebarHeader className="border-b border-slate-100 p-5">
        <div className="flex items-center gap-3">
          <div className="relative">

            {student?.avatar ? (
              <img
                src={student.avatar}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-blue-600"
              />
            ) : (
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
                {student?.full_name?.charAt(0) ?? "خ"}
              </div>
            )}

            <span className="absolute -bottom-1 -left-1 h-4 w-4 rounded-full bg-green-500 ring-2 ring-white"></span>

          </div>

          {!collapsed && (
            <div className="flex-1">
              <h2 className="text-base font-black text-slate-900">
                {student?.full_name}
              </h2>

              <p className="text-xs text-slate-500">
                {student?.grade}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4 px-2">
        
      <SidebarGroup>

        <SidebarGroupContent>

          <SidebarMenu className="space-y-1">

            {studentItems.map((item) => {

              const active =
                path === item.url ||
                path.startsWith(item.url + "/");

              return (

                <SidebarMenuItem key={item.url}>

                  <SidebarMenuButton
                    asChild
                    className={`
                      h-12
                      rounded-xl
                      transition-all
                      duration-300
                      px-3

                      ${
                        active
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "hover:bg-slate-100 text-slate-700"
                      }
                    `}
                  >

                    <Link
                      to={item.url}
                      className="flex items-center gap-3 w-full"
                    >

                      <item.icon
                        className={`
                          h-5
                          w-5
                          ${
                            active
                              ? "text-white"
                              : "text-slate-500"
                          }
                        `}
                      />

                      {!collapsed && (

                        <span className="font-semibold">

                          {item.title}

                        </span>

                      )}

                    </Link>

                  </SidebarMenuButton>

                </SidebarMenuItem>

              );

            })}

          </SidebarMenu>

        </SidebarGroupContent>

      </SidebarGroup>

      {isAdmin && (

        <>

          <div className="my-5 h-px bg-slate-200" />

          {!collapsed && (

            <div className="px-4 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400">

              لوحة المعلم

            </div>

          )}

          <SidebarGroup>

            <SidebarGroupContent>

              <SidebarMenu className="space-y-1">

                {teacherItems.map((item) => {

                  const active =
                    path === item.url ||
                    path.startsWith(item.url + "/");

                  return (

                    <SidebarMenuItem key={item.url}>

                      <SidebarMenuButton
                        asChild
                        className={`
                          h-12
                          rounded-xl
                          transition-all
                          duration-300
                          px-3

                          ${
                            active
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                              : "hover:bg-slate-100 text-slate-700"
                          }
                        `}
                      >

                        <Link
                          to={item.url}
                          className="flex items-center gap-3 w-full"
                        >

                          <item.icon
                            className={`
                              h-5
                              w-5
                              ${
                                active
                                  ? "text-white"
                                  : "text-slate-500"
                              }
                            `}
                          />

                          {!collapsed && (

                            <span className="font-semibold">

                              {item.title}

                            </span>

                          )}

                        </Link>

                      </SidebarMenuButton>

                    </SidebarMenuItem>

                  );

                })}

              </SidebarMenu>

            </SidebarGroupContent>

          </SidebarGroup>

        </>

      )}
                  </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-4">

        {!collapsed && (

          <div className="mb-4 rounded-xl bg-slate-50 p-3">

            <div className="text-xs text-slate-500">

              الحساب

            </div>

            <div className="mt-1 truncate text-sm font-semibold text-slate-700">

              {user?.email}

            </div>

          </div>

        )}

        <SidebarMenu>

          <SidebarMenuItem>

            <SidebarMenuButton
              onClick={signOut}
              className="
                h-12
                rounded-xl
                text-red-600
                hover:bg-red-50
                transition-all
              "
            >

              <LogOut className="h-5 w-5" />

              {!collapsed && (

                <span className="font-semibold">

                  تسجيل الخروج

                </span>

              )}

            </SidebarMenuButton>

          </SidebarMenuItem>

        </SidebarMenu>

      </SidebarFooter>

    </Sidebar>

  );

}
import {
  Coins,
  Star,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/use-auth";

import HeaderUserMenu from "@/components/header/HeaderUserMenu";
import HeaderNotifications from "@/components/header/HeaderNotifications";
import HeaderSearch from "@/components/header/HeaderSearch";
import HeaderLogo from "@/components/header/HeaderLogo";

export default function AppHeader() {
  const { student } = useAuth();

  return (
    <header className="sticky top-0 z-50 h-[64px] border-b border-slate-200 bg-white/90 backdrop-blur-xl shadow-sm">

      <div 
        className="flex h-full items-center gap-4 px-7"
        dir="rtl"
      >

        {/* 👤 الطالب */}
        <div className="shrink-0">
          <HeaderUserMenu />
        </div>


        {/* 🔍 البحث */}
        <div className="flex-1 min-w-0">
          <HeaderSearch />
        </div>


        {/* ☰ السايدبار */}
        <div className="shrink-0">
          <SidebarTrigger className="rounded-xl bg-slate-100 p-2 hover:bg-slate-200" />
        </div>


        {/* ⭐ الليفل + 🪙 الكوينز */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">

          <div className="flex items-center gap-2 rounded-2xl bg-blue-50 px-3 py-1.5">
            <Star className="h-5 w-5 text-blue-600" />

            <span className="font-bold">
              Lv {student?.level ?? 1}
            </span>
          </div>


          <div className="flex items-center gap-2 rounded-2xl bg-yellow-50 px-3 py-1.5">

            <Coins className="h-5 w-5 text-yellow-500" />

            <span className="font-bold">
              {student?.coins ?? 0}
            </span>

          </div>

        </div>


        {/* 🔔 الإشعارات */}
        <div className="shrink-0">
          <HeaderNotifications />
        </div>


        {/* 🖼️ اللوجو */}
        <div className="shrink-0">
          <HeaderLogo />
        </div>


      </div>

    </header>
  );
}
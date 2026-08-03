import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";
import { Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";



import {
  User,
  Castle,
  Moon,
  LogOut,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function HeaderUserMenu() {
  const navigate = useNavigate();

  const { student } = useAuth();
    const { theme, toggleTheme } = useTheme();

  async function logout() {
    await supabase.auth.signOut();

    navigate({
      to: "/auth",
      replace: true,
    });
  }

  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <button
          className="
          flex
          items-center
          gap-3
          rounded-2xl
          px-2
          py-2
          transition-all
          hover:bg-slate-100
          "
        >
          <img
            src={
              student?.avatar ||
              `https://ui-avatars.com/api/?name=${student?.full_name}`
            }
            className="
            h-10
            w-10
            rounded-full
            border-2
            border-primary
            object-cover
            "
          />

          <div className="hidden md:block text-right leading-tight">

            <h2 className="font-black text-[15px]">
              {student?.full_name}
            </h2>

            <p className="text-xs text-slate-500">
              الصف {student?.grade}
            </p>

          </div>

          <ChevronDown
            className="
            h-4
            w-4
            text-slate-500
            "
          />

        </button>

      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="
        w-64
        rounded-2xl
        p-2
        "
      >        <DropdownMenuItem
          onClick={() =>
            navigate({
              to: "/profile",
            })
          }
          className="cursor-pointer rounded-xl"
        >
          <User className="ml-2 h-4 w-4" />
          الملف الشخصي
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            navigate({
              to: "/kingdom",
            })
          }
          className="cursor-pointer rounded-xl"
        >
          <Castle className="ml-2 h-4 w-4" />
          مملكتي
        </DropdownMenuItem>

        

        <DropdownMenuSeparator />

<DropdownMenuItem
  onClick={toggleTheme}
  className="cursor-pointer rounded-xl"
>
  {theme === "dark" ? (
    <>
      <Sun className="ml-2 h-4 w-4" />
      الوضع النهاري
    </>
  ) : (
    <>
      <Moon className="ml-2 h-4 w-4" />
      الوضع الليلي
    </>
  )}
</DropdownMenuItem>

        <DropdownMenuItem
          onClick={logout}
          className="
          cursor-pointer
          rounded-xl
          text-red-600
          hover:bg-red-50
          "
        >
          <LogOut className="ml-2 h-4 w-4" />
          تسجيل الخروج
        </DropdownMenuItem>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}
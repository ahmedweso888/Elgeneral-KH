import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HeaderNotifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState<any[]>([]);

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

    if (!student) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .or(`target_grade.eq.${student.grade},target_grade.is.null`)
      .order("created_at", { ascending: false })
      .limit(5);

    setNotifications(data ?? []);
  }

  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <button
          className="
          relative
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-2xl
          bg-slate-100
          transition-all
          hover:bg-slate-200
          "
        >
          <Bell className="h-5 w-5 text-slate-700" />

          {notifications.length > 0 && (
            <span className="absolute right-2 top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
              {notifications.length}
            </span>
          )}

        </button>

      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[390px] rounded-2xl overflow-hidden p-0"
      >

        <div className="flex items-center justify-between border-b bg-slate-50 px-5 py-4">

          <h2 className="text-lg font-black">
            🔔 الإشعارات
          </h2>

          <span className="text-xs text-slate-500">
            {notifications.length} جديدة
          </span>

        </div>

        <div className="max-h-[420px] overflow-y-auto">

          {notifications.length === 0 && (

            <div className="py-10 text-center text-slate-500">

              لا توجد إشعارات

            </div>

          )}

          {notifications.map((item) => (

            <button
              key={item.id}
              className="
              w-full
              border-b
              px-5
              py-4
              text-right
              transition-all
              hover:bg-slate-50
              "
            >

              <h3 className="font-bold text-slate-800">

                {item.title}

              </h3>

              <p className="mt-2 text-sm text-slate-500 line-clamp-2">

                {item.message}

              </p>

              <div className="mt-3 text-xs text-slate-400">

                {new Date(item.created_at).toLocaleDateString("ar-EG")}

              </div>

            </button>

          ))}

        </div>

        <div className="border-t bg-slate-50 p-3">

          <button
            onClick={() =>
              navigate({
                to: "/notifications",
              })
            }
            className="
            w-full
            rounded-xl
            bg-primary
            py-3
            text-sm
            font-bold
            text-white
            transition-all
            hover:opacity-90
            "
          >
            عرض كل الإشعارات
          </button>

        </div>

      </DropdownMenuContent>

    </DropdownMenu>
  );
}
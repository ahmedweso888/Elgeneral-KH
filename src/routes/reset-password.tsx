import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  async function save() {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      generalToast.error(error.message);
      return;
    }

    generalToast.success("تم تغيير كلمة المرور");

    navigate({
      to: "/auth",
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="w-[400px] space-y-4">

        <h1 className="text-2xl font-bold">
          تغيير كلمة المرور
        </h1>

        <Input
          type="password"
          placeholder="كلمة المرور الجديدة"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          onClick={save}
          className="w-full"
        >
          حفظ
        </Button>

      </div>

    </div>
  );
}
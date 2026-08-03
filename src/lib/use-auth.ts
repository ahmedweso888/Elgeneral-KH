import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);

  const [student, setStudent] = useState<any>(null);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUser(user);

    const { data } = await supabase
      .from("students")
      .select("*")
      .eq("id", user.id)
      .single();

    setStudent(data);

    setIsAdmin(data?.is_admin === true);
    console.log("Auth User:", user.id);
console.log("Student:", data);
console.log("isAdmin:", data?.is_admin);

    setLoading(false);
  }

  return {
    loading,
    user,
    student,
    isAdmin,
  };
}
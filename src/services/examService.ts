import { supabase } from "@/integrations/supabase/client";

export async function deleteExam(
  examId: string
) {

  const { data, error } =
    await supabase.functions.invoke(
      "exam-delete",
      {
        body: {
          examId,
        },
      }
    );

  if (error) throw error;

  return data;

}
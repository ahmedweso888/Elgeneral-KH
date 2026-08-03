import { supabase } from "@/integrations/supabase/client";

export async function deleteHistoricalEra(
  eraId: string
) {

  const { data, error } =
    await supabase.functions.invoke(
      "history-delete",
      {
        body: {
          eraId,
        },
      }
    );

  if (error) {

    throw error;

  }

  return data;

}
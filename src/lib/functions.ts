import { supabase } from "@/integrations/supabase/client";

export async function invokeFunction(

  name:string,

  body:any

){

  const{

    data,

    error,

  }=await supabase.functions.invoke(

    name,

    {

      body,

    }

  );

  if(error){

    throw error;

  }

  return data;

}
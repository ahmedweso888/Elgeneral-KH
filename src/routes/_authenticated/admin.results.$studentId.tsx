import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
import { invokeFunction } from "@/lib/functions";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute(
  "/_authenticated/admin/results/$studentId"
)({
  component: StudentResultsPage,
});

function StudentResultsPage() {

  const { studentId } =
    Route.useParams();

  const [loading,setLoading]=
    useState(true);

  const [results,setResults]=
    useState<any[]>([]);

  useEffect(()=>{

    loadResults();

  },[]);

  async function loadResults(){

    setLoading(true);

    const {data,error}=await supabase

      .from("results")

      .select(`
      *,
      exams(
        title,
        total_marks
      )
      `)

      .eq("student_id",studentId)

      .order("created_at",{

        ascending:false,

      });

    if(error){

      generalToast.error(error.message);

      setLoading(false);

      return;

    }

    setResults(data??[]);

    setLoading(false);

  }

  async function recalculate(){

    try{

      await invokeFunction(

        "calculate-results",

        {

          studentId,

        }

      );

      generalToast.success("تم إعادة الحساب");

      loadResults();

    }

    catch(err:any){

      generalToast.error(err.message);

    }

  }

  if(loading){

    return(

      <div className="p-10">

        جاري تحميل النتائج...

      </div>

    );

  }

  return(

    <div className="container mx-auto py-8 space-y-8">

      <div className="flex justify-between">

        <h1 className="text-4xl font-black">

          نتائج الطالب

        </h1>

        <Button

          onClick={recalculate}

        >

          إعادة حساب النتائج

        </Button>

      </div>

      <div className="space-y-5">

        {results.length===0 ?(

          <Card className="p-8">

            لا توجد نتائج

          </Card>

        ):(

          results.map(result=>(

            <Card

              key={result.id}

              className="p-6"

            >

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="text-2xl font-bold">

                    {result.exams?.title}

                  </h2>

                  <p>

                    الدرجة

                    {" "}

                    {result.score}

                    /

                    {result.total_marks}

                  </p>

                </div>

                <div className="text-right">

                  <div className="text-green-600 font-bold text-2xl">

                    {Math.round(

                      (result.score/

                      result.total_marks)

                      *100

                    )}%

                  </div>

                </div>

              </div>

            </Card>

          ))

        )}

      </div>

    </div>

  );

}
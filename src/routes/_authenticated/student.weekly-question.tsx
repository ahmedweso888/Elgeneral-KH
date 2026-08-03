import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute(
  "/_authenticated/student/weekly-question"
)({
  component: StudentWeeklyQuestionPage,
});

function StudentWeeklyQuestionPage() {

  const [loading,setLoading]=
    useState(true);

  const [question,setQuestion]=
    useState<any>(null);

  const [student,setStudent]=
    useState<any>(null);

  const [selected,setSelected]=
    useState("");

  const [answered,setAnswered]=
    useState(false);

  useEffect(()=>{

    load();

  },[]);

  async function load(){

    setLoading(true);

    const {

      data:{
        user

      }

    }=await supabase.auth.getUser();

    if(!user){

      setLoading(false);

      return;

    }

    const{

      data:studentData

    }=await supabase

      .from("students")

      .select("*")

      .eq("id",user.id)

      .single();

    setStudent(studentData);

    const{

      data:weeklyQuestion

    }=await supabase

      .from("weekly_questions")

      .select("*")

      .eq("is_active",true)

      .single();

    setQuestion(weeklyQuestion);

    if(weeklyQuestion){

      const{

        data:answer

      }=await supabase

        .from("weekly_answers")

        .select("id")

        .eq(

          "student_id",

          user.id

        )

        .eq(

          "weekly_question_id",

          weeklyQuestion.id

        )

        .maybeSingle();

      if(answer){

        setAnswered(true);

      }

    }

    setLoading(false);

  }

  async function submitAnswer(){

    if(answered){

      generalToast.error("لقد قمت بالإجابة بالفعل");

      return;

    }

    if(!selected){

      generalToast.error("اختر إجابة");

      return;

    }

    const isCorrect=

      selected===

      question.correct_answer;

    const{

      error

    }=await supabase

      .from("weekly_answers")

      .insert({

        weekly_question_id:

          question.id,

        student_id:

          student.id,

        selected_answer:

          selected,

        is_correct:

          isCorrect,

        reward_claimed:

          isCorrect,

      });

    if(error){

      generalToast.error(error.message);

      return;

    }

    if(isCorrect){

      await supabase

        .from("students")

        .update({

          coins:

            (student.coins??0)+

            (question.reward_points??0),

          xp:

            (student.xp??0)+

            (question.reward_points??0),

        })

        .eq(

          "id",

          student.id

        );

      generalToast.success(

        "إجابة صحيحة 🎉"

      );

    }else{

      generalToast.error(

        "إجابة خاطئة"

      );

    }

    setAnswered(true);

  }

  if(loading){

    return(

      <div className="p-10">

        جاري التحميل...

      </div>

    );

  }

  if(!question){

    return(

      <div className="p-10">

        لا يوجد سؤال أسبوعي حاليا

      </div>

    );

  }

  return(

    <div className="container mx-auto py-8">

      <Card className="p-6 space-y-6">

        <h1 className="text-3xl font-black">

          سؤال الأسبوع

        </h1>

        {question.image_url&&(

          <img

            src={question.image_url}

            className="w-full rounded-xl"

          />

        )}

        <h2 className="text-xl font-bold">

          {question.title}

        </h2>

        <p>

          {question.question}

        </p>
                <div className="space-y-3">

          <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">

            <input
              type="radio"
              checked={selected==="A"}
              onChange={()=>
                setSelected("A")
              }
            />

            <span>

              {question.option_a}

            </span>

          </label>

          <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">

            <input
              type="radio"
              checked={selected==="B"}
              onChange={()=>
                setSelected("B")
              }
            />

            <span>

              {question.option_b}

            </span>

          </label>

          <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">

            <input
              type="radio"
              checked={selected==="C"}
              onChange={()=>
                setSelected("C")
              }
            />

            <span>

              {question.option_c}

            </span>

          </label>

          <label className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer">

            <input
              type="radio"
              checked={selected==="D"}
              onChange={()=>
                setSelected("D")
              }
            />

            <span>

              {question.option_d}

            </span>

          </label>

        </div>

        <Button

          disabled={answered}

          onClick={submitAnswer}

          className="w-full"

        >

          {answered

            ? "تم إرسال الإجابة"

            : "إرسال الإجابة"}

        </Button>

      </Card>

    </div>

  );

}
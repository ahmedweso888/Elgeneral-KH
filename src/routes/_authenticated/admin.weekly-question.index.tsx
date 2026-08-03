import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { invokeFunction } from "@/lib/functions";
import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute(
  "/_authenticated/admin/weekly-question/"
)({
  component: WeeklyQuestionPage,
});

function WeeklyQuestionPage() {

  const [loading,setLoading]=
    useState(true);

  const [questions,setQuestions]=
    useState<any[]>([]);

  const [title,setTitle]=
    useState("");

  const [question,setQuestion]=
    useState("");

  const [optionA,setOptionA]=
    useState("");

  const [optionB,setOptionB]=
    useState("");

  const [optionC,setOptionC]=
    useState("");

  const [optionD,setOptionD]=
    useState("");

  const [correct,setCorrect]=
    useState("A");

  const [rewardTitle,setRewardTitle]=
    useState("");

  const [rewardDescription,setRewardDescription]=
    useState("");

  const [rewardPoints,setRewardPoints]=
    useState(100);

  const [startAt,setStartAt]=
    useState("");

  const [endAt,setEndAt]=
    useState("");

  const [image,setImage]=
    useState<File|null>(null);

  useEffect(()=>{

    loadQuestions();

  },[]);

  async function loadQuestions(){

    setLoading(true);

    const {data}=await supabase

      .from("weekly_questions")

      .select("*")

      .order("created_at",{
        ascending:false,
      });

    setQuestions(data??[]);

    setLoading(false);

  }
  async function createQuestion() {

  try {

    if (!title.trim()) {

      generalToast.error("اكتب عنوان السؤال");

      return;

    }

    let imageUrl: string | null = null;

    if (image) {

     const fileName =
`${Date.now()}-${Math.random().toString(36).slice(2)}.${
  image.name.split(".").pop()
}`;

      const upload = await supabase.storage

        .from("weekly-question-images")

        .upload(fileName, image);

      if (upload.error) throw upload.error;

      imageUrl = supabase.storage

        .from("weekly-question-images")

        .getPublicUrl(fileName)

        .data.publicUrl;

    }

    await invokeFunction(

  "weekly-question-create",

  {

    title,

    question,

    option_a:optionA,

    option_b:optionB,

    option_c:optionC,

    option_d:optionD,

    correct_answer:correct,

    reward_title:rewardTitle,

    reward_description:rewardDescription,

    reward_points:rewardPoints,

    start_at:startAt,

    end_at:endAt,

    image_url:imageUrl,

    is_active:true,

  }

);

    generalToast.success("تم إنشاء السؤال الأسبوعي");

    setTitle("");

    setQuestion("");

    setOptionA("");

    setOptionB("");

    setOptionC("");

    setOptionD("");

    setCorrect("A");

    setRewardTitle("");

    setRewardDescription("");

    setRewardPoints(100);

    setStartAt("");

    setEndAt("");

    setImage(null);

    loadQuestions();

  } catch (err:any) {

    generalToast.error(err.message);

  }

}

async function deleteQuestion(id:string){

  if(!confirm("حذف السؤال؟")) return;

  try{

    await invokeFunction(
  "weekly-question-delete",
  {
    weeklyQuestionId: id,
  }
);
    

    generalToast.success("تم حذف السؤال");

    loadQuestions();

  }

  catch(err:any){

    generalToast.error(err.message);

  }

}

async function toggleQuestion(
  id: string,
  isActive: boolean
) {

  try {

    await invokeFunction(
      "weekly-question-toggle",
      {
        questionId: id,
        isActive: !isActive,
      }
    );

    generalToast.success(
      !isActive
        ? "تم تفعيل السؤال"
        : "تم إيقاف السؤال"
    );

    loadQuestions();

  }

  catch (err: any) {

    generalToast.error(err.message);

  }

}

if(loading){

  return(

    <div className="p-10">

      جاري تحميل السؤال الأسبوعي...

    </div>

  );

}
return (

  <div className="container mx-auto py-8 space-y-8">

    <h1 className="text-4xl font-black">

      السؤال الأسبوعي

    </h1>

    <Card className="p-6 space-y-5">

      <h2 className="text-2xl font-bold">

        إنشاء سؤال جديد

      </h2>

      <Input
        placeholder="عنوان السؤال"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      />

      <Input
        placeholder="السؤال"
        value={question}
        onChange={(e)=>setQuestion(e.target.value)}
      />

      <div className="grid md:grid-cols-2 gap-4">

        <Input
          placeholder="A"
          value={optionA}
          onChange={(e)=>setOptionA(e.target.value)}
        />

        <Input
          placeholder="B"
          value={optionB}
          onChange={(e)=>setOptionB(e.target.value)}
        />

        <Input
          placeholder="C"
          value={optionC}
          onChange={(e)=>setOptionC(e.target.value)}
        />

        <Input
          placeholder="D"
          value={optionD}
          onChange={(e)=>setOptionD(e.target.value)}
        />

      </div>

      <div className="grid md:grid-cols-3 gap-4">

        <div>

          <Label>الإجابة الصحيحة</Label>

          <select
            className="w-full border rounded-md h-10 px-3"
            value={correct}
            onChange={(e)=>setCorrect(e.target.value)}
          >

            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>

          </select>

        </div>

        <Input
          placeholder="اسم المكافأة"
          value={rewardTitle}
          onChange={(e)=>setRewardTitle(e.target.value)}
        />

        <Input
          placeholder="عدد النقاط"
          type="number"
          value={rewardPoints}
          onChange={(e)=>
            setRewardPoints(Number(e.target.value))
          }
        />

      </div>

      <Input
        placeholder="وصف المكافأة"
        value={rewardDescription}
        onChange={(e)=>
          setRewardDescription(e.target.value)
        }
      />

      <div className="grid md:grid-cols-2 gap-4">

        <div>

          <Label>يبدأ</Label>

          <Input
            type="datetime-local"
            value={startAt}
            onChange={(e)=>setStartAt(e.target.value)}
          />

        </div>

        <div>

          <Label>ينتهي</Label>

          <Input
            type="datetime-local"
            value={endAt}
            onChange={(e)=>setEndAt(e.target.value)}
          />

        </div>

      </div>

      <Input
        type="file"
        accept="image/*"
        onChange={(e)=>
          setImage(
            e.target.files?.[0] ?? null
          )
        }
      />

      <Button
        onClick={createQuestion}
      >

        إنشاء السؤال

      </Button>

    </Card>

    <div className="grid lg:grid-cols-2 gap-5">

      {questions.map((item)=>(

        <Card
          key={item.id}
          className="overflow-hidden"
        >

          {item.image_url && (

            <img
              src={item.image_url}
              className="w-full h-56 object-cover"
            />

          )}

          <div className="p-5 space-y-3">

            <h2 className="text-xl font-bold">

              {item.title}

            </h2>

            <p>

              {item.question}

            </p>

            <div className="flex gap-2 flex-wrap">

              <Button
                variant="secondary"
                onClick={()=>
                  toggleQuestion(
                    item.id,
                    item.is_active
                  )
                }
              >

                {item.is_active
                  ? "إيقاف"
                  : "تفعيل"}

              </Button>

              <Button
                variant="destructive"
                onClick={()=>
                  deleteQuestion(item.id)
                }
              >

                حذف

              </Button>

            </div>

          </div>

        </Card>

      ))}

    </div>

  </div>

);

}
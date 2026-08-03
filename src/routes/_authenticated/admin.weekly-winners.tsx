import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { generalToast } from "@/lib/general-toast";

export const Route = createFileRoute(
  "/_authenticated/admin/weekly-winners"
)({
  component: WeeklyWinnersPage,
});

function WeeklyWinnersPage() {

  const [loading, setLoading] =
    useState(true);

  const [answers, setAnswers] =
    useState<any[]>([]);

  useEffect(() => {

    loadAnswers();

  }, []);

  async function loadAnswers() {

    setLoading(true);

    const { data, error } =
      await supabase

        .from("weekly_answers")

        .select(`
          *,
          students(
            full_name,
            grade,
            avatar
          ),
          weekly_questions(
            title,
            reward_title,
            reward_points
          )
        `)

        .eq("is_correct", true)

        .order("answered_at", {
          ascending: false,
        });

    if (error) {

      generalToast.error(error.message);

    }

    setAnswers(data ?? []);

    setLoading(false);

  }

  async function deleteWinner(id: string) {

    if (!confirm("حذف الفائز؟")) return;

    const { error } =
      await supabase

        .from("weekly_answers")

        .delete()

        .eq("id", id);

    if (error) {

      generalToast.error(error.message);

      return;

    }

    generalToast.success("تم الحذف");

    loadAnswers();

  }

  if (loading) {

    return (

      <div className="p-10">

        جاري تحميل الفائزين...

      </div>

    );

  }

  return (

    <div className="container mx-auto py-8 space-y-8">

      <h1 className="text-4xl font-black">

        الفائزون بالسؤال الأسبوعي

      </h1>

      <div className="grid lg:grid-cols-2 gap-5">

        {answers.map((item) => (

          <Card
            key={item.id}
            className="p-5"
          >

            <div className="flex gap-4 items-center">

              {item.students?.avatar && (

                <img
                  src={item.students.avatar}
                  className="w-20 h-20 rounded-full object-cover"
                />

              )}

              <div className="flex-1">

                <h2 className="text-xl font-bold">

                  {item.students?.full_name}

                </h2>

                <p className="text-muted-foreground">

                  {item.students?.grade}

                </p>

              </div>

            </div>

            <div className="mt-5 space-y-2">

              <p>

                <strong>السؤال:</strong>{" "}
                {item.weekly_questions?.title}

              </p>

              <p>

                <strong>المكافأة:</strong>{" "}
                {item.weekly_questions?.reward_title}

              </p>

              <p>

                <strong>Coins / XP:</strong>{" "}
                {item.weekly_questions?.reward_points}

              </p>

              <p>

                <strong>تاريخ الفوز:</strong>{" "}
                {new Date(
                  item.answered_at
                ).toLocaleString("ar-EG")}

              </p>

            </div>

            <div className="mt-5">

              <Button
                variant="destructive"
                onClick={() =>
                  deleteWinner(item.id)
                }
              >

                حذف

              </Button>

            </div>

          </Card>

        ))}
      </div>

      {answers.length === 0 && (

        <Card className="p-10 text-center">

          لا يوجد فائزون حتى الآن

        </Card>

      )}

    </div>

  );

}
import { Card } from "@/components/ui/card";

type Props = {
  student: any;
};

export default function ProfileCard({ student }: Props) {
  if (!student) return null;

  const progress = student.xp % 100;

  return (
    <Card className="p-6 shadow-lg rounded-2xl">

      <div className="flex items-center gap-5">

        <img
          src={
            student.avatar ||
            "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=" +
              encodeURIComponent(student.full_name)
          }
          alt={student.full_name}
          className="w-24 h-24 rounded-full object-cover border-4 border-primary"
        />

        <div className="flex-1">

          <h2 className="text-2xl font-bold">
            {student.full_name}
          </h2>

          <p className="text-muted-foreground">
            الصف {student.grade}
          </p>

          <div className="mt-3 flex gap-4 flex-wrap">

            <div className="bg-primary/10 rounded-xl px-4 py-2">

              <div className="text-xs text-muted-foreground">
                المستوى
              </div>

              <div className="font-bold text-lg">
                {student.level}
              </div>

            </div>

            <div className="bg-yellow-500/10 rounded-xl px-4 py-2">

              <div className="text-xs text-muted-foreground">
                العملات
              </div>

              <div className="font-bold text-lg">
                🪙 {student.coins}
              </div>

            </div>

          </div>

        </div>

      </div>

      <div className="mt-6">

        <div className="flex justify-between text-sm mb-2">

          <span>XP</span>

          <span>{student.xp}</span>

        </div>

        <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
   <div
    className="h-full bg-primary transition-all duration-500"
    style={{ width: `${progress}%` }}
  />
</div>
 </div>

    </Card>
  );
}
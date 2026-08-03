import { Card } from "@/components/ui/card";

type Props = {
    student:any;
    leaderboard:any;
};

export default function StatsCards({student,leaderboard}:Props){

if(!student) return null;

return(

<div className="grid gap-4 md:grid-cols-4">

<Card className="p-5">
<div className="text-sm text-muted-foreground">
Coins
</div>

<div className="text-3xl font-bold">
🪙 {student.coins}
</div>
</Card>

<Card className="p-5">
<div className="text-sm text-muted-foreground">
XP
</div>

<div className="text-3xl font-bold">
⭐ {student.xp}
</div>
</Card>

<Card className="p-5">
<div className="text-sm text-muted-foreground">
Level
</div>

<div className="text-3xl font-bold">
🏅 {student.level}
</div>
</Card>

<Card className="p-5">
<div className="text-sm text-muted-foreground">
Rank
</div>

<div className="text-3xl font-bold">
🏆 #{leaderboard?.current_rank ?? "-"}
</div>
</Card>

</div>

);

}
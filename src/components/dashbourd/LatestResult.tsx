import { Card } from "@/components/ui/card";

type Props={

result:any;

};

export default function LatestResult({result}:Props){

if(!result){

return(

<Card className="p-6">

لا يوجد نتائج حتى الآن

</Card>

);

}

return(

<Card className="p-6">

<h2 className="font-bold text-xl mb-4">

آخر امتحان

</h2>

<div className="text-5xl font-black text-primary">

{result.percentage}%

</div>

<p className="mt-3">

الدرجة

{result.score}

/

{result.total_marks}

</p>

<p className="mt-4 text-muted-foreground">

{result.ai_comment}

</p>

</Card>

);

}
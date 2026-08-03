import { Card } from "@/components/ui/card";

type Props={

prediction:any;

};

export default function AIPrediction({prediction}:Props){

if(!prediction){

return(

<Card className="p-6">

لا توجد توقعات حتى الآن

</Card>

);

}

return(

<Card className="p-6">

<h2 className="font-bold text-xl mb-5">

🤖 توقع الذكاء الاصطناعي

</h2>

<div className="text-5xl font-black text-primary">

{prediction.predicted_score}

</div>

<div className="mt-6 space-y-5">

<div>

<h3 className="font-bold">

نقاط القوة

</h3>

<p>

{prediction.strengths}

</p>

</div>

<div>

<h3 className="font-bold">

نقاط الضعف

</h3>

<p>

{prediction.weaknesses}

</p>

</div>

<div>

<h3 className="font-bold">

خطة المذاكرة

</h3>

<p>

{prediction.study_plan}

</p>

</div>

</div>

</Card>

);

}
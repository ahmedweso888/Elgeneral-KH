import { Card } from "@/components/ui/card";

type Props = {

events:any[];

};

export default function UpcomingEvents({events}:Props){

return(

<Card className="p-6">

<h2 className="font-bold text-xl mb-5">

📅 الأحداث القادمة

</h2>

{

events.length===0 &&(

<p>

لا توجد أحداث

</p>

)

}

<div className="space-y-4">

{

events.map(event=>(

<div
key={event.id}
className="border rounded-xl p-4"
>

<h3 className="font-bold">

{event.title}

</h3>

<p className="text-muted-foreground">

{event.description}

</p>

<p className="text-sm mt-2">

{new Date(event.event_date).toLocaleDateString("ar-EG")}

</p>

</div>

))

}

</div>

</Card>

);

}
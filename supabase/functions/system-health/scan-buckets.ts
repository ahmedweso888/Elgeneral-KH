import type { BucketResult } from "./types.ts";

const REQUIRED_BUCKETS = [

"avatars",

"exam-questions",

"exam-images",

"history-images",

"videos",

"video-thumbnails",

"events",

"weekly-question-images",

"attachments",

"logos",

"live",

"event-images",

"announcement-images",

];

export async function scanBuckets():Promise<BucketResult>{

    const token=Deno.env.get("MGMT_ACCESS_TOKEN");

    const project=Deno.env.get("PROJECT_REF");

    if(!token||!project){

        return{

            ok:false,

            total:REQUIRED_BUCKETS.length,

            existing:[],

            missing:REQUIRED_BUCKETS,

        };

    }

    const res=await fetch(

`https://api.supabase.com/v1/projects/${project}/storage/buckets`,

{

headers:{

Authorization:`Bearer ${token}`,

apikey:token,

},

}

);

    if(!res.ok){

        throw new Error(

            "Unable to load buckets."

        );

    }

    const buckets=await res.json();

    const names:string[]=buckets.map(

        (b:any)=>b.name

    );

    const existing:string[]=[];

    const missing:string[]=[];

    for(const bucket of REQUIRED_BUCKETS){

        if(names.includes(bucket))

            existing.push(bucket);

        else

            missing.push(bucket);

    }

    return{

        ok:missing.length===0,

        total:REQUIRED_BUCKETS.length,

        existing,

        missing,

    };

}
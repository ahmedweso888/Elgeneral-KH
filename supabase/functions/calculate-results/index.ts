import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

import { scoreEngine } from "./score-engine.ts";
import { xpEngine } from "./xp-engine.ts";
import { coinsEngine } from "./coins-engine.ts";
import { levelEngine } from "./level-engine.ts";
import { leaderboardEngine } from "./leaderboard-engine.ts";
import { activityEngine } from "./activity-engine.ts";
import { notificationEngine } from "./notification-engine.ts";
import { aiEngine } from "./ai-engine.ts";
import { kingdomEngine } from "./kingdom-engine.ts";

export default {

  fetch: withSupabase(

    {


    },

    async(req,ctx)=>{

      try{

        const{

          attemptId,

        }=await req.json();

        if(!attemptId){

          return Response.json(

            {

              error:"attemptId is required",

            },

            {

              status:400,

            }

          );

        }

        //--------------------------------------------------
        // Score Engine
        //--------------------------------------------------

        const result=

          await scoreEngine(

            ctx,

            attemptId

          );

        if(!result.success){

          return Response.json(result);

        }

        //--------------------------------------------------
        // XP
        //--------------------------------------------------

        await xpEngine(

          ctx,

          result

        );

        //--------------------------------------------------
        // Coins
        //--------------------------------------------------

        await coinsEngine(

          ctx,

          result

        );

        //--------------------------------------------------
        // Level
        //--------------------------------------------------

        await levelEngine(

          ctx,

          result

        );

        //--------------------------------------------------
        // Leaderboard
        //--------------------------------------------------

        await leaderboardEngine(

          ctx,

          result

        );

        //--------------------------------------------------
        // Activity
        //--------------------------------------------------

        await activityEngine(

          ctx,

          result

        );

        //--------------------------------------------------
        // AI
        //--------------------------------------------------

        await aiEngine(

          ctx,

          result

        );

        //--------------------------------------------------
        // Kingdom
        //--------------------------------------------------

        await kingdomEngine(

          ctx,

          result

        );

        //--------------------------------------------------
        // Notification
        //--------------------------------------------------

        await notificationEngine(

          ctx,

          result

        );

        //--------------------------------------------------
        // Done
        //--------------------------------------------------

        return Response.json({

          success:true,

          result,

        });

      }

      catch(error){

        console.error(error);

        return Response.json(

          {

            success:false,

            error:

              error instanceof Error

              ?error.message

              :"Unknown Error",

          },

          {

            status:500,

          }

        );

      }

    }

  )

};
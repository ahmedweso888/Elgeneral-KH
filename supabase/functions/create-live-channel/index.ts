import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

import {
  IVSClient,
  CreateChannelCommand,
  CreateStreamKeyCommand,
} from "npm:@aws-sdk/client-ivs";

const client = new IVSClient({
  region: Deno.env.get("AWS_REGION"),
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID")!,
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY")!,
  },
});

serve(async (_req) => {
  try {
    //----------------------------------
    // Create Channel
    //----------------------------------

    const channel = await client.send(
      new CreateChannelCommand({
        latencyMode: "LOW",
        type: "STANDARD",
        authorized: false,
        name: `live-${crypto.randomUUID()}`,
      })
    );

    if (!channel.channel?.arn) {
      throw new Error("Channel creation failed");
    }

    //----------------------------------
    // Create Stream Key
    //----------------------------------

    const streamKey = await client.send(
      new CreateStreamKeyCommand({
        channelArn: channel.channel.arn,
      })
    );

    //----------------------------------
    // Return
    //----------------------------------

    return new Response(
      JSON.stringify({
        success: true,
        streamKey: streamKey.streamKey?.value,
        playbackUrl: channel.channel.playbackUrl,
        channelArn: channel.channel.arn,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});